'use client';

import { ReactNode } from 'react';
import { Home } from 'lucide-react';
import AuthGuard from '@/components/guards/AuthGuard';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sidebarLinks = [{ name: 'Home', href: '/dashboard', icon: Home }];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
