'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ArrowRightLeft,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  badgeKey?: 'quotes';
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Quotes', href: '/admin/quotes', icon: FileText, badgeKey: 'quotes' },
  { name: 'Inventory', href: '/admin/inventory', icon: PackageSearch },
  { name: 'Product Pages', href: '/admin/products', icon: Package },
  { name: 'Logistics', href: '/admin/logistics', icon: Truck },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Brands', href: '/admin/brands', icon: Building2 },
  { name: 'Redirects', href: '/admin/redirects', icon: ArrowRightLeft },
  { name: 'Files', href: '/admin/files', icon: FileImage },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Help', href: '/admin/help', icon: HelpCircle },
];

const SIDEBAR_COLLAPSED_KEY = 'admin-sidebar-collapsed';

interface BadgeCounts {
  quotes: number;
}

interface AdminSidebarProps {
  user?: {
    name?: string | null;
    email: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps = { user: undefined }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true); // Default collapsed (rail mode)
  const [isHydrated, setIsHydrated] = useState(false);
  const [badges, setBadges] = useState<BadgeCounts>({ quotes: 0 });

  // Load preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
    setIsHydrated(true);
  }, []);

  // Fetch badge counts
  useEffect(() => {
    async function fetchBadges() {
      try {
        const res = await fetch('/api/admin/stats/badges');
        if (res.ok) {
          const data = await res.json();
          setBadges(data);
        }
      } catch {
        // Ignore errors
      }
    }
    fetchBadges();
    // Refresh every 60 seconds
    const interval = setInterval(fetchBadges, 60000);
    return () => clearInterval(interval);
  }, []);

  // Save preference to localStorage and notify other components
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newValue));
      // Dispatch custom event for same-tab communication
      window.dispatchEvent(
        new CustomEvent('sidebar-collapsed-change', { detail: { isCollapsed: newValue } })
      );
      return newValue;
    });
  }, []);

  // Keyboard shortcut: [ to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === '[' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleCollapsed();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleCollapsed]);

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-12 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-2 pb-4" />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-200 ease-out',
          isCollapsed ? 'lg:w-14' : 'lg:w-64'
        )}
      >
        <div
          className={cn(
            'flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white pb-4 transition-all duration-200',
            isCollapsed ? 'px-2' : 'px-4'
          )}
        >
          {/* Logo */}
          <div
            className={cn(
              'flex shrink-0 items-center border-b border-gray-100',
              isCollapsed ? 'h-14 justify-center' : 'h-16 px-2'
            )}
          >
            <Link href="/admin" className="flex items-center gap-2">
              {isCollapsed ? (
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-sm">D</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">DeWater</span>
                    <span className="text-[10px] text-gray-500 -mt-0.5">Admin Panel</span>
                  </div>
                </>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname?.startsWith(item.href));
                const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;

                const linkContent = (
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-x-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-cyan-50 text-cyan-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      isCollapsed && 'justify-center'
                    )}
                  >
                    <div className="relative">
                      <item.icon
                        className={cn(
                          'h-5 w-5 shrink-0 transition-colors',
                          isActive
                            ? 'text-cyan-600'
                            : 'text-gray-400 group-hover:text-gray-600'
                        )}
                        aria-hidden="true"
                      />
                      {badgeCount > 0 && isCollapsed && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                          {badgeCount > 9 ? '9+' : badgeCount}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {badgeCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="h-5 min-w-[20px] px-1.5 text-[10px] font-medium"
                          >
                            {badgeCount}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                );

                return (
                  <li key={item.name}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8} className="flex items-center gap-2">
                          {item.name}
                          {badgeCount > 0 && (
                            <Badge variant="destructive" className="h-4 px-1 text-[10px]">
                              {badgeCount}
                            </Badge>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      linkContent
                    )}
                  </li>
                );
              })}

              {/* Bottom Section */}
              <li className="mt-auto pt-4 border-t border-gray-100 space-y-1">
                {/* User Dropdown */}
                {user && (
                  <div className={cn(isCollapsed && 'flex justify-center')}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-md"
                              >
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100">
                                  <User className="h-4 w-4 text-cyan-700" />
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
                        <TooltipContent side="right" sideOffset={8}>
                          {user.name || user.email}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-x-3 px-2"
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100 shrink-0">
                              <User className="h-4 w-4 text-cyan-700" />
                            </div>
                            <div className="flex flex-col items-start overflow-hidden">
                              <span className="text-sm font-medium truncate max-w-full">
                                {user.name || 'Admin'}
                              </span>
                              <span className="text-[11px] text-gray-500 truncate max-w-full">
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
                        className="group flex justify-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        <ExternalLink
                          className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600"
                          aria-hidden="true"
                        />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      View Site
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-x-3 rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <ExternalLink
                      className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600"
                      aria-hidden="true"
                    />
                    View Site
                  </a>
                )}

                {/* Collapse Toggle */}
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleCollapsed}
                        className="w-full justify-center px-2 py-2 text-gray-500 hover:text-gray-900"
                      >
                        <PanelLeft className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      Expand sidebar
                      <kbd className="ml-2 text-[10px] bg-gray-100 px-1 rounded">[</kbd>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleCollapsed}
                    className="w-full justify-start gap-x-3 px-2 text-gray-500 hover:text-gray-900"
                    title="Collapse sidebar"
                  >
                    <PanelLeftClose className="h-5 w-5" />
                    <span className="text-sm">Collapse</span>
                    <kbd className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      [
                    </kbd>
                  </Button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </TooltipProvider>
  );
}
