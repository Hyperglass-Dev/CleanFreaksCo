'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Clock, MapPin } from 'lucide-react';
import { jobs } from '@/lib/data';
import { SmartAllocationDialog } from '@/components/smart-allocation-dialog';
import { SchedulingCalendar } from '@/components/scheduling-calendar';

export default function SchedulingPage() {
  const [selectedJobDescription, setSelectedJobDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const unscheduledJobs = jobs.filter(job => job.status === 'Unscheduled');

  const handleSmartAllocateClick = (description: string) => {
    setSelectedJobDescription(description);
    setIsDialogOpen(true);
  };

  return (
    <>
      <PageHeader title="Scheduling" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Unscheduled Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unscheduledJobs.length > 0 ? (
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
