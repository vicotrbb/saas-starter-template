'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useAuth } from '../providers/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { useSidebar } from '@/contexts/sidebar-context';

interface NavItemConfig {
  href: string;
  label: string;
  authRequired?: boolean;
  icon?: React.ElementType;
}

const mainNavItems: NavItemConfig[] = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard', authRequired: true },
];

const authNavLinks = {
  login: { href: '/auth/login', label: 'Log In' },
  register: { href: '/auth/register', label: 'Sign Up' },
};

const userMenuItems: NavItemConfig[] = [
  { label: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { label: 'Account Settings', href: '/dashboard/settings', icon: Settings },
];

export function Header() {
  const { user, userData, isLoading, signOut, isUserDataLoading } = useAuth();
  const isAuthenticated = !!user;
  const { isSidebarOpen, setIsSidebarOpen, isSidebarAvailable } = useSidebar();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const displayName = userData?.name ?? user?.email?.split('@')[0];
  const userEmail = userData?.email ?? user?.email;
  const avatarFallback = (displayName?.[0] ?? 'U').toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url ?? undefined;

  const renderNavLinks = () =>
    mainNavItems
      .filter((item) => !item.authRequired || isAuthenticated)
      .map((item) => (
        <Button
          key={item.href}
          variant="link"
          asChild
          className="text-muted-foreground hover:text-foreground px-3"
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ));

  return (
    <header className="border-border/60 bg-background/90 sticky top-0 z-50 w-full border-b backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {isAuthenticated && isSidebarAvailable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:mr-2"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-foreground text-xl font-semibold tracking-tight">YourApp</span>
          </Link>
        </div>

        <nav className="items-center space-x-1 lg:flex">{renderNavLinks()}</nav>

        <div className="flex items-center gap-3">
          {(isLoading || (isAuthenticated && isUserDataLoading)) && (
            <>
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </>
          )}

          {!isLoading && !isUserDataLoading && isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="hover:border-primary/50 h-9 w-9 border-2 border-transparent transition-colors">
                    <AvatarImage src={avatarUrl} alt={displayName ?? 'User avatar'} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1 py-1">
                    {displayName && (
                      <p className="text-foreground text-sm leading-none font-medium">
                        {displayName}
                      </p>
                    )}
                    {userEmail && (
                      <p className="text-muted-foreground text-xs leading-none">{userEmail}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userMenuItems.map((item) => (
                  <DropdownMenuItem key={item.label} asChild className="cursor-pointer">
                    <Link href={item.href} className="flex items-center py-2 text-sm">
                      {item.icon && <item.icon className="text-muted-foreground mr-2.5 h-4 w-4" />}
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="group cursor-pointer py-2 text-sm text-red-500 hover:text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:hover:text-red-500 dark:focus:bg-red-900/50 dark:focus:text-red-400"
                >
                  <LogOut className="mr-2.5 h-4 w-4 transition-colors group-hover:text-red-600 dark:group-hover:text-red-500" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!isLoading && !isAuthenticated && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href={authNavLinks.login.href}>{authNavLinks.login.label}</Link>
              </Button>
              <Button asChild>
                <Link href={authNavLinks.register.href}>{authNavLinks.register.label}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
