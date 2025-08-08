import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Kpi } from '@/lib/types';

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const isIncrease = kpi.changeType === 'increase';
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
        <kpi.icon className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold font-headline">{kpi.value}</div>
        <p
          className={cn(
            'text-xs text-muted-foreground mt-1',
            isIncrease ? 'text-green-600' : 'text-red-600'
          )}
        >
          {kpi.change} from last month
        </p>
      </CardContent>
    </Card>
  );
}
