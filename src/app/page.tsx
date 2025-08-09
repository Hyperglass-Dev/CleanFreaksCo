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

  return (
    <ProtectedRoute allowedRoles={['admin', 'staff']}>
      <PageHeader title="Dashboard" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} kpi={kpi} />
        ))}
      </div>
      <div className="grid gap-6 mt-8 md:grid-cols-2">
        <RevenueChart />
        <BookingsChart />
      </div>
    </ProtectedRoute>
  );
}
