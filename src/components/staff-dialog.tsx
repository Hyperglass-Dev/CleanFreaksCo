
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
import type { Staff, StaffPosition } from '@/lib/types';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

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
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  useEffect(() => {
    if (staff) {
      setFormData(staff);
      setAvatarPreview(staff.avatar);
    } else {
      setFormData({ 
        name: '', 
        email: '',
        position: 'Staff',
        skills: [], 
        location: '', 
        availability: '', 
        avatar: 'https://ui-avatars.io/api/?name=User&background=E6E6FA&color=800000&size=150' 
      });
      setAvatarPreview('https://ui-avatars.io/api/?name=User&background=E6E6FA&color=800000&size=150');
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

  const handleSave = async () => {
    setLoading(true);
    try {
      // For new staff members, create Firebase account
      if (!staff && formData.email) {
        const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'; // Generate temporary password
        try {
          const userRole = formData.position === 'Owner/Manager' ? 'admin' : 'staff';
          await signUp(formData.email, tempPassword, formData.name || '', userRole);
        } catch (error) {
          console.error('Error creating Firebase user:', error);
          // Continue with staff creation even if Firebase user creation fails
        }
      }
      
      onSave(formData as Staff);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving staff:', error);
    } finally {
      setLoading(false);
    }
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
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email || ''} onChange={handleInputChange} placeholder="john@example.com" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Select value={formData.position || 'Staff'} onValueChange={(value: StaffPosition) => setFormData(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner/Manager">Owner/Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Contractor">Contractor</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" type="tel" value={formData.phone || ''} onChange={handleInputChange} placeholder="+61 400 000 000" />
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
