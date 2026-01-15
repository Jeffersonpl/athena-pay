import React, { useEffect, useCallback, ReactNode, HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: ReactNode;
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {}
export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
}) => {
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    },
    [onClose, closeOnOverlayClick]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="athena-modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={`athena-modal athena-modal-${size}`}>
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const ModalHeader: React.FC<ModalHeaderProps> = ({
  onClose,
  showCloseButton = true,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`athena-modal-header ${className}`} {...props}>
      <div className="athena-modal-title">{children}</div>
      {showCloseButton && onClose && (
        <button className="athena-modal-close" onClick={onClose} aria-label="Fechar">
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

const ModalBody: React.FC<ModalBodyProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`athena-modal-body ${className}`} {...props}>
      {children}
    </div>
  );
};

const ModalFooter: React.FC<ModalFooterProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`athena-modal-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

Modal.displayName = 'Modal';
ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalHeader, ModalBody, ModalFooter };
export default Modal;
