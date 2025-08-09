'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Loader2 } from 'lucide-react';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ['/signin'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-muted-foreground">Loading CleanSweepHQ...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Redirecting to sign in...</p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-600" />
        </div>
      </div>
    );
  }

  // If user is authenticated and on public route, redirect will be handled by the signin page
  if (user && isPublicRoute) {
    return <>{children}</>;
  }

  // If on public route (signin page)
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // If authenticated user accessing protected routes
  if (user) {
    // Customer users get a different layout/interface
    if (user.role === 'customer') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
          <div className="max-w-md mx-auto">
            {children}
          </div>
        </div>
      );
    }

    // Admin and staff get the full sidebar interface
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Fallback
  return <>{children}</>;
}
