'use client';

import { ReactNode } from 'react';
import { Home, LayoutDashboardIcon } from 'lucide-react';
import SystemAdminGuard from '@/components/guards/SystemAdminGuard';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sidebarLinks = [
  { name: 'Home', href: '/admin', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <SystemAdminGuard>{children}</SystemAdminGuard>;
}
