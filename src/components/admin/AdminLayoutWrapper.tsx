'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const SIDEBAR_COLLAPSED_KEY = 'admin-sidebar-collapsed';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: true, // Default collapsed (rail mode)
  setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default collapsed
  const [isHydrated, setIsHydrated] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
    setIsHydrated(true);

    // Listen for storage changes (in case sidebar updates it)
    const handleStorage = () => {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
    };

    window.addEventListener('storage', handleStorage);

    // Also listen for custom event for same-tab updates
    const handleSidebarChange = (e: CustomEvent) => {
      setIsCollapsed(e.detail.isCollapsed);
    };
    window.addEventListener('sidebar-collapsed-change' as any, handleSidebarChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('sidebar-collapsed-change' as any, handleSidebarChange);
    };
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div
        className={cn(
          'transition-all duration-200 ease-out',
          isHydrated
            ? isCollapsed ? 'lg:pl-14' : 'lg:pl-64'
            : 'lg:pl-14' // Default to collapsed during SSR
        )}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}
