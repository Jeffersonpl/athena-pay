"""
End-to-End ID Value Object
"""

import random
import string
from datetime import datetime
from dataclasses import dataclass

import sys
sys.path.insert(0, '/Users/jeffersonleite/Projetos/Synoryx/athena-visual-patched-tested-v4-merged-PATCHED17 (1) 2/services/shared')

from athena_shared.domain.entities import ValueObject


class EndToEndId(ValueObject):
    """
    PIX End-to-End ID (E2E ID).
    Format: E{ISPB}{YYYYMMDDHHMMSS}{SEQUENCIAL}
    Total: 32 characters
    """
    value: str

    @classmethod
    def generate(cls, ispb: str = "12345678") -> "EndToEndId":
        """
        Generate a new E2E ID.

        Args:
            ispb: ISPB code of the institution (8 digits)

        Returns:
            New EndToEndId instance
        """
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        # Random sequence to ensure uniqueness
        sequence = "".join(random.choices(string.digits, k=10))

        e2e_id = f"E{ispb[:8]}{timestamp}{sequence}"

        return cls(value=e2e_id[:32])

    @classmethod
    def from_string(cls, value: str) -> "EndToEndId":
        """Create from existing string."""
        if not cls.validate(value):
            raise ValueError(f"Invalid E2E ID format: {value}")
        return cls(value=value)

    @staticmethod
    def validate(value: str) -> bool:
        """Validate E2E ID format."""
        if not value or len(value) != 32:
            return False
        if not value.startswith("E"):
            return False
        return True

    @property
    def ispb(self) -> str:
        """Extract ISPB from E2E ID."""
        return self.value[1:9]

    @property
    def timestamp(self) -> str:
        """Extract timestamp from E2E ID."""
        return self.value[9:23]

    @property
    def sequence(self) -> str:
        """Extract sequence from E2E ID."""
        return self.value[23:32]

    def __str__(self) -> str:
        return self.value
