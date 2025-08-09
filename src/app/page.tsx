'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { KpiCard } from '@/components/kpi-card';
import { calculateKpis } from '@/lib/data';
import { RevenueChart } from '@/components/revenue-chart';
import { BookingsChart } from '@/components/bookings-chart';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AstraDashboardWidget } from '@/components/astra-dashboard-widget';
import { NotificationsCard } from '@/components/notifications-card';
import { BusinessInsightsCard } from '@/components/business-insights-card';
import { Kpi } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'customer') {
      router.push('/customer');
      return;
    }

    // Load KPIs for admin/staff users
    const loadKpis = async () => {
      try {
        const data = await calculateKpis();
        setKpis(data);
      } catch (error) {
        console.error('Error loading KPIs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && (user.role === 'admin' || user.role === 'staff')) {
      loadKpis();
    }
  }, [user, router]);

  if (loading) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const userName = user?.name?.split(' ')[0] || 'there';
  const isMainAdmin = user?.email === 'dijanatodorovic88@gmail.com';

  return (
    <ProtectedRoute allowedRoles={['admin', 'staff']}>
      <PageHeader 
        title={isMainAdmin ? `Welcome back, ${userName}! ✨` : 'Dashboard'} 
      />
      
      {/* Personalized top section for Dijana */}
      {isMainAdmin && (
        <div className="grid gap-6 mb-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AstraDashboardWidget />
          </div>
          <div className="lg:col-span-1">
            <BusinessInsightsCard />
          </div>
          <div className="lg:col-span-1">
            <NotificationsCard />
          </div>
        </div>
      )}

      {/* Standard KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} kpi={kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart />
        <BookingsChart />
      </div>

      {/* For non-main admins, show simplified version */}
      {!isMainAdmin && (
        <div className="grid gap-6 mt-8 lg:grid-cols-2">
          <NotificationsCard />
          <BusinessInsightsCard />
        </div>
      )}
    </ProtectedRoute>
  );
}
