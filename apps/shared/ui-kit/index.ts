/**
 * Athena UI Kit
 * Nubank/PicPay-inspired component library for Athena Pay
 *
 * @example
 * import { Button, Card, Input, useToast } from '@athena/ui-kit';
 * import '@athena/ui-kit/styles';
 */

// Components
export { default as Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Card, CardHeader, CardBody, CardFooter } from './components/Card';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './components/Card';

export { default as Input } from './components/Input';
export type { InputProps } from './components/Input';

export { default as Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

export { default as Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

export { Modal, ModalHeader, ModalBody, ModalFooter } from './components/Modal';
export type { ModalProps, ModalHeaderProps, ModalBodyProps, ModalFooterProps } from './components/Modal';

export { BottomSheet, BottomSheetHeader, BottomSheetBody } from './components/BottomSheet';
export type { BottomSheetProps, BottomSheetHeaderProps, BottomSheetBodyProps } from './components/BottomSheet';

export { ToastProvider, useToast } from './components/Toast';
export type { Toast, ToastType } from './components/Toast';

export { Avatar, AvatarGroup } from './components/Avatar';
export type { AvatarProps, AvatarGroupProps } from './components/Avatar';

export { default as Badge } from './components/Badge';
export type { BadgeProps } from './components/Badge';

export { default as Spinner } from './components/Spinner';
export type { SpinnerProps } from './components/Spinner';

export { default as Skeleton } from './components/Skeleton';
export type { SkeletonProps } from './components/Skeleton';

export { default as Progress } from './components/Progress';
export type { ProgressProps } from './components/Progress';

export { default as Toggle } from './components/Toggle';
export type { ToggleProps } from './components/Toggle';

export { default as Alert } from './components/Alert';
export type { AlertProps } from './components/Alert';

export { Tabs, TabList, Tab, TabPanel } from './components/Tabs';
export type { TabsProps, TabListProps, TabProps, TabPanelProps } from './components/Tabs';

export { Dropdown, DropdownItem, DropdownDivider } from './components/Dropdown';
export type { DropdownProps, DropdownItemProps, DropdownDividerProps } from './components/Dropdown';

export { default as Amount } from './components/Amount';
export type { AmountProps } from './components/Amount';

export { default as TransactionItem } from './components/TransactionItem';
export type { TransactionItemProps, TransactionType } from './components/TransactionItem';

export { default as EmptyState } from './components/EmptyState';
export type { EmptyStateProps } from './components/EmptyState';

export { default as CreditCard } from './components/CreditCard';
export type { CreditCardProps } from './components/CreditCard';

export { default as BalanceCard } from './components/BalanceCard';
export type { BalanceCardProps } from './components/BalanceCard';

// Hooks
export { useModal } from './hooks/useModal';
export { useClickOutside } from './hooks/useClickOutside';
export { useLocalStorage } from './hooks/useLocalStorage';
export { useDebounce } from './hooks/useDebounce';
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, breakpoints } from './hooks/useMediaQuery';
export { useCopyToClipboard } from './hooks/useCopyToClipboard';
export { useTheme } from './hooks/useTheme';
export type { Theme } from './hooks/useTheme';

// Utils - Formatters
export {
  formatCurrency,
  formatCPF,
  formatCNPJ,
  formatDocument,
  formatPhone,
  formatDateBR,
  formatDateTimeBR,
  formatRelativeTime,
  formatCEP,
  formatBankAccount,
  maskPixKey,
  formatPercent,
  formatCompact,
} from './utils/formatters';

// Utils - Validators
export {
  validateCPF,
  validateCNPJ,
  validateDocument,
  validateEmail,
  validatePhone,
  validateCEP,
  validatePixKey,
  detectPixKeyType,
  validatePasswordStrength,
  validateAgency,
  validateAccount,
  validateAmount,
} from './utils/validators';
export type { PasswordStrength } from './utils/validators';
