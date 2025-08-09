
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
import type { Client } from '@/lib/types';

type ClientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSave: (client: Client) => void;
};

export function ClientDialog({ open, onOpenChange, client, onSave }: ClientDialogProps) {
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (client) {
      setFormData(client);
      setLogoPreview(client.avatar);
    } else {
      setFormData({ name: '', email: '', phone: '', avatar: 'https://placehold.co/150x150.png' });
      setLogoPreview('https://placehold.co/150x150.png');
    }
  }, [client, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData as Client);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {client ? 'Update the details for this client.' : 'Enter the details for the new client.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="flex flex-col items-center gap-4">
                 <div className="relative w-24 h-24">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={logoPreview || undefined} alt={formData.name} />
                        <AvatarFallback>{formData.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                     <Button asChild size="icon" className="absolute bottom-0 right-0 rounded-full w-8 h-8">
                         <label htmlFor="logo-upload" className="cursor-pointer">
                            <Upload className="w-4 h-4"/>
                            <span className="sr-only">Upload logo</span>
                         </label>
                     </Button>
                     <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name || ''} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email || ''} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone || ''} onChange={handleInputChange} />
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Client</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
