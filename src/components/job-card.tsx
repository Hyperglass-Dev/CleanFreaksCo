import type { Job } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, CheckCircle, PlayCircle, Route } from 'lucide-react';
import { cn } from '@/lib/utils';

export function JobCard({ job }: { job: Job }) {
  const statusColors = {
    Scheduled: 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="font-headline">{job.clientName}</CardTitle>
            <Badge className={cn(statusColors[job.status as keyof typeof statusColors], "py-1 px-3 text-xs")}>{job.status}</Badge>
        </div>
        <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.address}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.time}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{job.description}</p>
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        <Button variant="outline" size="sm"><Route className="mr-2"/> On My Way</Button>
        <Button variant="outline" size="sm"><PlayCircle className="mr-2"/> Start Job</Button>
        <Button variant="outline" size="sm"><CheckCircle className="mr-2"/> Mark Complete</Button>
      </CardFooter>
    </Card>
  );
}
