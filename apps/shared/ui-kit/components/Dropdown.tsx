import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  HTMLAttributes,
} from 'react';

export interface DropdownProps {
  trigger: ReactNode;
  align?: 'left' | 'right';
  closeOnSelect?: boolean;
  children: ReactNode;
}

export interface DropdownItemProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownDividerProps extends HTMLAttributes<HTMLDivElement> {}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  align = 'left',
  closeOnSelect = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClickOutside, handleEscape]);

  const handleItemClick = () => {
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const menuClasses = [
    'athena-dropdown-menu',
    align === 'right' && 'athena-dropdown-menu-right',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={dropdownRef} className="athena-dropdown">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className={menuClasses} onClick={handleItemClick}>
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownItem: React.FC<DropdownItemProps> = ({
  icon,
  danger = false,
  disabled = false,
  className = '',
  children,
  onClick,
  ...props
}) => {
  const classes = [
    'athena-dropdown-item',
    danger && 'athena-dropdown-item-danger',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  return (
    <div
      className={classes}
      onClick={handleClick}
      role="menuitem"
      aria-disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </div>
  );
};

const DropdownDivider: React.FC<DropdownDividerProps> = ({ className = '', ...props }) => {
  return <div className={`athena-dropdown-divider ${className}`} {...props} />;
};

Dropdown.displayName = 'Dropdown';
DropdownItem.displayName = 'DropdownItem';
DropdownDivider.displayName = 'DropdownDivider';

export { Dropdown, DropdownItem, DropdownDivider };
export default Dropdown;
