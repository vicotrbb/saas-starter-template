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
    // Clear nav items when component unmounts or if sidebar becomes unavailable,
    // or if navItems prop changes for this specific section.
    return () => {
      // Potentially clear them only if this instance was the one that set them,
      // or rely on the context to clear them if path changes out of allowed scope.
      // For now, let's assume another NavSetter or context handles clearing on path change.
    };
  }, [navItems, setSidebarNavItems, isSidebarAvailable]);

  return null; // This component does not render anything
};
