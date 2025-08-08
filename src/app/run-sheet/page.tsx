import { PageHeader } from '@/components/page-header';
import { JobCard } from '@/components/job-card';
import { jobs } from '@/lib/data';
import Image from 'next/image';

export default function RunSheetPage() {
  const todaysJobs = jobs.filter(job => job.status !== 'Unscheduled' && job.status !== 'Completed');

  return (
    <>
      <PageHeader title="Today's Run Sheet" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          {todaysJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <div className="hidden md:block">
            <div className="sticky top-24">
                <Card className="overflow-hidden shadow-lg">
                    <CardHeader>
                        <CardTitle>Optimized Route</CardTitle>
                        <CardDescription>Route for today's jobs.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Image
                        src="https://placehold.co/800x600.png"
                        alt="Map of job locations"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-lg"
                        data-ai-hint="route map"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
