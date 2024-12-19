'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Home,
  Tag,
  Package,
  ShoppingCart,
  Users,
  SidebarIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { TooltipItem } from './tooltip-item';
import Logo from '@/public/ecommerce-logo.svg';

export function Aside() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
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
        <Link href="/" className="flex items-center gap-2">
          <div className="aspect-square size-8 relative">
            <Image
              src={Logo}
              alt="logo"
              fill
              className="object-contain absolute"
            />
          </div>
        </Link>
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
      name: 'Home',
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
        <SheetContent side="left" className="p-0" aria-describedby={undefined}>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );

  function SidebarContent() {
    return (
      <div className="flex h-full w-full flex-col bg-background">
        <div className="p-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="aspect-square size-8 relative">
              <Image
                src={Logo}
                alt="logo"
                fill
                className="object-contain absolute"
              />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <SheetTitle className="font-semibold">
                E-commerce Admin
              </SheetTitle>
              <span className="text-xs text-muted-foreground">
                Manage your store
              </span>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col pt-0 p-4">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size={'sm'}
                className={cn(
                  'w-full justify-start gap-3',
                  item.isActive ? 'text-primary' : 'text-muted-foreground'
                )}
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={item.href} passHref>
                  <item.icon className="mr-2 size-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>
    );
  }
}
