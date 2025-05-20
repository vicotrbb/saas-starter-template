'use client';

import React from 'react';
import { useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';

interface MainContentWrapperProps {
  children: React.ReactNode;
}

export function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { isSidebarOpen, isSidebarAvailable } = useSidebar();

  return (
    <main
      className={cn(
        'flex-grow px-4 transition-all duration-300 ease-in-out',
        isSidebarOpen && isSidebarAvailable ? 'lg:pl-80' : 'lg:px-8'
      )}
    >
      {children}
    </main>
  );
}
