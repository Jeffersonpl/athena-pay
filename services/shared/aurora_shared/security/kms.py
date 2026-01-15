"""
Key Management Service (KMS) Integration

SEC-005: Secure key management using external KMS providers.

Supports:
- AWS KMS
- HashiCorp Vault
- Azure Key Vault
- Local development fallback (for dev only)

Usage:
    kms = KMSProvider.create()
    key = await kms.get_data_key("my-key-id")
    encrypted = await kms.encrypt("sensitive data", "my-key-id")
    decrypted = await kms.decrypt(encrypted, "my-key-id")
"""

import os
import base64
import logging
import hashlib
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional, Dict, Any
from enum import Enum
from functools import lru_cache

logger = logging.getLogger(__name__)


class KMSProvider(str, Enum):
    AWS = "aws"
    VAULT = "vault"
    AZURE = "azure"
    LOCAL = "local"  # Development only


@dataclass
class KMSConfig:
    """KMS Configuration"""
    provider: KMSProvider = field(
        default_factory=lambda: KMSProvider(os.getenv("KMS_PROVIDER", "local"))
    )

    # AWS KMS
    aws_region: str = field(default_factory=lambda: os.getenv("AWS_REGION", "us-east-1"))
    aws_key_id: str = field(default_factory=lambda: os.getenv("AWS_KMS_KEY_ID", ""))

    # HashiCorp Vault
    vault_addr: str = field(default_factory=lambda: os.getenv("VAULT_ADDR", "http://localhost:8200"))
    vault_token: str = field(default_factory=lambda: os.getenv("VAULT_TOKEN", ""))
    vault_mount: str = field(default_factory=lambda: os.getenv("VAULT_MOUNT", "transit"))

    # Azure Key Vault
    azure_vault_url: str = field(default_factory=lambda: os.getenv("AZURE_VAULT_URL", ""))
    azure_key_name: str = field(default_factory=lambda: os.getenv("AZURE_KEY_NAME", ""))

    # Local fallback (DEV ONLY - NOT FOR PRODUCTION)
    local_master_key: str = field(
        default_factory=lambda: os.getenv("ENCRYPTION_MASTER_KEY", "")
    )


class BaseKMS(ABC):
    """Abstract base class for KMS providers"""

    @abstractmethod
    async def get_data_key(self, key_id: str) -> bytes:
        """Get or generate a data encryption key"""
        pass

    @abstractmethod
    async def encrypt(self, plaintext: str, key_id: str) -> str:
        """Encrypt data using the specified key"""
        pass

    @abstractmethod
    async def decrypt(self, ciphertext: str, key_id: str) -> str:
        """Decrypt data using the specified key"""
        pass

    @abstractmethod
    async def rotate_key(self, key_id: str) -> bool:
        """Rotate the encryption key"""
        pass


# =============================================================================
# AWS KMS PROVIDER
# =============================================================================

class AWSKMS(BaseKMS):
    """
    AWS Key Management Service provider.

    Uses AWS KMS for key management and envelope encryption.
    Requires: boto3
    """

    def __init__(self, config: KMSConfig):
        self.config = config
        self._client = None

    def _get_client(self):
        if self._client is None:
            import boto3
            self._client = boto3.client(
                'kms',
                region_name=self.config.aws_region
            )
        return self._client

    async def get_data_key(self, key_id: str) -> bytes:
        """Generate a data key using AWS KMS"""
        client = self._get_client()
        response = client.generate_data_key(
            KeyId=key_id or self.config.aws_key_id,
            KeySpec='AES_256'
        )
        return response['Plaintext']

    async def encrypt(self, plaintext: str, key_id: str) -> str:
        """Encrypt using AWS KMS"""
        client = self._get_client()
        response = client.encrypt(
            KeyId=key_id or self.config.aws_key_id,
            Plaintext=plaintext.encode('utf-8')
        )
        return base64.b64encode(response['CiphertextBlob']).decode('utf-8')

    async def decrypt(self, ciphertext: str, key_id: str) -> str:
        """Decrypt using AWS KMS"""
        client = self._get_client()
        response = client.decrypt(
            CiphertextBlob=base64.b64decode(ciphertext),
            KeyId=key_id or self.config.aws_key_id
        )
        return response['Plaintext'].decode('utf-8')

    async def rotate_key(self, key_id: str) -> bool:
        """Enable automatic key rotation"""
        client = self._get_client()
        client.enable_key_rotation(KeyId=key_id or self.config.aws_key_id)
        logger.info(f"Key rotation enabled for {key_id}")
        return True


# =============================================================================
# HASHICORP VAULT PROVIDER
# =============================================================================

class VaultKMS(BaseKMS):
    """
    HashiCorp Vault Transit Secrets Engine provider.

    Uses Vault for key management with transit engine.
    Requires: hvac
    """

    def __init__(self, config: KMSConfig):
        self.config = config
        self._client = None

    def _get_client(self):
        if self._client is None:
            import hvac
            self._client = hvac.Client(
                url=self.config.vault_addr,
                token=self.config.vault_token
            )
            if not self._client.is_authenticated():
                raise Exception("Vault authentication failed")
        return self._client

    async def get_data_key(self, key_id: str) -> bytes:
        """Generate a data key using Vault transit"""
        client = self._get_client()
        response = client.secrets.transit.generate_data_key(
            name=key_id,
            key_type='aes256-gcm96',
            mount_point=self.config.vault_mount
        )
        return base64.b64decode(response['data']['plaintext'])

    async def encrypt(self, plaintext: str, key_id: str) -> str:
        """Encrypt using Vault transit"""
        client = self._get_client()
        response = client.secrets.transit.encrypt_data(
            name=key_id,
            plaintext=base64.b64encode(plaintext.encode()).decode(),
            mount_point=self.config.vault_mount
        )
        return response['data']['ciphertext']

    async def decrypt(self, ciphertext: str, key_id: str) -> str:
        """Decrypt using Vault transit"""
        client = self._get_client()
        response = client.secrets.transit.decrypt_data(
            name=key_id,
            ciphertext=ciphertext,
            mount_point=self.config.vault_mount
        )
        return base64.b64decode(response['data']['plaintext']).decode()

    async def rotate_key(self, key_id: str) -> bool:
        """Rotate the transit key"""
        client = self._get_client()
        client.secrets.transit.rotate_key(
            name=key_id,
            mount_point=self.config.vault_mount
        )
        logger.info(f"Vault key rotated: {key_id}")
        return True


# =============================================================================
# AZURE KEY VAULT PROVIDER
# =============================================================================

class AzureKMS(BaseKMS):
    """
    Azure Key Vault provider.

    Uses Azure Key Vault for key management.
    Requires: azure-keyvault-keys, azure-identity
    """

    def __init__(self, config: KMSConfig):
        self.config = config
        self._client = None
        self._crypto_client = None

    def _get_client(self):
        if self._client is None:
            from azure.identity import DefaultAzureCredential
            from azure.keyvault.keys import KeyClient
            from azure.keyvault.keys.crypto import CryptographyClient, EncryptionAlgorithm

            credential = DefaultAzureCredential()
            self._client = KeyClient(
                vault_url=self.config.azure_vault_url,
                credential=credential
            )
            key = self._client.get_key(self.config.azure_key_name)
            self._crypto_client = CryptographyClient(key, credential=credential)
        return self._client, self._crypto_client

    async def get_data_key(self, key_id: str) -> bytes:
        """Get key from Azure Key Vault"""
        client, _ = self._get_client()
        key = client.get_key(key_id or self.config.azure_key_name)
        # Azure doesn't provide raw key material, use for wrapping only
        return hashlib.sha256(str(key.id).encode()).digest()

    async def encrypt(self, plaintext: str, key_id: str) -> str:
        """Encrypt using Azure Key Vault"""
        from azure.keyvault.keys.crypto import EncryptionAlgorithm
        _, crypto_client = self._get_client()
        result = crypto_client.encrypt(
            EncryptionAlgorithm.rsa_oaep,
            plaintext.encode()
        )
        return base64.b64encode(result.ciphertext).decode()

    async def decrypt(self, ciphertext: str, key_id: str) -> str:
        """Decrypt using Azure Key Vault"""
        from azure.keyvault.keys.crypto import EncryptionAlgorithm
        _, crypto_client = self._get_client()
        result = crypto_client.decrypt(
            EncryptionAlgorithm.rsa_oaep,
            base64.b64decode(ciphertext)
        )
        return result.plaintext.decode()

    async def rotate_key(self, key_id: str) -> bool:
        """Rotate Azure Key Vault key"""
        client, _ = self._get_client()
        client.rotate_key(key_id or self.config.azure_key_name)
        logger.info(f"Azure key rotated: {key_id}")
        return True


# =============================================================================
# LOCAL DEVELOPMENT PROVIDER (NOT FOR PRODUCTION)
# =============================================================================

class LocalKMS(BaseKMS):
    """
    Local KMS for development only.

    WARNING: This provider is NOT secure for production use.
    It stores keys in memory and uses a local master key.
    """

    def __init__(self, config: KMSConfig):
        self.config = config
        self._keys: Dict[str, bytes] = {}

        if os.getenv("ENV", "dev") == "prod":
            raise Exception(
                "LocalKMS cannot be used in production. "
                "Configure AWS_KMS, VAULT, or AZURE_KEY_VAULT."
            )

        logger.warning(
            "⚠️  Using LocalKMS - NOT SECURE FOR PRODUCTION. "
            "Configure a proper KMS provider for production deployments."
        )

    async def get_data_key(self, key_id: str) -> bytes:
        """Generate or retrieve a local data key"""
        if key_id not in self._keys:
            # Derive key from master key + key_id
            master = self.config.local_master_key.encode() or b"dev-master-key-not-secure"
            derived = hashlib.pbkdf2_hmac(
                'sha256',
                master,
                key_id.encode(),
                100000,
                dklen=32
            )
            self._keys[key_id] = derived
        return self._keys[key_id]

    async def encrypt(self, plaintext: str, key_id: str) -> str:
        """Encrypt using local key (AES-256-GCM)"""
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM
        import secrets

        key = await self.get_data_key(key_id)
        nonce = secrets.token_bytes(12)
        aesgcm = AESGCM(key)
        ciphertext = aesgcm.encrypt(nonce, plaintext.encode(), None)
        return base64.b64encode(nonce + ciphertext).decode()

    async def decrypt(self, ciphertext: str, key_id: str) -> str:
        """Decrypt using local key (AES-256-GCM)"""
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM

        key = await self.get_data_key(key_id)
        data = base64.b64decode(ciphertext)
        nonce = data[:12]
        encrypted = data[12:]
        aesgcm = AESGCM(key)
        return aesgcm.decrypt(nonce, encrypted, None).decode()

    async def rotate_key(self, key_id: str) -> bool:
        """'Rotate' local key by removing it"""
        if key_id in self._keys:
            del self._keys[key_id]
        return True


# =============================================================================
# KMS FACTORY
# =============================================================================

class KMSFactory:
    """
    Factory for creating KMS provider instances.

    Usage:
        kms = KMSFactory.create()
        key = await kms.get_data_key("my-key")
    """

    _instance: Optional[BaseKMS] = None

    @classmethod
    def create(cls, config: Optional[KMSConfig] = None) -> BaseKMS:
        """Create or return cached KMS provider"""
        if cls._instance is not None:
            return cls._instance

        config = config or KMSConfig()

        if config.provider == KMSProvider.AWS:
            cls._instance = AWSKMS(config)
        elif config.provider == KMSProvider.VAULT:
            cls._instance = VaultKMS(config)
        elif config.provider == KMSProvider.AZURE:
            cls._instance = AzureKMS(config)
        else:
            cls._instance = LocalKMS(config)

        logger.info(f"KMS provider initialized: {config.provider.value}")
        return cls._instance

    @classmethod
    def reset(cls):
        """Reset the cached instance (for testing)"""
        cls._instance = None


# =============================================================================
# CONVENIENCE FUNCTIONS
# =============================================================================

async def get_kms() -> BaseKMS:
    """Get the KMS provider instance"""
    return KMSFactory.create()


async def encrypt_sensitive_data(data: str, key_id: str = "default") -> str:
    """Encrypt sensitive data using KMS"""
    kms = await get_kms()
    return await kms.encrypt(data, key_id)


async def decrypt_sensitive_data(ciphertext: str, key_id: str = "default") -> str:
    """Decrypt sensitive data using KMS"""
    kms = await get_kms()
    return await kms.decrypt(ciphertext, key_id)
