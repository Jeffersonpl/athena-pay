"""
BR Code (PIX EMV QR Code) Value Object
"""

import crcmod
from typing import Optional
from dataclasses import dataclass

import sys
sys.path.insert(0, '/Users/jeffersonleite/Projetos/Synoryx/athena-visual-patched-tested-v4-merged-PATCHED17 (1) 2/services/shared')

from athena_shared.domain.entities import ValueObject


class BRCode(ValueObject):
    """
    BR Code - PIX QR Code Payload Generator.
    Follows EMV QR Code Specification for PIX.
    """
    payload: str

    @classmethod
    def generate_static(
        cls,
        key_value: str,
        merchant_name: str,
        merchant_city: str = "SAO PAULO",
        amount: float = None,
        description: str = None,
        reference: str = None
    ) -> "BRCode":
        """Generate a static BR Code."""
        payload = cls._build_payload(
            key_value=key_value,
            merchant_name=merchant_name,
            merchant_city=merchant_city,
            amount=amount,
            description=description,
            reference=reference,
            is_dynamic=False
        )
        return cls(payload=payload)

    @classmethod
    def generate_dynamic(
        cls,
        location_url: str,
        merchant_name: str,
        merchant_city: str = "SAO PAULO",
        amount: float = None,
        reference: str = None
    ) -> "BRCode":
        """Generate a dynamic BR Code."""
        payload = cls._build_payload(
            location_url=location_url,
            merchant_name=merchant_name,
            merchant_city=merchant_city,
            amount=amount,
            reference=reference,
            is_dynamic=True
        )
        return cls(payload=payload)

    @classmethod
    def _build_payload(
        cls,
        key_value: str = None,
        location_url: str = None,
        merchant_name: str = "",
        merchant_city: str = "",
        amount: float = None,
        description: str = None,
        reference: str = None,
        is_dynamic: bool = False
    ) -> str:
        """Build the EMV QR Code payload."""
        elements = []

        # Payload Format Indicator (ID 00)
        elements.append(cls._tlv("00", "01"))

        # Point of Initiation Method (ID 01)
        # 11 = Static, 12 = Dynamic
        elements.append(cls._tlv("01", "12" if is_dynamic else "11"))

        # Merchant Account Information - PIX (ID 26)
        mai_content = []
        mai_content.append(cls._tlv("00", "br.gov.bcb.pix"))

        if is_dynamic and location_url:
            mai_content.append(cls._tlv("25", location_url))
        elif key_value:
            mai_content.append(cls._tlv("01", key_value))

        if description:
            mai_content.append(cls._tlv("02", description[:25]))

        elements.append(cls._tlv("26", "".join(mai_content)))

        # Merchant Category Code (ID 52)
        elements.append(cls._tlv("52", "0000"))

        # Transaction Currency (ID 53) - BRL = 986
        elements.append(cls._tlv("53", "986"))

        # Transaction Amount (ID 54)
        if amount is not None and amount > 0:
            elements.append(cls._tlv("54", f"{amount:.2f}"))

        # Country Code (ID 58)
        elements.append(cls._tlv("58", "BR"))

        # Merchant Name (ID 59)
        elements.append(cls._tlv("59", merchant_name[:25].upper()))

        # Merchant City (ID 60)
        elements.append(cls._tlv("60", merchant_city[:15].upper()))

        # Additional Data Field (ID 62)
        if reference:
            adf_content = cls._tlv("05", reference[:25])
            elements.append(cls._tlv("62", adf_content))

        # Build payload without CRC
        payload_without_crc = "".join(elements)

        # Add CRC placeholder
        payload_with_crc_placeholder = payload_without_crc + "6304"

        # Calculate CRC16
        crc = cls._calculate_crc(payload_with_crc_placeholder)

        return payload_without_crc + cls._tlv("63", crc)

    @staticmethod
    def _tlv(tag: str, value: str) -> str:
        """Build TLV (Tag-Length-Value) element."""
        length = f"{len(value):02d}"
        return f"{tag}{length}{value}"

    @staticmethod
    def _calculate_crc(payload: str) -> str:
        """Calculate CRC16-CCITT checksum."""
        crc16 = crcmod.mkCrcFun(0x11021, initCrc=0xFFFF, xorOut=0x0000)
        crc = crc16(payload.encode("utf-8"))
        return f"{crc:04X}"

    @classmethod
    def parse(cls, payload: str) -> dict:
        """Parse a BR Code payload into its components."""
        result = {}
        pos = 0

        while pos < len(payload):
            tag = payload[pos:pos + 2]
            length = int(payload[pos + 2:pos + 4])
            value = payload[pos + 4:pos + 4 + length]

            if tag == "26":  # Merchant Account Info
                result["merchant_account"] = cls._parse_merchant_account(value)
            elif tag == "62":  # Additional Data
                result["additional_data"] = cls._parse_additional_data(value)
            else:
                result[tag] = value

            pos += 4 + length

        return result

    @classmethod
    def _parse_merchant_account(cls, value: str) -> dict:
        """Parse merchant account information."""
        result = {}
        pos = 0

        while pos < len(value):
            tag = value[pos:pos + 2]
            length = int(value[pos + 2:pos + 4])
            tag_value = value[pos + 4:pos + 4 + length]

            if tag == "00":
                result["gui"] = tag_value
            elif tag == "01":
                result["key"] = tag_value
            elif tag == "02":
                result["description"] = tag_value
            elif tag == "25":
                result["url"] = tag_value

            pos += 4 + length

        return result

    @classmethod
    def _parse_additional_data(cls, value: str) -> dict:
        """Parse additional data field."""
        result = {}
        pos = 0

        while pos < len(value):
            tag = value[pos:pos + 2]
            length = int(value[pos + 2:pos + 4])
            tag_value = value[pos + 4:pos + 4 + length]

            if tag == "05":
                result["reference"] = tag_value

            pos += 4 + length

        return result

    def __str__(self) -> str:
        return self.payload
