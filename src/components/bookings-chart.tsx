'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getStaffProductivityData } from '@/lib/data';
import { StaffProductivityChartClient } from './staff-productivity-chart-client';
import { useEffect, useState } from 'react';

interface StaffProductivityData {
  staff: string;
  completed: number;
  fill: string;
}

export function StaffProductivityChart() {
  const [productivityData, setProductivityData] = useState<StaffProductivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getStaffProductivityData();
        setProductivityData(data);
      } catch (error) {
        console.error('Error loading staff productivity data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Staff Productivity</CardTitle>
        <CardDescription>Jobs completed by each staff member this month.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 bg-gray-100 animate-pulse rounded" />
        ) : (
          <StaffProductivityChartClient data={productivityData} />
        )}
      </CardContent>
    </Card>
  );
}
