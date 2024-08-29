'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Tag,
  Package,
  ShoppingCart,
  Users,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Overview',
      icon: LayoutDashboard,
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
          <Button variant="ghost" size="icon" className="mr-4">
            <Menu className="h-6 w-6" />
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
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item, index) => (
              <Link key={index} href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-3',
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
