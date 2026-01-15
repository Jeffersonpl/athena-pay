/**
 * Athena UI Kit - Validators
 * Brazilian document and input validation utilities
 */

/**
 * Validate CPF
 */
export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');

  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;

  return true;
}

/**
 * Validate CNPJ
 */
export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');

  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(digits[12])) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(digits[13])) return false;

  return true;
}

/**
 * Validate CPF or CNPJ
 */
export function validateDocument(doc: string): boolean {
  const digits = doc.replace(/\D/g, '');
  return digits.length <= 11 ? validateCPF(doc) : validateCNPJ(doc);
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate Brazilian phone number
 */
export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

/**
 * Validate CEP (Brazilian postal code)
 */
export function validateCEP(cep: string): boolean {
  const digits = cep.replace(/\D/g, '');
  return digits.length === 8;
}

/**
 * Validate PIX key
 */
export function validatePixKey(key: string, type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'): boolean {
  switch (type) {
    case 'cpf':
      return validateCPF(key);
    case 'cnpj':
      return validateCNPJ(key);
    case 'email':
      return validateEmail(key);
    case 'phone':
      return validatePhone(key);
    case 'random':
      return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(key);
    default:
      return false;
  }
}

/**
 * Detect PIX key type
 */
export function detectPixKeyType(key: string): 'cpf' | 'cnpj' | 'email' | 'phone' | 'random' | 'unknown' {
  const cleaned = key.replace(/\D/g, '');

  if (cleaned.length === 11 && validateCPF(key)) return 'cpf';
  if (cleaned.length === 14 && validateCNPJ(key)) return 'cnpj';
  if (validateEmail(key)) return 'email';
  if (cleaned.length >= 10 && cleaned.length <= 11) return 'phone';
  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(key)) return 'random';

  return 'unknown';
}

/**
 * Validate password strength
 */
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isStrong: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Deve ter pelo menos 8 caracteres');

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else feedback.push('Deve conter letras maiúsculas e minúsculas');

  if (/\d/.test(password)) score++;
  else feedback.push('Deve conter números');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else feedback.push('Deve conter caracteres especiais');

  return {
    score: Math.min(score, 4),
    feedback,
    isStrong: score >= 3,
  };
}

/**
 * Validate bank agency number
 */
export function validateAgency(agency: string): boolean {
  const digits = agency.replace(/\D/g, '');
  return digits.length >= 3 && digits.length <= 5;
}

/**
 * Validate bank account number
 */
export function validateAccount(account: string): boolean {
  const alphanumeric = account.replace(/[^0-9xX]/gi, '');
  return alphanumeric.length >= 4 && alphanumeric.length <= 15;
}

/**
 * Validate amount (positive, within limits)
 */
export function validateAmount(
  amount: number,
  options?: { min?: number; max?: number }
): { valid: boolean; error?: string } {
  const { min = 0.01, max = 999999999.99 } = options || {};

  if (isNaN(amount)) {
    return { valid: false, error: 'Valor inválido' };
  }

  if (amount < min) {
    return { valid: false, error: `Valor mínimo: R$ ${min.toFixed(2)}` };
  }

  if (amount > max) {
    return { valid: false, error: `Valor máximo: R$ ${max.toFixed(2)}` };
  }

  return { valid: true };
}
