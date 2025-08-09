import { PageHeader } from '@/components/page-header';
import { KpiCard } from '@/components/kpi-card';
import { calculateKpis } from '@/lib/data';
import { RevenueChart } from '@/components/revenue-chart';
import { BookingsChart } from '@/components/bookings-chart';

export default async function DashboardPage() {
  const kpis = await calculateKpis();

  return (
    <>
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
    </>
  );
}
