import React, { forwardRef, HTMLAttributes, CSSProperties } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rect' | 'avatar' | 'card';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      size = 'md',
      width,
      height,
      lines = 1,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'circle':
          return 'athena-skeleton athena-skeleton-circle';
        case 'avatar':
          return `athena-skeleton athena-skeleton-circle athena-skeleton-avatar-${size}`;
        case 'card':
          return 'athena-skeleton athena-skeleton-card';
        case 'rect':
          return 'athena-skeleton';
        default:
          return 'athena-skeleton athena-skeleton-text';
      }
    };

    const classes = [getVariantClasses(), className].filter(Boolean).join(' ');

    const getSize = (): CSSProperties => {
      if (width || height) {
        return {
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        };
      }

      if (variant === 'circle' || variant === 'avatar') {
        const sizeMap = { sm: 32, md: 40, lg: 48 };
        const pixelSize = sizeMap[size];
        return { width: pixelSize, height: pixelSize, ...style };
      }

      return style || {};
    };

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={classes}
              style={{
                ...getSize(),
                width: index === lines - 1 ? '60%' : '100%',
              }}
            />
          ))}
        </div>
      );
    }

    return <div ref={ref} className={classes} style={getSize()} {...props} />;
  }
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
