'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getRevenueData } from '@/lib/data';
import { RevenueChartClient } from './revenue-chart-client';
import { useEffect, useState } from 'react';
import { RevenueData } from '@/lib/types';

export function RevenueChart() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getRevenueData();
        setRevenueData(data);
      } catch (error) {
        console.error('Error loading revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue for the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 bg-gray-100 animate-pulse rounded" />
        ) : (
          <RevenueChartClient data={revenueData} />
        )}
      </CardContent>
    </Card>
  );
}
