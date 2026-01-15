"""
Encryption Service - AES-256-GCM encryption for PII data.
"""

import os
import base64
import hashlib
import secrets
from typing import Optional, Tuple
from dataclasses import dataclass, field

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend


@dataclass
class EncryptionConfig:
    """Encryption configuration."""
    # Master key (should be from HSM/KMS in production)
    master_key: str = field(default_factory=lambda: os.getenv("ENCRYPTION_MASTER_KEY", ""))

    # Key derivation
    kdf_iterations: int = 100000
    salt_length: int = 16

    # Encryption settings
    key_length: int = 32  # 256 bits
    nonce_length: int = 12  # 96 bits for GCM

    # Field-level encryption keys (derived from master)
    pii_key_id: str = "pii_v1"
    card_key_id: str = "card_v1"
    document_key_id: str = "doc_v1"


class EncryptionService:
    """
    Enterprise encryption service with:
    - AES-256-GCM authenticated encryption
    - Key derivation with PBKDF2
    - Field-level encryption
    - Secure hashing for lookups
    """

    def __init__(self, config: Optional[EncryptionConfig] = None):
        self.config = config or EncryptionConfig()
        self._derived_keys = {}

        if not self.config.master_key:
            raise ValueError("ENCRYPTION_MASTER_KEY environment variable must be set")

    def _derive_key(self, key_id: str, salt: bytes = None) -> Tuple[bytes, bytes]:
        """
        Derive an encryption key using PBKDF2.

        Args:
            key_id: Identifier for the key purpose
            salt: Optional salt (generated if not provided)

        Returns:
            Tuple of (derived_key, salt)
        """
        if salt is None:
            salt = secrets.token_bytes(self.config.salt_length)

        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=self.config.key_length,
            salt=salt,
            iterations=self.config.kdf_iterations,
            backend=default_backend()
        )

        key_material = f"{self.config.master_key}:{key_id}".encode()
        derived_key = kdf.derive(key_material)

        return derived_key, salt

    def encrypt(self, plaintext: str, key_id: str = "default") -> str:
        """
        Encrypt plaintext using AES-256-GCM.

        Args:
            plaintext: Data to encrypt
            key_id: Key identifier for derivation

        Returns:
            Base64-encoded ciphertext with format: version:salt:nonce:ciphertext:tag
        """
        if not plaintext:
            return ""

        # Derive key
        salt = secrets.token_bytes(self.config.salt_length)
        key, _ = self._derive_key(key_id, salt)

        # Generate nonce
        nonce = secrets.token_bytes(self.config.nonce_length)

        # Encrypt
        aesgcm = AESGCM(key)
        ciphertext = aesgcm.encrypt(nonce, plaintext.encode(), None)

        # Encode result
        result = base64.b64encode(
            b"v1:" + salt + b":" + nonce + b":" + ciphertext
        ).decode()

        return result

    def decrypt(self, ciphertext: str, key_id: str = "default") -> str:
        """
        Decrypt ciphertext using AES-256-GCM.

        Args:
            ciphertext: Base64-encoded encrypted data
            key_id: Key identifier for derivation

        Returns:
            Decrypted plaintext
        """
        if not ciphertext:
            return ""

        try:
            # Decode
            raw = base64.b64decode(ciphertext)
            parts = raw.split(b":", 3)

            if len(parts) != 4:
                raise ValueError("Invalid ciphertext format")

            version, salt, nonce, encrypted = parts

            if version != b"v1":
                raise ValueError(f"Unsupported encryption version: {version}")

            # Derive key
            key, _ = self._derive_key(key_id, salt)

            # Decrypt
            aesgcm = AESGCM(key)
            plaintext = aesgcm.decrypt(nonce, encrypted, None)

            return plaintext.decode()

        except Exception as e:
            raise ValueError(f"Decryption failed: {e}")

    def encrypt_pii(self, data: str) -> str:
        """Encrypt PII data (names, addresses, etc.)."""
        return self.encrypt(data, self.config.pii_key_id)

    def decrypt_pii(self, data: str) -> str:
        """Decrypt PII data."""
        return self.decrypt(data, self.config.pii_key_id)

    def encrypt_card(self, card_number: str) -> str:
        """Encrypt card number."""
        return self.encrypt(card_number, self.config.card_key_id)

    def decrypt_card(self, data: str) -> str:
        """Decrypt card number."""
        return self.decrypt(data, self.config.card_key_id)

    def encrypt_document(self, document: str) -> str:
        """Encrypt document number (CPF/CNPJ)."""
        return self.encrypt(document, self.config.document_key_id)

    def decrypt_document(self, data: str) -> str:
        """Decrypt document number."""
        return self.decrypt(data, self.config.document_key_id)

    def hash_for_lookup(self, data: str, purpose: str = "lookup") -> str:
        """
        Create a secure hash for database lookups.
        Uses HMAC-SHA256 with the master key.

        Args:
            data: Data to hash
            purpose: Purpose identifier for domain separation

        Returns:
            Hex-encoded hash
        """
        if not data:
            return ""

        key = f"{self.config.master_key}:{purpose}".encode()
        h = hashlib.blake2b(data.encode(), key=key, digest_size=32)
        return h.hexdigest()

    @staticmethod
    def mask_card_number(card_number: str) -> str:
        """
        Mask card number showing only last 4 digits.

        Args:
            card_number: Full card number

        Returns:
            Masked card number (e.g., ****1234)
        """
        if not card_number or len(card_number) < 4:
            return "****"

        clean = card_number.replace(" ", "").replace("-", "")
        return f"****{clean[-4:]}"

    @staticmethod
    def mask_document(document: str) -> str:
        """
        Mask CPF/CNPJ showing only first and last digits.

        Args:
            document: Document number

        Returns:
            Masked document (e.g., 123.***.789-01)
        """
        if not document:
            return "***"

        clean = document.replace(".", "").replace("-", "").replace("/", "")

        if len(clean) == 11:  # CPF
            return f"{clean[:3]}.***.***-{clean[-2:]}"
        elif len(clean) == 14:  # CNPJ
            return f"{clean[:2]}.***.***/****-{clean[-2:]}"
        else:
            return f"{clean[:3]}***{clean[-3:]}" if len(clean) > 6 else "***"

    @staticmethod
    def mask_email(email: str) -> str:
        """
        Mask email address.

        Args:
            email: Email address

        Returns:
            Masked email (e.g., j***@example.com)
        """
        if not email or "@" not in email:
            return "***@***"

        local, domain = email.split("@", 1)
        if len(local) > 2:
            masked_local = f"{local[0]}***{local[-1]}"
        else:
            masked_local = f"{local[0]}***"

        return f"{masked_local}@{domain}"

    @staticmethod
    def mask_phone(phone: str) -> str:
        """
        Mask phone number.

        Args:
            phone: Phone number

        Returns:
            Masked phone (e.g., (**) *****-1234)
        """
        if not phone:
            return "(***) *****-****"

        clean = "".join(c for c in phone if c.isdigit())

        if len(clean) >= 4:
            return f"(***) *****-{clean[-4:]}"
        return "(***) *****-****"


# Convenience functions
_encryption_service: Optional[EncryptionService] = None


def get_encryption_service() -> EncryptionService:
    """Get or create the global encryption service instance."""
    global _encryption_service
    if _encryption_service is None:
        _encryption_service = EncryptionService()
    return _encryption_service


def encrypt_pii(data: str) -> str:
    """Encrypt PII data."""
    return get_encryption_service().encrypt_pii(data)


def decrypt_pii(data: str) -> str:
    """Decrypt PII data."""
    return get_encryption_service().decrypt_pii(data)


def hash_sensitive_data(data: str, purpose: str = "lookup") -> str:
    """Create secure hash for lookups."""
    return get_encryption_service().hash_for_lookup(data, purpose)


def mask_card_number(card_number: str) -> str:
    """Mask card number."""
    return EncryptionService.mask_card_number(card_number)


def mask_document(document: str) -> str:
    """Mask document number."""
    return EncryptionService.mask_document(document)
