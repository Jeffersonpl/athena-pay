/**
 * Athena UI Kit - Formatters
 * Brazilian/fintech-specific formatting utilities
 */

/**
 * Format currency value
 */
export function formatCurrency(
  value: number,
  options?: {
    currency?: string;
    locale?: string;
    showSign?: boolean;
  }
): string {
  const { currency = 'BRL', locale = 'pt-BR', showSign = false } = options || {};

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));

  if (showSign && value !== 0) {
    return value > 0 ? `+ ${formatted}` : `- ${formatted}`;
  }

  return value < 0 ? `- ${formatted}` : formatted;
}

/**
 * Format CPF (###.###.###-##)
 */
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/**
 * Format CNPJ (##.###.###/####-##)
 */
export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

/**
 * Format CPF or CNPJ based on length
 */
export function formatDocument(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length <= 11 ? formatCPF(value) : formatCNPJ(value);
}

/**
 * Format phone number ((##) ####-#### or (##) #####-####)
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

/**
 * Format date to Brazilian format (dd/mm/yyyy)
 */
export function formatDateBR(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Format date and time to Brazilian format
 */
export function formatDateTimeBR(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Format relative time (e.g., "há 2 horas")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'agora';
  if (diffMin < 60) return `há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
  if (diffHour < 24) return `há ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
  if (diffDay < 7) return `há ${diffDay} ${diffDay === 1 ? 'dia' : 'dias'}`;

  return formatDateBR(d);
}

/**
 * Format CEP (postal code) #####-###
 */
export function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, '$1-$2');
}

/**
 * Format bank account (agency/account)
 */
export function formatBankAccount(agency: string, account: string): string {
  return `Ag. ${agency} / Cc. ${account}`;
}

/**
 * Format PIX key (masked for privacy)
 */
export function maskPixKey(key: string, type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'): string {
  switch (type) {
    case 'cpf':
      return `***.***.${key.slice(-6, -2)}-**`;
    case 'cnpj':
      return `**.***.***/${key.slice(-6, -2)}-**`;
    case 'email':
      const [user, domain] = key.split('@');
      return `${user.slice(0, 2)}***@${domain}`;
    case 'phone':
      return `(**) *****-${key.slice(-4)}`;
    case 'random':
      return `${key.slice(0, 8)}...${key.slice(-4)}`;
    default:
      return key;
  }
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with abbreviation (k, M, B)
 */
export function formatCompact(value: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}
