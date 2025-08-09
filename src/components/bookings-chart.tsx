'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getBookingsData } from '@/lib/data';
import { BookingsChartClient } from './bookings-chart-client';
import { useEffect, useState } from 'react';
import { BookingData } from '@/lib/types';

export function BookingsChart() {
  const [bookingsData, setBookingsData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getBookingsData();
        setBookingsData(data);
      } catch (error) {
        console.error('Error loading bookings data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Bookings by Service</CardTitle>
        <CardDescription>Breakdown of all bookings by service type.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 bg-gray-100 animate-pulse rounded" />
        ) : (
          <BookingsChartClient data={bookingsData} />
        )}
      </CardContent>
    </Card>
  );
}
