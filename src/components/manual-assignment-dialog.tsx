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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Job, Staff } from '@/lib/types';
import { getStaff, updateJob } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type ManualAssignmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onJobUpdated: () => void;
};

export function ManualAssignmentDialog({ open, onOpenChange, job, onJobUpdated }: ManualAssignmentDialogProps) {
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadStaff();
      if (job) {
        setSelectedStaff(job.cleanerIds || []);
        setSelectedDate(job.date ? new Date(job.date) : undefined);
        setSelectedTime(job.time || '');
      }
    }
  }, [open, job]);

  const loadStaff = async () => {
    try {
      const staffData = await getStaff();
      setStaff(staffData);
    } catch (error) {
      console.error('Error loading staff:', error);
      toast({ title: "Error", description: "Failed to load staff.", variant: "destructive" });
    }
  };

  const handleStaffToggle = (staffId: string, checked: boolean) => {
    if (checked) {
      setSelectedStaff(prev => [...prev, staffId]);
    } else {
      setSelectedStaff(prev => prev.filter(id => id !== staffId));
    }
  };

  const handleAssign = async () => {
    if (!job || !selectedDate || !selectedTime || selectedStaff.length === 0) {
      toast({ title: "Missing Information", description: "Please select date, time, and at least one staff member.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await updateJob(job.id, {
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        cleanerIds: selectedStaff,
        status: 'Scheduled'
      });
      
      toast({ 
        title: "Job Scheduled", 
        description: `${job.clientName}'s job has been scheduled for ${format(selectedDate, 'MMM dd, yyyy')} at ${selectedTime}.` 
      });
      
      onJobUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error scheduling job:', error);
      toast({ 
        title: "Error", 
        description: "Failed to schedule job. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 18; hour++) {
      for (let minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
        slots.push({ value: timeString, label: displayTime });
      }
    }
    return slots;
  };

  const isValid = selectedDate && selectedTime && selectedStaff.length > 0;

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <DialogTitle>Manual Job Assignment</DialogTitle>
          </div>
          <DialogDescription>
            Schedule and assign staff for {job.clientName}'s job
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Job Summary */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="font-medium">{job.clientName}</div>
            <div className="text-sm text-muted-foreground">{job.description}</div>
            <div className="text-sm text-muted-foreground">{job.address}</div>
          </div>

          {/* Date Selection */}
          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="grid gap-2">
            <Label className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Time</span>
            </Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeSlots().map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Staff Selection */}
          <div className="grid gap-2">
            <Label className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Assign Staff</span>
            </Label>
            <div className="space-y-3 max-h-40 overflow-y-auto border rounded-lg p-3">
              {staff.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={member.id}
                    checked={selectedStaff.includes(member.id!)}
                    onCheckedChange={(checked) => handleStaffToggle(member.id!, checked as boolean)}
                  />
                  <div className="flex-1">
                    <label htmlFor={member.id} className="cursor-pointer">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.position}</div>
                    </label>
                  </div>
                </div>
              ))}
              {staff.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No staff members available
                </div>
              )}
            </div>
            {selectedStaff.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedStaff.length} staff member{selectedStaff.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={loading || !isValid}>
            {loading ? 'Scheduling...' : 'Schedule Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
