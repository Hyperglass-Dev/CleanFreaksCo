import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getRevenueData } from '@/lib/data';
import { RevenueChartClient } from './revenue-chart-client';

export async function RevenueChart() {
  const revenueData = await getRevenueData();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue for the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <RevenueChartClient data={revenueData} />
      </CardContent>
    </Card>
  );
}
