'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Clock, MapPin } from 'lucide-react';
import { getJobs } from '@/lib/data';
import { SmartAllocationDialog } from '@/components/smart-allocation-dialog';
import { SchedulingCalendar } from '@/components/scheduling-calendar';
import { JobDialog } from '@/components/job-dialog';
import type { Job } from '@/lib/types';

export default function SchedulingPage() {
  const [selectedJobDescription, setSelectedJobDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const unscheduledJobs = jobs.filter(job => job.status === 'Unscheduled');

  const handleSmartAllocateClick = (description: string) => {
    setSelectedJobDescription(description);
    setIsDialogOpen(true);
  };

  return (
    <>
      <PageHeader title="Scheduling">
        <JobDialog onJobCreated={loadJobs} />
      </PageHeader>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Unscheduled Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg bg-card animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded mb-2 w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : unscheduledJobs.length > 0 ? (
                  unscheduledJobs.map(job => (
                    <div key={job.id} className="p-4 border rounded-lg bg-card">
                      <h4 className="font-semibold">{job.clientName}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {job.address}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => handleSmartAllocateClick(job.description)}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Smart Allocate
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center text-muted-foreground py-8">No unscheduled jobs.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <SchedulingCalendar />
        </div>
      </div>
      <SmartAllocationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        jobDescription={selectedJobDescription}
      />
    </>
  );
}
