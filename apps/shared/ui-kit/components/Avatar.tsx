import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: ReactNode;
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, name, size = 'md', fallback, className = '', ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);

    const classes = ['athena-avatar', `athena-avatar-${size}`, className]
      .filter(Boolean)
      .join(' ');

    const renderContent = () => {
      if (src && !imgError) {
        return <img src={src} alt={alt || name || ''} onError={() => setImgError(true)} />;
      }

      if (fallback) {
        return fallback;
      }

      if (name) {
        return <span>{getInitials(name)}</span>;
      }

      return (
        <svg
          width="60%"
          height="60%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    };

    return (
      <div ref={ref} className={classes} {...props}>
        {renderContent()}
      </div>
    );
  }
);

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max, className = '', children, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visibleChildren = max ? childArray.slice(0, max) : childArray;
    const remainingCount = max ? childArray.length - max : 0;

    return (
      <div ref={ref} className={`athena-avatar-group ${className}`} {...props}>
        {visibleChildren}
        {remainingCount > 0 && (
          <div className="athena-avatar athena-avatar-md">
            <span>+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
export default Avatar;
