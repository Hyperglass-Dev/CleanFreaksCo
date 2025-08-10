

'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { JobCard } from '@/components/job-card';
import { getJobs } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RouteMap } from '@/components/route-map';
import type { Job } from '@/lib/types';

export default function RunSheetPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const jobsData = await getJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const todaysJobs = jobs.filter(job => {
    const today = new Date().toDateString();
    const jobDate = new Date(job.date).toDateString();
    return jobDate === today && job.status !== 'Unscheduled' && job.status !== 'Completed';
  });

  return (
    <>
      <PageHeader title="Today's Run Sheet" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : todaysJobs.length > 0 ? (
            todaysJobs.map(job => (
              <JobCard key={job.id} job={job} onJobUpdated={loadJobs} />
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No jobs scheduled for today</p>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="md:sticky md:top-24 h-fit">
          <RouteMap jobs={todaysJobs} loading={loading} />
        </div>
      </div>
    </>
  );
}
