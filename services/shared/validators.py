"""
Athena Shared Validators
CPF, CNPJ, Email, Phone validation utilities
"""
import re
from typing import Tuple

def validate_cpf(cpf: str) -> Tuple[bool, str]:
    """
    Validates Brazilian CPF (Individual Taxpayer Registry)
    Returns (is_valid, error_message)
    """
    cpf = re.sub(r'[^0-9]', '', cpf)

    if len(cpf) != 11:
        return False, "CPF deve ter 11 dígitos"

    # Check for known invalid CPFs (all same digits)
    if cpf == cpf[0] * 11:
        return False, "CPF inválido"

    # Validate first check digit
    sum_val = sum(int(cpf[i]) * (10 - i) for i in range(9))
    digit1 = (sum_val * 10 % 11) % 10
    if int(cpf[9]) != digit1:
        return False, "CPF inválido - dígito verificador 1"

    # Validate second check digit
    sum_val = sum(int(cpf[i]) * (11 - i) for i in range(10))
    digit2 = (sum_val * 10 % 11) % 10
    if int(cpf[10]) != digit2:
        return False, "CPF inválido - dígito verificador 2"

    return True, ""

def validate_cnpj(cnpj: str) -> Tuple[bool, str]:
    """
    Validates Brazilian CNPJ (Company Taxpayer Registry)
    Returns (is_valid, error_message)
    """
    cnpj = re.sub(r'[^0-9]', '', cnpj)

    if len(cnpj) != 14:
        return False, "CNPJ deve ter 14 dígitos"

    # Check for known invalid CNPJs
    if cnpj == cnpj[0] * 14:
        return False, "CNPJ inválido"

    # First check digit
    weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum_val = sum(int(cnpj[i]) * weights1[i] for i in range(12))
    digit1 = 11 - (sum_val % 11)
    digit1 = 0 if digit1 >= 10 else digit1
    if int(cnpj[12]) != digit1:
        return False, "CNPJ inválido - dígito verificador 1"

    # Second check digit
    weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum_val = sum(int(cnpj[i]) * weights2[i] for i in range(13))
    digit2 = 11 - (sum_val % 11)
    digit2 = 0 if digit2 >= 10 else digit2
    if int(cnpj[13]) != digit2:
        return False, "CNPJ inválido - dígito verificador 2"

    return True, ""

def validate_cpf_cnpj(document: str, person_type: str) -> Tuple[bool, str]:
    """
    Validates CPF or CNPJ based on person type
    person_type: 'PF' for CPF, 'PJ' for CNPJ
    """
    if person_type == 'PF':
        return validate_cpf(document)
    elif person_type == 'PJ':
        return validate_cnpj(document)
    else:
        return False, "Tipo de pessoa inválido (use PF ou PJ)"

def validate_email(email: str) -> Tuple[bool, str]:
    """
    Validates email format
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(pattern, email):
        return True, ""
    return False, "Email inválido"

def validate_phone(phone: str) -> Tuple[bool, str]:
    """
    Validates Brazilian phone number
    Accepts: +55DDDNNNNNNNNN or DDDNNNNNNNNN
    """
    phone = re.sub(r'[^0-9]', '', phone)

    # Remove country code if present
    if phone.startswith('55') and len(phone) > 11:
        phone = phone[2:]

    if len(phone) < 10 or len(phone) > 11:
        return False, "Telefone deve ter 10 ou 11 dígitos (com DDD)"

    # Validate DDD (area code)
    ddd = int(phone[:2])
    valid_ddds = list(range(11, 100))  # Valid DDDs in Brazil
    if ddd not in valid_ddds:
        return False, f"DDD {ddd} inválido"

    return True, ""

def validate_pix_key(key_type: str, key_value: str) -> Tuple[bool, str]:
    """
    Validates PIX key based on type
    key_type: cpf, cnpj, email, phone, evp (random)
    """
    key_type = key_type.lower()

    if key_type == 'cpf':
        return validate_cpf(key_value)
    elif key_type == 'cnpj':
        return validate_cnpj(key_value)
    elif key_type == 'email':
        return validate_email(key_value)
    elif key_type == 'phone':
        return validate_phone(key_value)
    elif key_type == 'evp':
        # EVP (random key) is a UUID format
        pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        if re.match(pattern, key_value.lower()):
            return True, ""
        return False, "Chave aleatória deve ser um UUID válido"
    else:
        return False, f"Tipo de chave PIX inválido: {key_type}"

def mask_cpf(cpf: str) -> str:
    """Masks CPF: 123.456.789-00 -> ***.***.789-**"""
    cpf = re.sub(r'[^0-9]', '', cpf)
    if len(cpf) == 11:
        return f"***.***{cpf[6:9]}.-**"
    return "***.***.***-**"

def mask_cnpj(cnpj: str) -> str:
    """Masks CNPJ: 12.345.678/0001-00 -> **.***.678/****-**"""
    cnpj = re.sub(r'[^0-9]', '', cnpj)
    if len(cnpj) == 14:
        return f"**.***.{cnpj[5:8]}/****-**"
    return "**.***.****/****-**"

def mask_email(email: str) -> str:
    """Masks email: john.doe@example.com -> j***e@example.com"""
    if '@' not in email:
        return "***@***.***"
    local, domain = email.split('@')
    if len(local) <= 2:
        return f"**@{domain}"
    return f"{local[0]}***{local[-1]}@{domain}"

def mask_phone(phone: str) -> str:
    """Masks phone: 11999998888 -> (11) *****-8888"""
    phone = re.sub(r'[^0-9]', '', phone)
    if phone.startswith('55') and len(phone) > 11:
        phone = phone[2:]
    if len(phone) >= 10:
        return f"({phone[:2]}) *****-{phone[-4:]}"
    return "(XX) *****-****"

def format_currency_brl(value: float) -> str:
    """Formats value as BRL currency: 1234.56 -> R$ 1.234,56"""
    return f"R$ {value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
