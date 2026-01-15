"""
Athena Shared Cryptography Utilities
Encryption, hashing, and tokenization for sensitive data

SEC-007: Fixed dynamic salt per record instead of hardcoded salt.
SEC-005: Integration with KMS for master key management.
"""
import os
import hashlib
import hmac
import base64
import secrets
from typing import Optional, Tuple
from datetime import datetime

# Environment-based encryption key (should come from KMS in production)
ENCRYPTION_KEY = os.getenv("ATHENA_ENCRYPTION_KEY", "dev-key-change-in-production-32b")


def generate_token(prefix: str = "tok") -> str:
    """
    Generates a secure random token
    Format: prefix_<random_hex>
    """
    random_part = secrets.token_hex(16)
    return f"{prefix}_{random_part}"


def generate_uuid() -> str:
    """Generates a UUID v4"""
    import uuid
    return str(uuid.uuid4())


def generate_e2e_id(ispb: str = "00000000") -> str:
    """
    Generates End-to-End ID for PIX transactions
    Format: E{ISPB}{YYYYMMDDHHMMSS}{SEQ}
    """
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    seq = secrets.token_hex(8).upper()
    return f"E{ispb}{timestamp}{seq}"[:32]


def generate_txid() -> str:
    """
    Generates transaction ID for PIX QR codes
    26-35 alphanumeric characters
    """
    return secrets.token_hex(13)[:26]


def hash_sha256(data: str) -> str:
    """Returns SHA-256 hash of string"""
    return hashlib.sha256(data.encode()).hexdigest()


def hash_sha512(data: str) -> str:
    """Returns SHA-512 hash of string"""
    return hashlib.sha512(data.encode()).hexdigest()


def hmac_sha256(key: str, message: str) -> str:
    """Returns HMAC-SHA256 signature"""
    return hmac.new(
        key.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()


def verify_hmac_sha256(key: str, message: str, signature: str) -> bool:
    """Verifies HMAC-SHA256 signature"""
    expected = hmac_sha256(key, message)
    return hmac.compare_digest(expected, signature)


def _generate_salt() -> bytes:
    """
    SEC-007: Generate unique salt per encryption operation.
    16 bytes = 128 bits of randomness.
    """
    return secrets.token_bytes(16)


def _derive_key(salt: bytes, master_key: Optional[str] = None) -> bytes:
    """
    Derive encryption key using PBKDF2.

    Args:
        salt: Unique salt for this derivation
        master_key: Optional master key (defaults to env var)

    Returns:
        32-byte derived key suitable for AES-256
    """
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

    key_material = (master_key or ENCRYPTION_KEY).encode()

    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return kdf.derive(key_material)


def encrypt_pii(plaintext: str, master_key: Optional[str] = None) -> str:
    """
    Encrypts PII data using AES-256-GCM with unique salt per record.

    SEC-007: Each encryption uses a unique random salt, stored with the ciphertext.

    Format: v2:<salt_b64>:<nonce_b64>:<ciphertext_b64>

    Args:
        plaintext: Data to encrypt
        master_key: Optional master key (uses env var if not provided)

    Returns:
        Encrypted string with embedded salt
    """
    try:
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM

        # Generate unique salt for this record
        salt = _generate_salt()
        key = _derive_key(salt, master_key)

        # Generate unique nonce for AES-GCM
        nonce = secrets.token_bytes(12)

        # Encrypt using AES-256-GCM
        aesgcm = AESGCM(key)
        ciphertext = aesgcm.encrypt(nonce, plaintext.encode('utf-8'), None)

        # Pack: version:salt:nonce:ciphertext (all base64)
        result = "v2:{}:{}:{}".format(
            base64.b64encode(salt).decode('ascii'),
            base64.b64encode(nonce).decode('ascii'),
            base64.b64encode(ciphertext).decode('ascii')
        )
        return result

    except ImportError:
        # Fallback: base64 encoding (NOT SECURE - only for dev)
        import logging
        logging.warning("cryptography package not installed - using insecure fallback")
        return f"DEV_ENC:{base64.b64encode(plaintext.encode()).decode()}"


def decrypt_pii(ciphertext: str, master_key: Optional[str] = None) -> str:
    """
    Decrypts PII data encrypted with encrypt_pii.

    Supports both v1 (legacy fixed salt) and v2 (dynamic salt) formats.

    Args:
        ciphertext: Encrypted string from encrypt_pii
        master_key: Optional master key (uses env var if not provided)

    Returns:
        Decrypted plaintext
    """
    try:
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM
        from cryptography.fernet import Fernet
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

        # Handle v2 format (dynamic salt)
        if ciphertext.startswith("v2:"):
            parts = ciphertext.split(":")
            if len(parts) != 4:
                raise ValueError("Invalid v2 ciphertext format")

            salt = base64.b64decode(parts[1])
            nonce = base64.b64decode(parts[2])
            encrypted = base64.b64decode(parts[3])

            key = _derive_key(salt, master_key)
            aesgcm = AESGCM(key)
            return aesgcm.decrypt(nonce, encrypted, None).decode('utf-8')

        # Handle v1 format (legacy fixed salt) - for backwards compatibility
        if ciphertext.startswith("v1:") or not ciphertext.startswith(("v2:", "DEV_ENC:")):
            # Legacy format using Fernet with fixed salt
            legacy_salt = b'athena_salt_v1'
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=legacy_salt,
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive((master_key or ENCRYPTION_KEY).encode()))
            f = Fernet(key)

            # Remove v1: prefix if present
            data = ciphertext[3:] if ciphertext.startswith("v1:") else ciphertext
            encrypted = base64.urlsafe_b64decode(data.encode())
            return f.decrypt(encrypted).decode()

        # Handle dev fallback format
        if ciphertext.startswith("DEV_ENC:"):
            return base64.b64decode(ciphertext[8:]).decode()

        raise ValueError(f"Unknown ciphertext format")

    except ImportError:
        # Fallback: base64 decoding
        if ciphertext.startswith("DEV_ENC:"):
            return base64.b64decode(ciphertext[8:]).decode()
        return ciphertext


def reencrypt_v1_to_v2(v1_ciphertext: str, master_key: Optional[str] = None) -> str:
    """
    Migrates v1 (fixed salt) encrypted data to v2 (dynamic salt).

    Use this for batch migration of existing encrypted data.

    Args:
        v1_ciphertext: Ciphertext in v1 format
        master_key: Optional master key

    Returns:
        Ciphertext in v2 format with unique salt
    """
    plaintext = decrypt_pii(v1_ciphertext, master_key)
    return encrypt_pii(plaintext, master_key)


def tokenize_card_pan(pan: str) -> str:
    """
    Tokenizes card PAN (Primary Account Number)
    In production, this should use a PCI-compliant tokenization service
    """
    # Never store the actual PAN
    last_four = pan[-4:] if len(pan) >= 4 else "0000"
    token = generate_token("card")
    return f"{token}_{last_four}"


def hash_password(password: str) -> str:
    """
    Hashes password using bcrypt
    Returns the hash string
    """
    try:
        import bcrypt
        salt = bcrypt.gensalt(rounds=12)
        return bcrypt.hashpw(password.encode(), salt).decode()
    except ImportError:
        # Fallback: SHA-256 with unique salt
        salt = secrets.token_hex(16)
        hashed = hash_sha256(f"{salt}:{password}")
        return f"sha256:{salt}:{hashed}"


def verify_password(password: str, hashed: str) -> bool:
    """Verifies password against hash"""
    try:
        import bcrypt
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except ImportError:
        if hashed.startswith("sha256:"):
            parts = hashed.split(":")
            if len(parts) == 3:
                salt = parts[1]
                stored_hash = parts[2]
                return hash_sha256(f"{salt}:{password}") == stored_hash
        return False


def generate_otp(length: int = 6) -> str:
    """Generates a numeric OTP"""
    return ''.join(secrets.choice('0123456789') for _ in range(length))


def generate_api_key() -> str:
    """Generates a secure API key"""
    return f"ak_{secrets.token_urlsafe(32)}"


def generate_session_id() -> str:
    """Generates a secure session ID"""
    return f"sess_{secrets.token_urlsafe(24)}"


def constant_time_compare(a: str, b: str) -> bool:
    """Compares two strings in constant time (timing-safe)"""
    return hmac.compare_digest(a, b)


def mask_cpf(cpf: str) -> str:
    """Mask CPF for display: 123.456.789-00 -> 123.***.***-00"""
    cpf_clean = cpf.replace(".", "").replace("-", "")
    if len(cpf_clean) == 11:
        return f"{cpf_clean[:3]}.***.***-{cpf_clean[-2:]}"
    return "***.***.***-**"


def mask_email(email: str) -> str:
    """Mask email for display: john@example.com -> j***@example.com"""
    if "@" in email:
        local, domain = email.split("@", 1)
        if len(local) > 2:
            masked = f"{local[0]}{'*' * (len(local)-2)}{local[-1]}"
        else:
            masked = f"{local[0]}***"
        return f"{masked}@{domain}"
    return "****@****.***"


def mask_phone(phone: str) -> str:
    """Mask phone for display: +5511999998888 -> +55 (11) *****-8888"""
    digits = ''.join(filter(str.isdigit, phone))
    if len(digits) >= 10:
        return f"+55 ({digits[2:4]}) *****-{digits[-4:]}"
    return "(***) *****-****"


def mask_card_number(card: str) -> str:
    """Mask card number: 4111111111111111 -> **** **** **** 1111"""
    digits = ''.join(filter(str.isdigit, card))
    if len(digits) >= 4:
        return f"**** **** **** {digits[-4:]}"
    return "**** **** **** ****"
