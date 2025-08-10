'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StaffProductivityData {
  staff: string;
  completed: number;
  fill: string;
}

interface StaffProductivityChartClientProps {
  data: StaffProductivityData[];
}

export function StaffProductivityChartClient({ data }: StaffProductivityChartClientProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="staff"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background p-2 border rounded-lg shadow-md">
                    <p className="font-medium">{payload[0].payload.staff}</p>
                    <p className="text-sm text-muted-foreground">
                      {payload[0].value} jobs completed
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="completed"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
