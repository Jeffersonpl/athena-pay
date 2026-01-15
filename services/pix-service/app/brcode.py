"""
BR Code EMV Generator for PIX
Implements BACEN specification for QR Code format
"""
import re
import crcmod
from typing import Optional, Dict, Any
from dataclasses import dataclass
from enum import Enum


class PixKeyType(Enum):
    CPF = "CPF"
    CNPJ = "CNPJ"
    EMAIL = "EMAIL"
    PHONE = "PHONE"
    EVP = "EVP"  # Random key


# EMV Tag IDs
class EMVTag:
    PAYLOAD_FORMAT = "00"
    MERCHANT_ACCOUNT = "26"
    MERCHANT_CATEGORY = "52"
    CURRENCY = "53"
    AMOUNT = "54"
    COUNTRY = "58"
    MERCHANT_NAME = "59"
    MERCHANT_CITY = "60"
    POSTAL_CODE = "61"
    ADDITIONAL_DATA = "62"
    CRC = "63"

    # Merchant Account subtags (26)
    GUI = "00"  # Globally Unique Identifier
    KEY = "01"  # PIX key
    DESCRIPTION = "02"
    URL = "25"  # For dynamic QR

    # Additional Data subtags (62)
    TXID = "05"


def crc16_ccitt(data: str) -> str:
    """
    Calculate CRC16-CCITT checksum for BR Code
    Polynomial: 0x1021
    """
    crc_func = crcmod.mkCrcFun(0x11021, initCrc=0xFFFF, xorOut=0x0000)
    crc_value = crc_func(data.encode('utf-8'))
    return format(crc_value, '04X')


def build_tlv(tag: str, value: str) -> str:
    """Build TLV (Tag-Length-Value) string"""
    length = str(len(value)).zfill(2)
    return f"{tag}{length}{value}"


def build_merchant_account(
    key: str,
    description: Optional[str] = None,
    url: Optional[str] = None
) -> str:
    """
    Build Merchant Account Information (Tag 26)
    """
    parts = []

    # GUI (Globally Unique Identifier) - Fixed for PIX
    parts.append(build_tlv(EMVTag.GUI, "BR.GOV.BCB.PIX"))

    # PIX Key or URL
    if url:
        parts.append(build_tlv(EMVTag.URL, url))
    elif key:
        parts.append(build_tlv(EMVTag.KEY, key))

    # Description (optional)
    if description:
        # Truncate to 72 chars max
        desc = description[:72]
        parts.append(build_tlv(EMVTag.DESCRIPTION, desc))

    return "".join(parts)


def build_additional_data(tx_id: Optional[str] = None) -> str:
    """
    Build Additional Data Field (Tag 62)
    """
    if not tx_id:
        return ""

    # TX ID max 25 chars
    tx_id = tx_id[:25]
    return build_tlv(EMVTag.TXID, tx_id)


@dataclass
class BRCodeParams:
    """Parameters for BR Code generation"""
    key: str
    key_type: PixKeyType
    merchant_name: str
    merchant_city: str
    amount: Optional[float] = None
    tx_id: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None  # For dynamic QR
    postal_code: Optional[str] = None
    category_code: str = "0000"  # MCC


def generate_brcode(params: BRCodeParams) -> str:
    """
    Generate BR Code (PIX QR Code) in EMV format

    Args:
        params: BRCodeParams with all necessary information

    Returns:
        Complete BR Code string including CRC
    """
    parts = []

    # 00 - Payload Format Indicator (fixed "01")
    parts.append(build_tlv(EMVTag.PAYLOAD_FORMAT, "01"))

    # 26 - Merchant Account Information
    merchant_account = build_merchant_account(
        key=params.key if not params.url else "",
        description=params.description,
        url=params.url
    )
    parts.append(build_tlv(EMVTag.MERCHANT_ACCOUNT, merchant_account))

    # 52 - Merchant Category Code
    parts.append(build_tlv(EMVTag.MERCHANT_CATEGORY, params.category_code))

    # 53 - Transaction Currency (986 = BRL)
    parts.append(build_tlv(EMVTag.CURRENCY, "986"))

    # 54 - Transaction Amount (optional)
    if params.amount and params.amount > 0:
        amount_str = f"{params.amount:.2f}"
        parts.append(build_tlv(EMVTag.AMOUNT, amount_str))

    # 58 - Country Code
    parts.append(build_tlv(EMVTag.COUNTRY, "BR"))

    # 59 - Merchant Name
    name = params.merchant_name.upper()[:25]
    # Remove special characters
    name = re.sub(r'[^A-Za-z0-9 ]', '', name)
    parts.append(build_tlv(EMVTag.MERCHANT_NAME, name))

    # 60 - Merchant City
    city = params.merchant_city.upper()[:15]
    city = re.sub(r'[^A-Za-z0-9 ]', '', city)
    parts.append(build_tlv(EMVTag.MERCHANT_CITY, city))

    # 61 - Postal Code (optional)
    if params.postal_code:
        postal = params.postal_code.replace("-", "")[:8]
        parts.append(build_tlv(EMVTag.POSTAL_CODE, postal))

    # 62 - Additional Data Field (TX ID)
    if params.tx_id:
        additional = build_additional_data(params.tx_id)
        if additional:
            parts.append(build_tlv(EMVTag.ADDITIONAL_DATA, additional))

    # Build payload without CRC
    payload = "".join(parts)

    # 63 - CRC (calculated over entire payload including "6304")
    payload_for_crc = payload + "6304"
    crc = crc16_ccitt(payload_for_crc)

    return payload_for_crc + crc


def parse_brcode(brcode: str) -> Dict[str, Any]:
    """
    Parse BR Code string into components

    Args:
        brcode: Complete BR Code string

    Returns:
        Dictionary with parsed fields
    """
    result = {
        "raw": brcode,
        "valid": False,
        "key": None,
        "merchant_name": None,
        "merchant_city": None,
        "amount": None,
        "tx_id": None,
        "description": None,
        "url": None,
    }

    try:
        # Verify CRC
        payload = brcode[:-4]
        expected_crc = brcode[-4:]
        calculated_crc = crc16_ccitt(payload)

        if expected_crc.upper() != calculated_crc:
            result["error"] = "Invalid CRC"
            return result

        # Parse TLV structure
        pos = 0
        while pos < len(brcode) - 4:  # Exclude CRC
            tag = brcode[pos:pos + 2]
            length = int(brcode[pos + 2:pos + 4])
            value = brcode[pos + 4:pos + 4 + length]
            pos += 4 + length

            if tag == EMVTag.MERCHANT_ACCOUNT:
                # Parse nested merchant account
                ma_pos = 0
                while ma_pos < len(value):
                    ma_tag = value[ma_pos:ma_pos + 2]
                    ma_length = int(value[ma_pos + 2:ma_pos + 4])
                    ma_value = value[ma_pos + 4:ma_pos + 4 + ma_length]
                    ma_pos += 4 + ma_length

                    if ma_tag == EMVTag.KEY:
                        result["key"] = ma_value
                    elif ma_tag == EMVTag.DESCRIPTION:
                        result["description"] = ma_value
                    elif ma_tag == EMVTag.URL:
                        result["url"] = ma_value

            elif tag == EMVTag.AMOUNT:
                result["amount"] = float(value)
            elif tag == EMVTag.MERCHANT_NAME:
                result["merchant_name"] = value
            elif tag == EMVTag.MERCHANT_CITY:
                result["merchant_city"] = value
            elif tag == EMVTag.ADDITIONAL_DATA:
                # Parse nested additional data
                ad_pos = 0
                while ad_pos < len(value):
                    ad_tag = value[ad_pos:ad_pos + 2]
                    ad_length = int(value[ad_pos + 2:ad_pos + 4])
                    ad_value = value[ad_pos + 4:ad_pos + 4 + ad_length]
                    ad_pos += 4 + ad_length

                    if ad_tag == EMVTag.TXID:
                        result["tx_id"] = ad_value

        result["valid"] = True

    except Exception as e:
        result["error"] = str(e)

    return result


def generate_static_qr(
    key: str,
    key_type: PixKeyType,
    merchant_name: str,
    merchant_city: str,
    amount: Optional[float] = None,
    description: Optional[str] = None
) -> str:
    """
    Generate a static PIX QR Code

    Static QR codes can be reused multiple times
    Amount is optional (payer can enter)
    """
    params = BRCodeParams(
        key=key,
        key_type=key_type,
        merchant_name=merchant_name,
        merchant_city=merchant_city,
        amount=amount,
        description=description
    )
    return generate_brcode(params)


def generate_dynamic_qr(
    url: str,
    merchant_name: str,
    merchant_city: str,
    tx_id: str,
    amount: float
) -> str:
    """
    Generate a dynamic PIX QR Code

    Dynamic QR codes have a unique URL and TX ID
    Can only be used once
    """
    params = BRCodeParams(
        key="",
        key_type=PixKeyType.EVP,
        merchant_name=merchant_name,
        merchant_city=merchant_city,
        amount=amount,
        tx_id=tx_id,
        url=url
    )
    return generate_brcode(params)


def detect_key_type(key: str) -> PixKeyType:
    """
    Detect PIX key type from value

    Args:
        key: PIX key value

    Returns:
        PixKeyType enum
    """
    # Remove formatting
    clean = key.replace(".", "").replace("-", "").replace("/", "").replace(" ", "")

    # CPF: 11 digits
    if re.match(r'^\d{11}$', clean):
        return PixKeyType.CPF

    # CNPJ: 14 digits
    if re.match(r'^\d{14}$', clean):
        return PixKeyType.CNPJ

    # Phone: +55 followed by DDD and number
    if re.match(r'^\+55\d{10,11}$', key) or re.match(r'^55\d{10,11}$', clean):
        return PixKeyType.PHONE

    # Email: contains @
    if '@' in key and '.' in key:
        return PixKeyType.EMAIL

    # EVP: UUID format (32 hex chars with optional dashes)
    if re.match(r'^[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}$', key.lower()):
        return PixKeyType.EVP

    # Default to EVP if unknown
    return PixKeyType.EVP


def format_key_for_dict(key: str, key_type: PixKeyType) -> str:
    """
    Format PIX key for DICT registration

    Args:
        key: Original key value
        key_type: Type of key

    Returns:
        Formatted key string
    """
    if key_type == PixKeyType.CPF:
        # Remove formatting, keep only digits
        return re.sub(r'\D', '', key)

    elif key_type == PixKeyType.CNPJ:
        return re.sub(r'\D', '', key)

    elif key_type == PixKeyType.PHONE:
        # Format: +55DDDNUMBER
        digits = re.sub(r'\D', '', key)
        if not digits.startswith('55'):
            digits = '55' + digits
        return '+' + digits

    elif key_type == PixKeyType.EMAIL:
        return key.lower().strip()

    elif key_type == PixKeyType.EVP:
        # Remove dashes, lowercase
        return key.replace('-', '').lower()

    return key
