'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  PackageSearch,
  Truck,
  Tags,
  Building2,
  FileImage,
  Settings,
  ExternalLink,
  FileText,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  User,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Quotes', href: '/admin/quotes', icon: FileText },
  { name: 'Inventory', href: '/admin/inventory', icon: PackageSearch },
  { name: 'Product Pages', href: '/admin/products', icon: Package },
  { name: 'Logistics', href: '/admin/logistics', icon: Truck },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Brands', href: '/admin/brands', icon: Building2 },
  { name: 'Files', href: '/admin/files', icon: FileImage },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Help', href: '/admin/help', icon: HelpCircle },
];

const SIDEBAR_COLLAPSED_KEY = 'admin-sidebar-collapsed';

interface AdminSidebarProps {
  user?: {
    name?: string | null;
    email: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps = { user: undefined }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
    setIsHydrated(true);
  }, []);

  // Save preference to localStorage and notify other components
  const toggleCollapsed = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newValue));
    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new CustomEvent('sidebar-collapsed-change', { detail: { isCollapsed: newValue } }));
  };

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4" />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out',
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        )}
      >
        <div
          className={cn(
            'flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white pb-4 transition-all duration-300',
            isCollapsed ? 'px-2' : 'px-6'
          )}
        >
          {/* Logo */}
          <div className="flex flex-col h-32 shrink-0 justify-center">
            <Link href="/admin" className={cn('flex flex-col gap-1', isCollapsed ? 'items-center' : 'items-start')}>
              {isCollapsed ? (
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
              ) : (
                <>
                  <Image
                    src="/images/logo-new.png"
                    alt="DeWater Products"
                    width={500}
                    height={167}
                    className="h-14 w-auto object-contain"
                    priority
                  />
                  <span className="text-xs text-gray-500 font-medium">Admin Panel</span>
                </>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className={cn('-mx-2 space-y-1', isCollapsed && 'mx-0')}>
                  {navigation.map((item) => {
                    const isActive = pathname === item.href ||
                      (item.href !== '/admin' && pathname?.startsWith(item.href));

                    const linkContent = (
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600',
                          isCollapsed && 'justify-center px-2'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-6 w-6 shrink-0',
                            isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                          )}
                          aria-hidden="true"
                        />
                        {!isCollapsed && item.name}
                      </Link>
                    );

                    return (
                      <li key={item.name}>
                        {isCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                            <TooltipContent side="right" sideOffset={10}>
                              {item.name}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          linkContent
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* Bottom Section */}
              <li className="mt-auto space-y-2">
                {/* User Dropdown */}
                {user && (
                  <div className={cn(isCollapsed && 'flex justify-center')}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" side="right" className="w-56">
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
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={10}>
                          {user.name || user.email}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-full -mx-2 justify-start gap-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 shrink-0">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex flex-col items-start overflow-hidden">
                              <span className="text-sm font-medium truncate max-w-full">
                                {user.name || 'Admin'}
                              </span>
                              <span className="text-xs text-gray-500 truncate max-w-full">
                                {user.email}
                              </span>
                            </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="right" className="w-56">
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
                    )}
                  </div>
                )}

                {/* View Site Link */}
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex justify-center rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      >
                        <ExternalLink
                          className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
                          aria-hidden="true"
                        />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      View Site
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600 -mx-2"
                  >
                    <ExternalLink
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"
                      aria-hidden="true"
                    />
                    View Site
                  </a>
                )}

                {/* Collapse Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleCollapsed}
                  className={cn(
                    'w-full text-gray-500 hover:text-gray-900',
                    isCollapsed ? 'justify-center px-2' : '-mx-2 justify-start gap-x-3'
                  )}
                  title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isCollapsed ? (
                    <PanelLeft className="h-5 w-5" />
                  ) : (
                    <>
                      <PanelLeftClose className="h-5 w-5" />
                      <span className="text-sm">Collapse</span>
                    </>
                  )}
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </TooltipProvider>
  );
}
