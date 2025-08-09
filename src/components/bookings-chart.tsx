import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getBookingsData } from '@/lib/data';
import { BookingsChartClient } from './bookings-chart-client';

export async function BookingsChart() {
  const bookingsData = await getBookingsData();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Bookings by Service</CardTitle>
        <CardDescription>Breakdown of all bookings by service type.</CardDescription>
      </CardHeader>
      <CardContent>
        <BookingsChartClient data={bookingsData} />
      </CardContent>
    </Card>
  );
}
