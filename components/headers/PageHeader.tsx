'use client';

import type React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconWrapper } from '@/components/ui/IconWrapper';

export interface PageHeaderProps {
  icon?: string;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showHome?: boolean;
  homeHref?: string;
  actions?: Array<{ icon: string; label: string; onClick?: () => void }>;
  children?: React.ReactNode;
}

export default function PageHeader({
  icon,
  title,
  subtitle,
  showBack,
  showHome = true,
  homeHref = '/',
  actions,
  children,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <motion.header
      className='w-full px-8 py-4 flex items-center justify-between z-20'
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className='flex items-center gap-3'>
        {showBack && (
          <IconWrapper
            size='md'
            variant='primary'
            onClick={handleBack}
            aria-label='返回'
          >
            <i className='ri-arrow-left-line' />
          </IconWrapper>
        )}
        {showHome && (
          <Link href={homeHref}>
            <IconWrapper
              size='md'
              variant='secondary'
              aria-label='首页'
            >
              <i className='ri-home-line' />
            </IconWrapper>
          </Link>
        )}
        {icon && <i className={`${icon} text-blue-500`} />}
        <div>
          <h1 className='text-3xl font-bold text-slate-800'>{title}</h1>
          {subtitle && <p className='text-slate-600 text-sm'>{subtitle}</p>}
        </div>
      </div>

      {actions && (
        <div className='flex gap-4'>
          {actions.map((action, index) => (
            <motion.button
              key={index}
              className='flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:bg-blue-50 transition text-slate-600'
              onClick={action.onClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={`${action.icon} text-lg`} />
              <span className='text-sm font-bold'>{action.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {children}
    </motion.header>
  );
}
