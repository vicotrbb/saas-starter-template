'use client';

import { useEffect } from 'react';
import { useSidebar, NavItemConfig } from '@/contexts/sidebar-context';

interface SidebarNavSetterProps {
  navItems: NavItemConfig[];
}

export const SidebarNavSetter: React.FC<SidebarNavSetterProps> = ({ navItems }) => {
  const { setSidebarNavItems, isSidebarAvailable } = useSidebar();

  useEffect(() => {
    if (isSidebarAvailable) {
      setSidebarNavItems(navItems);
    }
    return () => {};
  }, [navItems, setSidebarNavItems, isSidebarAvailable]);

  return null;
};
