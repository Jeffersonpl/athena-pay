import React, { useEffect, useCallback, ReactNode, HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showHandle?: boolean;
  children: ReactNode;
}

export interface BottomSheetHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export interface BottomSheetBodyProps extends HTMLAttributes<HTMLDivElement> {}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showHandle = true,
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

  const content = (
    <>
      <div className="athena-bottom-sheet-overlay" onClick={handleOverlayClick} />
      <div className="athena-bottom-sheet" role="dialog" aria-modal="true">
        {showHandle && <div className="athena-bottom-sheet-handle" />}
        {children}
      </div>
    </>
  );

  return createPortal(content, document.body);
};

const BottomSheetHeader: React.FC<BottomSheetHeaderProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`athena-bottom-sheet-header ${className}`} {...props}>
      <div className="athena-modal-title">{children}</div>
    </div>
  );
};

const BottomSheetBody: React.FC<BottomSheetBodyProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`athena-bottom-sheet-body ${className}`} {...props}>
      {children}
    </div>
  );
};

BottomSheet.displayName = 'BottomSheet';
BottomSheetHeader.displayName = 'BottomSheetHeader';
BottomSheetBody.displayName = 'BottomSheetBody';

export { BottomSheet, BottomSheetHeader, BottomSheetBody };
export default BottomSheet;
