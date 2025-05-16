'use client';

import React from 'react';
import { useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';

interface MainContentWrapperProps {
  children: React.ReactNode;
}

// The sidebar width is w-72, which is 18rem (72 * 4px / 16px = 18rem).
const SIDEBAR_WIDTH_STRING = '18rem';

export function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { isSidebarOpen, isSidebarAvailable } = useSidebar();

  return (
    <main
      className={cn('flex-grow transition-all duration-300 ease-in-out', 'ml-0 w-full', {
        [`lg:ml-[${SIDEBAR_WIDTH_STRING}] lg:w-[calc(100%-${SIDEBAR_WIDTH_STRING})]`]:
          isSidebarOpen && isSidebarAvailable,
      })}
    >
      {children}
    </main>
  );
}
