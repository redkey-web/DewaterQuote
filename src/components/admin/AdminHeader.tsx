'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Tags,
  Building2,
  FileImage,
  Settings,
} from 'lucide-react';

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email: string;
  };
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Brands', href: '/admin/brands', icon: Building2 },
  { name: 'Files', href: '/admin/files', icon: FileImage },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminHeader({ user }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 shrink-0 items-center px-6">
            <span className="text-xl font-bold text-blue-600">Dewater Admin</span>
          </div>
          <nav className="px-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href));

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold',
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1" />

        {/* User dropdown */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="hidden lg:block text-sm font-medium">
                  {user.name || user.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
