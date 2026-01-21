'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconWrapper } from '@/components/ui/IconWrapper';
import { cn } from '@/lib/utils';

export interface NavigationHelperProps {
  showBack?: boolean;
  showHome?: boolean;
  backHref?: string;
  homeHref?: string;
  className?: string;
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export const NavigationHelper: React.FC<NavigationHelperProps> = ({
  showBack = true,
  showHome = true,
  backHref,
  homeHref = '/',
  className,
  position = 'top-left',
  variant = 'default',
  size = 'md',
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const positionClasses = {
    'top-left': 'fixed top-4 left-4 z-50',
    'top-right': 'fixed top-4 right-4 z-50',
    'top-center': 'fixed top-4 left-1/2 -translate-x-1/2 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
  };

  return (
    <div className={cn('flex items-center gap-2', positionClasses[position], className)}>
      {showBack && (
        <IconWrapper
          size={size}
          variant={variant}
          onClick={handleBack}
          aria-label="返回"
        >
          <i className="ri-arrow-left-line" />
        </IconWrapper>
      )}
      {showHome && (
        <Link href={homeHref}>
          <IconWrapper
            size={size}
            variant={variant}
            aria-label="首页"
          >
            <i className="ri-home-line" />
          </IconWrapper>
        </Link>
      )}
    </div>
  );
};

export default NavigationHelper;
