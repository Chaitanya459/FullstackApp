import React from 'react';
import { Separator } from '@radix-ui/react-separator';
import AppContent from './app-content';
import { AppSidebar } from './app-sidebar';
import { useAbility } from '@/contexts/AbilityContext';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar-provider';
import { ModeToggle } from '@/components/mode-toggle';
import DynamicBreadcrumb from '@/components/dynamic-breadcrumb';
import PWABadge from '@/components/PWABadge';

const Layout: React.FC = () => {
  const ability = useAbility();

  return <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <ModeToggle className="size-6 rounded-md border border-border bg-background p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DynamicBreadcrumb />
        </div>
      </header>
      <main>
        <AppContent ability={ability} />
        <PWABadge />
      </main>
    </SidebarInset>
  </SidebarProvider>;
};

export default Layout;
