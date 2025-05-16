'use client';

import { ReactNode } from 'react';
import { LayoutDashboard, Users, Settings, BarChart3 } from 'lucide-react';
import { SidebarNavSetter } from '@/components/layout/sidebar-nav-setter';
import { NavItemConfig } from '@/contexts/sidebar-context';
import AuthGuard from '@/components/guards/AuthGuard';

const dashboardNavItems: NavItemConfig[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/users', label: 'User Management', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SidebarNavSetter navItems={dashboardNavItems} />
      {children}
    </AuthGuard>
  );
}
