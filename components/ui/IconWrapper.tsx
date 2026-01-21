'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  hover?: boolean;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const IconWrapper = forwardRef<HTMLDivElement, IconWrapperProps>(
  (
    {
      children,
      className,
      size = 'md',
      variant = 'default',
      hover = true,
      active = true,
      disabled = false,
      onClick,
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-base',
      md: 'w-10 h-10 text-lg',
      lg: 'w-12 h-12 text-xl',
      xl: 'w-14 h-14 text-2xl',
    };

    const variantClasses = {
      default: 'text-gray-600 hover:text-primary hover:bg-gray-100 active:text-primary-dark active:bg-gray-200',
      primary: 'text-primary hover:text-primary-light hover:bg-blue-50 active:text-primary-dark active:bg-blue-100',
      secondary: 'text-secondary-purple hover:text-secondary-purple-light hover:bg-purple-50 active:text-secondary-purple-dark active:bg-purple-100',
      accent: 'text-secondary-pink hover:text-secondary-pink-light hover:bg-pink-50 active:text-secondary-pink-dark active:bg-pink-100',
      success: 'text-success hover:text-success-light hover:bg-green-50 active:text-success-dark active:bg-green-100',
      warning: 'text-warning hover:text-warning-light hover:bg-yellow-50 active:text-warning-dark active:bg-yellow-100',
      error: 'text-error hover:text-error-light hover:bg-red-50 active:text-error-dark active:bg-red-100',
    };

    const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          sizeClasses[size],
          variantClasses[variant],
          hover && !disabled && 'cursor-pointer',
          active && !disabled && 'active:scale-95',
          disabled && disabledClasses,
          className
        )}
        onClick={disabled ? undefined : onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {children}
      </div>
    );
  }
);

IconWrapper.displayName = 'IconWrapper';

export default IconWrapper;
