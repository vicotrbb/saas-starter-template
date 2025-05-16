'use client';

import { ReactNode } from 'react';
import { Home, LayoutDashboardIcon } from 'lucide-react';
import SystemAdminGuard from '@/components/guards/SystemAdminGuard';
import { SidebarNavSetter } from '@/components/layout/sidebar-nav-setter';
import { NavItemConfig } from '@/contexts/sidebar-context';

const adminNavItems: NavItemConfig[] = [
  { label: 'Home', href: '/admin', icon: Home },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SystemAdminGuard>
      <SidebarNavSetter navItems={adminNavItems} />
      {children}
    </SystemAdminGuard>
  );
}
