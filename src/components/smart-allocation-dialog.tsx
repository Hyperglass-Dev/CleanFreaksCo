'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getSmartAllocation } from '@/lib/actions';
import type { SmartJobAllocationOutput } from '@/ai/flows/smart-job-allocation';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2, Sparkles, User, AlertTriangle } from 'lucide-react';
import { cleaners } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from './ui/badge';

type SmartAllocationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobDescription: string;
};

export function SmartAllocationDialog({ open, onOpenChange, jobDescription: initialJobDescription }: SmartAllocationDialogProps) {
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [result, setResult] = useState<SmartJobAllocationOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = () => {
    startTransition(async () => {
      setResult(null);
      const response = await getSmartAllocation(jobDescription);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error,
        });
      }
    });
  };

  const recommendedCleaner = result ? cleaners.find(c => c.id === result.optimalCleaner) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Bot className="w-6 h-6" />
            Smart Allocation
          </DialogTitle>
          <DialogDescription>
            Let AI find the best cleaner for the job based on skills, location, and availability.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g., Deep clean for a 2-bedroom apartment..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between gap-2">
          {result && recommendedCleaner && (
             <div className="p-4 rounded-lg border bg-secondary/50 flex-1 text-left animate-in fade-in-50">
                <h4 className="font-semibold mb-3 text-secondary-foreground">Recommendation</h4>
                <div className='flex items-center gap-4 mb-3'>
                    <Avatar>
                        <AvatarImage src={recommendedCleaner.avatar} />
                        <AvatarFallback><User/></AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-secondary-foreground">{recommendedCleaner.name}</p>
                        <div className="flex gap-1 mt-1">
                            {recommendedCleaner.skills.map(skill => <Badge variant="secondary" key={skill}>{skill}</Badge>)}
                        </div>
                    </div>
                </div>
                
                <div className="text-sm space-y-2">
                    <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <p><span className="font-medium text-secondary-foreground">Reasoning:</span> {result.reasoning}</p>
                    </div>
                    {result.potentialConflicts && (
                         <div className="flex items-start gap-2 text-amber-700">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p><span className="font-medium">Potential Conflicts:</span> {result.potentialConflicts}</p>
                        </div>
                    )}
                </div>
             </div>
          )}

          <Button onClick={handleSubmit} disabled={isPending} className="self-end mt-4 sm:mt-0">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Allocating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Find Best Cleaner
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
