'use client';

import React, { ReactNode } from 'react';
import PageHeader from './headers/PageHeader';
import HomeHeader from './headers/HomeHeader';
import Navigation from './Navigation';
import type { PageHeaderProps } from './headers/PageHeader';

interface LayoutProps {
  children: ReactNode;
  headerType?: 'home' | 'page';
  headerProps?: PageHeaderProps;
  showNavigation?: boolean;
  className?: string;
}

export default function Layout({ 
  children, 
  headerType = 'page', 
  headerProps, 
  showNavigation = true,
  className = ''
}: LayoutProps) {
  return (
    <div className={`h-screen flex flex-col overflow-hidden relative bg-sky-100 ${className}`}>
      {headerType === 'home' ? (
        <HomeHeader />
      ) : (
        <PageHeader {...headerProps} />
      )}

      <main className='flex-1 overflow-y-auto w-full'>
        <section className='max-w-7xl mx-auto w-full px-8 pb-28 pt-4'>
          {children}
        </section>
      </main>

      {showNavigation && <Navigation />}
    </div>
  );
}

interface FullHeightLayoutProps {
  children: ReactNode;
  className?: string;
}

export function FullHeightLayout({ children, className = '' }: FullHeightLayoutProps) {
  return (
    <div className={`min-h-screen bg-sky-100 pb-24 ${className}`}>
      {children}
    </div>
  );
}

export function MainContentWrapper({ children }: { children: ReactNode }) {
  return (
    <main className='flex-1 overflow-y-auto w-full'>
      <section className='max-w-7xl mx-auto w-full px-8 pb-28 pt-4'>
        {children}
      </section>
    </main>
  );
}
