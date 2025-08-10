
'use client';

import { useState } from 'react';
import type { Job } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, CheckCircle, PlayCircle, Route, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobCompletionDialog } from '@/components/job-completion-dialog';
import { ManualAssignmentDialog } from '@/components/manual-assignment-dialog';
import { updateJob, deleteJob } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface JobCardProps {
  job: Job;
  onJobUpdated?: () => void;
  showDeleteButton?: boolean;
}

export function JobCard({ job, onJobUpdated, showDeleteButton = false }: JobCardProps) {
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const statusColors = {
    Scheduled: 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
  };

  const handleStartJob = async () => {
    if (!job.id) return;
    try {
      await updateJob(job.id, { status: 'In Progress' });
      toast({ title: "Job Started", description: `Started ${job.clientName}'s job.` });
      onJobUpdated?.();
    } catch (error) {
      console.error('Error starting job:', error);
      toast({ title: "Error", description: "Failed to start job.", variant: "destructive" });
    }
  };

  const handleCompleteJob = () => {
    setIsCompletionDialogOpen(true);
  };

  const handleJobCompleted = () => {
    onJobUpdated?.();
  };

  const handleEditJob = () => {
    setIsEditDialogOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!job.id) return;
    
    if (confirm(`Are you sure you want to delete ${job.clientName}'s job? This action cannot be undone.`)) {
      try {
        await deleteJob(job.id);
        toast({ title: "Job Deleted", description: `${job.clientName}'s job has been deleted.` });
        onJobUpdated?.();
      } catch (error) {
        console.error('Error deleting job:', error);
        toast({ title: "Error", description: "Failed to delete job.", variant: "destructive" });
      }
    }
  };

  return (
    <>
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
          <Button variant="outline" size="sm" disabled>
            <Route className="mr-2"/> On My Way
          </Button>
          
          {(job.status === 'Scheduled' || job.status === 'In Progress') && (
            <Button variant="outline" size="sm" onClick={handleEditJob}>
              <Edit className="mr-2"/> Edit Schedule
            </Button>
          )}
          
          {job.status === 'Scheduled' && (
            <Button variant="outline" size="sm" onClick={handleStartJob}>
              <PlayCircle className="mr-2"/> Start Job
            </Button>
          )}
          
          {(job.status === 'In Progress' || job.status === 'Scheduled') && (
            <Button variant="outline" size="sm" onClick={handleCompleteJob}>
              <CheckCircle className="mr-2"/> Mark Complete
            </Button>
          )}
          
          {job.status === 'Completed' && (
            <Badge variant="secondary" className="text-green-700">
              <CheckCircle className="mr-1 h-3 w-3"/> Completed
            </Badge>
          )}
          
          {showDeleteButton && (
            <Button variant="outline" size="sm" onClick={handleDeleteJob} className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4"/> Delete
            </Button>
          )}
        </CardFooter>
      </Card>

      <JobCompletionDialog
        open={isCompletionDialogOpen}
        onOpenChange={setIsCompletionDialogOpen}
        job={job}
        onJobCompleted={handleJobCompleted}
      />

      <ManualAssignmentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        job={job}
        onJobUpdated={onJobUpdated || (() => {})}
      />
    </>
  );
}
