'use client';

import { ReactNode } from 'react';
import { LayoutDashboard, Settings, BarChart3, Building2 } from 'lucide-react';
import { SidebarNavSetter } from '@/components/layout/sidebar-nav-setter';
import { NavItemConfig } from '@/contexts/sidebar-context';
import AuthGuard from '@/components/guards/AuthGuard';

const dashboardNavItems: NavItemConfig[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/organization', label: 'Organization', icon: Building2 },
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
