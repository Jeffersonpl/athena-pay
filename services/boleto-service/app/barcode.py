"""
Boleto Barcode Generator
Brazilian bank slip barcode and digitable line generation
"""
from datetime import datetime, date
from typing import Optional
from dataclasses import dataclass


@dataclass
class BoletoParams:
    """Parameters for boleto generation"""
    bank_code: str
    currency_code: str  # Usually "9" for BRL
    amount: float
    due_date: date
    beneficiary_branch: str
    beneficiary_account: str
    our_number: str
    wallet: str = "109"


def calculate_modulo11(number: str, weights: list = None) -> int:
    """
    Calculate Modulo 11 check digit
    Used in Brazilian banking system
    """
    if weights is None:
        weights = [2, 3, 4, 5, 6, 7, 8, 9]

    total = 0
    weight_index = 0

    for digit in reversed(number):
        total += int(digit) * weights[weight_index % len(weights)]
        weight_index += 1

    remainder = total % 11
    digit = 11 - remainder

    if digit in [0, 10, 11]:
        return 1

    return digit


def calculate_modulo10(number: str) -> int:
    """
    Calculate Modulo 10 check digit
    Used for boleto fields
    """
    weights = [2, 1]
    total = 0

    for i, digit in enumerate(reversed(number)):
        product = int(digit) * weights[i % 2]
        if product > 9:
            product = product // 10 + product % 10
        total += product

    remainder = total % 10
    if remainder == 0:
        return 0
    return 10 - remainder


def format_due_date_factor(due_date: date) -> str:
    """
    Calculate due date factor for boleto
    Base date: 1997-10-07
    """
    base_date = date(1997, 10, 7)
    delta = (due_date - base_date).days

    # Handle dates after 2025-02-21 (factor 9999)
    if delta > 9999:
        delta = delta % 9000 + 1000

    return str(delta).zfill(4)


def format_amount(amount: float) -> str:
    """Format amount for boleto (10 digits, no decimal point)"""
    return str(int(amount * 100)).zfill(10)


def generate_barcode(params: BoletoParams) -> str:
    """
    Generate 44-digit barcode for boleto

    Structure:
    - Positions 1-3: Bank code
    - Position 4: Currency code (9 = BRL)
    - Position 5: Check digit (mod 11)
    - Positions 6-9: Due date factor
    - Positions 10-19: Amount
    - Positions 20-44: Free field (bank specific)

    For standard wallets:
    - Positions 20-24: Branch (agency)
    - Positions 25-34: Our number
    - Positions 35-43: Account
    - Position 44: Wallet
    """
    # Free field (banco específico - exemplo genérico)
    free_field = (
        params.beneficiary_branch.zfill(5) +
        params.our_number.zfill(10) +
        params.beneficiary_account.zfill(9) +
        params.wallet[-1]
    )

    # Build barcode without check digit
    due_factor = format_due_date_factor(params.due_date)
    amount_str = format_amount(params.amount)

    barcode_no_dv = (
        params.bank_code +
        params.currency_code +
        due_factor +
        amount_str +
        free_field
    )

    # Calculate check digit (position 5)
    check_digit = calculate_modulo11(
        barcode_no_dv[:4] + barcode_no_dv[5:]
    )

    # Insert check digit
    barcode = barcode_no_dv[:4] + str(check_digit) + barcode_no_dv[4:]

    return barcode


def generate_digitable_line(barcode: str) -> str:
    """
    Generate digitable line from barcode

    Structure (47 digits with spaces, 54 chars total):
    - Field 1 (10 digits): Bank + Currency + 5 first of free field + DV1
    - Field 2 (11 digits): 6-15 of free field + DV2
    - Field 3 (11 digits): 16-25 of free field + DV3
    - Field 4 (1 digit): General check digit
    - Field 5 (14 digits): Due date factor + Amount

    Display format: AAABC.CCCCX DDDDD.DDDDDY EEEEE.EEEEEZ K UUUUVVVVVVVVVV
    """
    # Extract components
    bank_code = barcode[0:3]
    currency = barcode[3:4]
    general_dv = barcode[4:5]
    due_factor = barcode[5:9]
    amount = barcode[9:19]
    free_field = barcode[19:44]

    # Field 1: Bank + Currency + 5 first of free field
    field1 = bank_code + currency + free_field[0:5]
    dv1 = calculate_modulo10(field1)
    field1_formatted = f"{field1[:5]}.{field1[5:]}{dv1}"

    # Field 2: positions 6-15 of free field
    field2 = free_field[5:15]
    dv2 = calculate_modulo10(field2)
    field2_formatted = f"{field2[:5]}.{field2[5:]}{dv2}"

    # Field 3: positions 16-25 of free field
    field3 = free_field[15:25]
    dv3 = calculate_modulo10(field3)
    field3_formatted = f"{field3[:5]}.{field3[5:]}{dv3}"

    # Field 4: General check digit
    field4 = general_dv

    # Field 5: Due date factor + Amount
    field5 = due_factor + amount

    return f"{field1_formatted} {field2_formatted} {field3_formatted} {field4} {field5}"


def parse_digitable_line(digitable_line: str) -> dict:
    """
    Parse a digitable line and extract components
    """
    # Remove spaces and dots
    clean = digitable_line.replace(" ", "").replace(".", "")

    if len(clean) not in [47, 48]:
        raise ValueError(f"Invalid digitable line length: {len(clean)}")

    # Extract fields
    field1 = clean[0:10]
    field2 = clean[10:21]
    field3 = clean[21:32]
    field4 = clean[32:33]
    field5 = clean[33:47]

    bank_code = field1[0:3]
    currency = field1[3:4]

    due_factor = int(field5[0:4])
    amount = int(field5[4:14]) / 100

    # Calculate due date from factor
    base_date = date(1997, 10, 7)
    from datetime import timedelta
    due_date = base_date + timedelta(days=due_factor)

    return {
        "bank_code": bank_code,
        "currency": currency,
        "due_date": due_date.isoformat(),
        "amount": amount,
        "general_dv": field4
    }


def validate_barcode(barcode: str) -> bool:
    """
    Validate barcode check digit
    """
    if len(barcode) != 44:
        return False

    expected_dv = int(barcode[4])
    barcode_no_dv = barcode[:4] + barcode[5:]
    calculated_dv = calculate_modulo11(barcode_no_dv)

    return expected_dv == calculated_dv


def validate_digitable_line(digitable_line: str) -> dict:
    """
    Validate all check digits in digitable line
    """
    clean = digitable_line.replace(" ", "").replace(".", "")

    results = {
        "valid": True,
        "field1_valid": False,
        "field2_valid": False,
        "field3_valid": False,
        "errors": []
    }

    # Validate field 1
    field1 = clean[0:9]
    dv1 = int(clean[9])
    if calculate_modulo10(field1) == dv1:
        results["field1_valid"] = True
    else:
        results["valid"] = False
        results["errors"].append("Field 1 check digit invalid")

    # Validate field 2
    field2 = clean[10:20]
    dv2 = int(clean[20])
    if calculate_modulo10(field2) == dv2:
        results["field2_valid"] = True
    else:
        results["valid"] = False
        results["errors"].append("Field 2 check digit invalid")

    # Validate field 3
    field3 = clean[21:31]
    dv3 = int(clean[31])
    if calculate_modulo10(field3) == dv3:
        results["field3_valid"] = True
    else:
        results["valid"] = False
        results["errors"].append("Field 3 check digit invalid")

    return results


def generate_our_number(sequence: int, wallet: str, bank_code: str) -> str:
    """
    Generate 'nosso numero' based on bank specifics
    """
    # Generic implementation - banks have different formats
    return str(sequence).zfill(10)


# Bank-specific implementations can be added here
class BancoDoBrasilBarcode:
    """Banco do Brasil specific barcode generation"""
    BANK_CODE = "001"

    @staticmethod
    def generate(params: BoletoParams) -> str:
        # BB uses a different free field format
        free_field = (
            "000000" +  # Zeros
            params.our_number.zfill(17) +
            params.wallet.zfill(2)
        )

        due_factor = format_due_date_factor(params.due_date)
        amount_str = format_amount(params.amount)

        barcode_no_dv = (
            BancoDoBrasilBarcode.BANK_CODE +
            params.currency_code +
            due_factor +
            amount_str +
            free_field
        )

        check_digit = calculate_modulo11(
            barcode_no_dv[:4] + barcode_no_dv[5:]
        )

        return barcode_no_dv[:4] + str(check_digit) + barcode_no_dv[4:]


class ItauBarcode:
    """Itau specific barcode generation"""
    BANK_CODE = "341"

    @staticmethod
    def generate(params: BoletoParams) -> str:
        # Itau uses carteira/nosso_numero/DAC/agencia/conta/DAC/zeros
        our_number = params.our_number.zfill(8)

        free_field = (
            params.wallet.zfill(3) +
            our_number +
            "0" +  # DAC placeholder
            params.beneficiary_branch.zfill(4) +
            params.beneficiary_account.zfill(5) +
            "0" +  # DAC placeholder
            "000"
        )

        due_factor = format_due_date_factor(params.due_date)
        amount_str = format_amount(params.amount)

        barcode_no_dv = (
            ItauBarcode.BANK_CODE +
            params.currency_code +
            due_factor +
            amount_str +
            free_field
        )

        check_digit = calculate_modulo11(
            barcode_no_dv[:4] + barcode_no_dv[5:]
        )

        return barcode_no_dv[:4] + str(check_digit) + barcode_no_dv[4:]
