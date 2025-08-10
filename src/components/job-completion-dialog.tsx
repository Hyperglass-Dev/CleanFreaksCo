'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { Job } from '@/lib/types';
import { completeJob } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, DollarSign, Calendar, Clock, MapPin, Users } from 'lucide-react';

type JobCompletionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onJobCompleted: () => void;
};

export function JobCompletionDialog({ open, onOpenChange, job, onJobCompleted }: JobCompletionDialogProps) {
  const [priceCharged, setPriceCharged] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Set initial price from job's quoted price when dialog opens
  useEffect(() => {
    if (job && open) {
      setPriceCharged(job.quotedPrice || job.estimatedValue || 0);
      setNotes('');
    }
  }, [job, open]);

  const handleComplete = async () => {
    if (!job || !job.id || priceCharged <= 0) return;

    setLoading(true);
    try {
      await completeJob(job.id, priceCharged, notes || undefined);
      toast({ 
        title: "Job Completed", 
        description: `${job.clientName}'s job has been completed and added to the job register.` 
      });
      onJobCompleted();
      onOpenChange(false);
      
      // Reset form
      setPriceCharged(0);
      setNotes('');
    } catch (error) {
      console.error('Error completing job:', error);
      toast({ 
        title: "Error", 
        description: "Failed to complete job. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isValid = priceCharged > 0;

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <DialogTitle>Complete Job</DialogTitle>
          </div>
          <DialogDescription>
            Mark this job as completed and record the revenue.
          </DialogDescription>
        </DialogHeader>
        
        {/* Job Details Summary */}
        <div className="space-y-4 py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="font-semibold text-lg">{job.clientName}</div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(job.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTime(job.time)}</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-sm">{job.address}</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {job.description}
            </div>
            
            {job.cleanerIds && job.cleanerIds.length > 0 && (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Staff: {job.cleanerIds.join(', ')}</span>
              </div>
            )}
            
            <Badge variant={
              job.status === 'Completed' ? 'default' :
              job.status === 'In Progress' ? 'secondary' :
              job.status === 'Scheduled' ? 'outline' : 'secondary'
            }>
              {job.status}
            </Badge>
          </div>

          {/* Pricing Input */}
          <div className="grid gap-2">
            <Label htmlFor="priceCharged" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Amount Charged (AUD)</span>
            </Label>
            
            {/* Show pricing context if available */}
            {(job.quotedPrice || job.estimatedValue) && (
              <div className="flex gap-2 text-xs text-muted-foreground mb-2">
                {job.quotedPrice && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    Quoted: ${job.quotedPrice.toFixed(2)}
                  </span>
                )}
                {job.estimatedValue && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Estimated: ${job.estimatedValue.toFixed(2)}
                  </span>
                )}
              </div>
            )}
            
            <Input 
              id="priceCharged" 
              type="number" 
              step="0.01"
              min="0"
              value={priceCharged || ''} 
              onChange={(e) => setPriceCharged(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Final amount charged to the customer
            </p>
          </div>

          {/* Notes Input */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Completion Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about the completed job..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={loading || !isValid}>
            {loading ? 'Completing...' : 'Complete Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
