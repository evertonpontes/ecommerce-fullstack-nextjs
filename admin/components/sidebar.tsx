'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Home,
  Tag,
  Package,
  ShoppingCart,
  Users,
  Menu,
  SidebarIcon,
  Coffee,
  Cookie,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { TooltipItem } from './tooltip-item';

export function Aside() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      icon: Home,
      href: '/',
      isActive: pathname === '/',
    },
    {
      name: 'Categories',
      icon: Tag,
      href: '/categories',
      isActive: pathname === '/categories',
    },
    {
      name: 'Products',
      icon: Package,
      href: '/products',
      isActive: pathname === '/products',
    },
    {
      name: 'Orders',
      icon: ShoppingCart,
      href: '/orders',
      isActive: pathname === '/orders',
    },
    {
      name: 'Customers',
      icon: Users,
      href: '/customers',
      isActive: pathname === '/customers',
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Cookie className="fill-orange-100 stroke-orange-400 h-9 w-9 md:h-8 md:w-8" />
        {navItems.map((item, index) => (
          <TooltipItem key={index} content={item.name}>
            <Link
              href={item.href}
              passHref
              className={cn(
                'h-9 w-9 flex justify-center gap-2 items-center shrink-0 text-muted-foreground rounded-lg md:w-8 md:h-8',
                item.isActive && 'bg-accent'
              )}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          </TooltipItem>
        ))}
      </nav>
    </aside>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      icon: Home,
      href: '/',
      isActive: pathname === '/',
    },
    {
      name: 'Categories',
      icon: Tag,
      href: '/categories',
      isActive: pathname === '/categories',
    },
    {
      name: 'Products',
      icon: Package,
      href: '/products',
      isActive: pathname === '/products',
    },
    {
      name: 'Orders',
      icon: ShoppingCart,
      href: '/orders',
      isActive: pathname === '/orders',
    },
    {
      name: 'Customers',
      icon: Users,
      href: '/customers',
      isActive: pathname === '/customers',
    },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="mr-4 sm:hidden">
            <SidebarIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );

  function SidebarContent() {
    return (
      <div className="flex h-full w-full flex-col bg-background">
        <div className="p-6">
          <SheetTitle className="flex items-center gap-4">
            <Cookie className="fill-orange-100 stroke-orange-400 h-10 w-10" />
            Dashboard
          </SheetTitle>
          <SheetDescription className="ml-12">
            E-commerce Admin
          </SheetDescription>
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item, index) => (
              <Link key={index} href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-3 text-lg',
                    item.isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    );
  }
}
