'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/headers/PageHeader';
import Navigation from '@/components/Navigation';
import BadgeHallPage from '@/src/components/badge/BadgeHallPage';
import { useChildren } from '@/hooks/useChildren';

export default function BadgesPage() {
  const { currentChild } = useChildren();

  return (
    <div className='min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50'>
      <PageHeader title='勋章殿堂' showBack />
      
      <main className='px-4 py-4'>
        {currentChild ? (
          <BadgeHallPage />
        ) : (
          <div className='bg-amber-50 border-amber-200 rounded-lg p-6 text-center'>
            <p className='text-amber-700 mb-2'>请先在设置中添加孩子档案</p>
            <Link
              href='/children'
              className='text-blue-600 underline text-sm'
            >
              去添加
            </Link>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
}
