'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

export interface NavItemConfig {
  href: string;
  label: string;
  icon?: LucideIcon;
  items?: NavItemConfig[];
  isChained?: boolean;
  external?: boolean;
}

interface SidebarContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  sidebarNavItems: NavItemConfig[];
  setSidebarNavItems: (items: NavItemConfig[]) => void;
  isSidebarAvailable: boolean;
  activePath: string;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }

  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
  allowedPaths?: string[];
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  allowedPaths = ['/dashboard', '/admin'],
}) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarNavItems, setSidebarNavItems] = useState<NavItemConfig[]>([]);
  const [isSidebarAvailable, setIsSidebarAvailable] = useState(false);

  useEffect(() => {
    const available = allowedPaths.some((p) => pathname.startsWith(p));
    setIsSidebarAvailable(available);

    if (!available) {
      setIsSidebarOpen(false);
      setSidebarNavItems([]);
    }
  }, [pathname, allowedPaths]);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        sidebarNavItems,
        setSidebarNavItems,
        isSidebarAvailable,
        activePath: pathname,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
