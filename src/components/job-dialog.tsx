'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addJob, getClients, getStaff } from '@/lib/data';
import { Plus, DollarSign, Users, Sparkles, UserPlus } from 'lucide-react';
import type { Client, Staff } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AddressAutocomplete } from '@/components/address-autocomplete';

interface JobDialogProps {
  children?: React.ReactNode;
  onJobCreated?: () => void;
}

export function JobDialog({ children, onJobCreated }: JobDialogProps) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [assignmentMethod, setAssignmentMethod] = useState<'manual' | 'smart'>('manual');
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    address: '',
    time: '',
    date: '',
    description: '',
    status: 'Unscheduled' as const,
    estimatedValue: 0,
    quotedPrice: 0,
    estimatedDuration: 120, // Default 2 hours
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      loadClients();
      loadStaff();
    }
  }, [open]);

  const loadClients = async () => {
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const loadStaff = async () => {
    try {
      const staffData = await getStaff();
      setStaff(staffData);
    } catch (error) {
      console.error('Failed to load staff:', error);
    }
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setFormData(prev => ({
        ...prev,
        clientId: client.id,
        clientName: client.name,
        address: client.address || ''
      }));
    }
  };

  const handleStaffToggle = (staffId: string) => {
    setSelectedStaff(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const jobData = {
        clientName: formData.clientName,
        address: formData.address,
        time: formData.time,
        date: formData.date,
        description: formData.description,
        status: (formData.date && formData.time) ? 'Scheduled' : 'Unscheduled',
        cleanerIds: assignmentMethod === 'manual' ? selectedStaff : undefined,
        estimatedValue: formData.estimatedValue || undefined,
        quotedPrice: formData.quotedPrice || undefined,
        estimatedDuration: formData.estimatedDuration,
      };
      await addJob(jobData);
      
      setFormData({
        clientId: '',
        clientName: '',
        address: '',
        time: '',
        date: '',
        description: '',
        status: 'Unscheduled',
        estimatedValue: 0,
        quotedPrice: 0,
        estimatedDuration: 120,
      });
      setSelectedClient(null);
      setSelectedStaff([]);
      setAssignmentMethod('manual');
      setOpen(false);
      
      // Refresh the jobs list
      if (onJobCreated) {
        onJobCreated();
      }
    } catch (error) {
      console.error('Failed to create job:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Job
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="client">Select Client</Label>
            <Select value={formData.clientId} onValueChange={handleClientSelect} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a client..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} - {client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {clients.length === 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                No clients found. <a href="/clients" className="text-primary hover:underline">Add clients first</a>
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <AddressAutocomplete
              id="address"
              value={formData.address}
              onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
              placeholder="Start typing an address..."
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Address will be auto-verified using Google Places
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the cleaning job..."
              required
            />
          </div>

          {/* Duration Estimation */}
          <div>
            <Label htmlFor="estimatedDuration">Estimated Duration</Label>
            <Select 
              value={formData.estimatedDuration.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes - Quick touch-up</SelectItem>
                <SelectItem value="60">1 hour - Basic clean</SelectItem>
                <SelectItem value="90">1.5 hours - Standard clean</SelectItem>
                <SelectItem value="120">2 hours - Thorough clean</SelectItem>
                <SelectItem value="180">3 hours - Deep clean</SelectItem>
                <SelectItem value="240">4 hours - Full service</SelectItem>
                <SelectItem value="300">5 hours - Extensive clean</SelectItem>
                <SelectItem value="360">6 hours - Complete overhaul</SelectItem>
                <SelectItem value="480">8 hours - Full day service</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Duration helps with scheduling and allows for travel time between jobs
            </p>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-medium">Job Pricing</Label>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div>
                <Label htmlFor="quotedPrice">Quoted Price (AUD)</Label>
                <Input
                  id="quotedPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.quotedPrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, quotedPrice: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Price agreed with client
                </p>
              </div>
              <div>
                <Label htmlFor="estimatedValue">Estimated Value (AUD)</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.estimatedValue || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedValue: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Internal cost estimate
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Staff Assignment Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-medium">Staff Assignment</Label>
            </div>
            
            <div className="flex gap-2 pl-6">
              <Button
                type="button"
                variant={assignmentMethod === 'manual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAssignmentMethod('manual')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Manual Assignment
              </Button>
              <Button
                type="button"
                variant={assignmentMethod === 'smart' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAssignmentMethod('smart')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Smart Allocation
              </Button>
            </div>

            {assignmentMethod === 'manual' && (
              <div className="pl-6 space-y-3">
                <Label className="text-sm font-medium">Select Staff Members</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-3 bg-muted/50">
                  {staff.length === 0 ? (
                    <p className="text-sm text-muted-foreground col-span-2">
                      No staff members available. <a href="/staff" className="text-primary hover:underline">Add staff first</a>
                    </p>
                  ) : (
                    staff.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`staff-${member.id}`}
                          checked={selectedStaff.includes(member.id!)}
                          onCheckedChange={() => handleStaffToggle(member.id!)}
                        />
                        <Label 
                          htmlFor={`staff-${member.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {member.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
                {selectedStaff.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedStaff.length} staff member{selectedStaff.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            {assignmentMethod === 'smart' && (
              <div className="pl-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">Smart Allocation Enabled</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Staff will be automatically assigned based on skills, location, and availability using AI.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unscheduled">Unscheduled</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create Job'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
