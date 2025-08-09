
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';
import type { Staff } from '@/lib/types';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

type StaffDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
  onSave: (staff: Staff) => void;
};

export function StaffDialog({ open, onOpenChange, staff, onSave }: StaffDialogProps) {
  const [formData, setFormData] = useState<Partial<Staff>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (staff) {
      setFormData(staff);
      setAvatarPreview(staff.avatar);
    } else {
      setFormData({ name: '', skills: [], location: '', availability: '', avatar: 'https://placehold.co/150x150.png' });
      setAvatarPreview('https://placehold.co/150x150.png');
    }
  }, [staff, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (skillInput && !formData.skills?.includes(skillInput)) {
      setFormData(prev => ({...prev, skills: [...(prev.skills || []), skillInput]}));
      setSkillInput('');
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills?.filter(skill => skill !== skillToRemove)}));
  }

  const handleSave = () => {
    onSave(formData as Staff);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{staff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          <DialogDescription>
            {staff ? 'Update the details for this staff member.' : 'Enter the details for the new staff member.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="flex flex-col items-center gap-4">
                 <div className="relative w-24 h-24">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={avatarPreview || undefined} alt={formData.name} />
                        <AvatarFallback>{formData.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <Button asChild size="icon" className="absolute bottom-0 right-0 rounded-full w-8 h-8">
                         <label htmlFor="avatar-upload" className="cursor-pointer">
                            <Upload className="w-4 h-4"/>
                            <span className="sr-only">Upload avatar</span>
                         </label>
                     </Button>
                     <Input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name || ''} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.location || ''} onChange={handleInputChange} placeholder="e.g. Sydney CBD, North Shore" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="skills">Skills</Label>
                <div className="flex gap-2">
                  <Input id="skills" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()} placeholder="e.g. Deep Cleaning" />
                  <Button type="button" variant="outline" onClick={handleAddSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills?.map(skill => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                      <button type="button" className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2" onClick={() => handleRemoveSkill(skill)}>
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {skill}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="availability">Availability</Label>
                <Textarea id="availability" value={formData.availability || ''} onChange={handleInputChange} placeholder="e.g. Mon-Fri 9am-5pm" />
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
