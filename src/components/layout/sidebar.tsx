'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavItemConfig, useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';
import { ChevronDownIcon, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const SIDEBAR_WIDTH = 'w-72'; // approx 18rem

export function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen, sidebarNavItems, isSidebarAvailable, activePath } =
    useSidebar();

  const [openCollapsibles, setOpenCollapsibles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newOpenStates: Record<string, boolean> = {};
    const findActiveParents = (items: NavItemConfig[], currentPath: string) => {
      items.forEach((item) => {
        if (item.items && item.items.length > 0) {
          const hasActiveChild = item.items.some(
            (child) => child.href !== '/' && currentPath.startsWith(child.href)
          );
          if (hasActiveChild) {
            newOpenStates[item.href] = true;
          }
        }
      });
    };
    findActiveParents(sidebarNavItems, activePath);
    setOpenCollapsibles((prev) => ({ ...prev, ...newOpenStates }));
  }, [activePath, sidebarNavItems]);

  if (!isSidebarAvailable) {
    return null;
  }

  const toggleCollapsible = (href: string) => {
    setOpenCollapsibles((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const renderNavItem = (item: NavItemConfig, index: number) => {
    const isActive =
      activePath === item.href || (item.href !== '/' && activePath.startsWith(item.href));
    const hasSubItems = item.items && item.items.length > 0;
    const isCollapsibleOpen = openCollapsibles[item.href] || false;

    if (hasSubItems) {
      return (
        <Collapsible
          key={`${item.href}-${index}`}
          open={isCollapsibleOpen}
          onOpenChange={() => toggleCollapsible(item.href)}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant={isActive && !isCollapsibleOpen ? 'secondary' : 'ghost'}
              className="mb-1 h-12 w-full justify-start px-4 text-sm font-medium"
            >
              {item.icon && (
                <item.icon className={cn('mr-3 h-5 w-5', isActive && 'text-primary')} />
              )}
              <span className="flex-grow text-left">{item.label}</span>
              <ChevronDownIcon
                className={cn(
                  'ml-auto h-5 w-5 transform transition-transform duration-200',
                  isCollapsibleOpen ? 'rotate-180' : ''
                )}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="border-border mr-1 ml-[0.875rem] border-l-2 py-1 pl-5">
            {item.items?.map((subItem, subIndex) => renderNavItem(subItem, subIndex))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={`${item.href}-${index}`}
        variant={isActive ? 'secondary' : 'ghost'}
        className="mb-1 h-12 w-full justify-start px-4 text-sm font-medium"
        asChild
      >
        <Link
          href={item.href}
          onClick={() => !item.isChained && setIsSidebarOpen(false)}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
        >
          {item.icon && <item.icon className={cn('mr-3 h-5 w-5', isActive && 'text-primary')} />}
          {item.label}
        </Link>
      </Button>
    );
  };

  return (
    <aside
      className={cn(
        SIDEBAR_WIDTH,
        'bg-background fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] border-r',
        'flex flex-col transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold tracking-tight">Menu</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-grow px-3 py-4">
        <nav className="flex flex-col">
          {sidebarNavItems.length > 0 ? (
            sidebarNavItems.map(renderNavItem)
          ) : (
            <p className="text-muted-foreground p-4 text-center text-sm">
              No navigation items available.
            </p>
          )}
        </nav>
      </ScrollArea>
      {/* Optional Footer */}
    </aside>
  );
}
