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
import { Camera, Upload, Image, X } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import type { Consumable, PurchaseType } from '@/lib/types';

type ConsumableDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consumable: Consumable | null;
  onSave: (consumable: Consumable) => void;
};

export function ConsumableDialog({ open, onOpenChange, consumable, onSave }: ConsumableDialogProps) {
  const [formData, setFormData] = useState<Partial<Consumable>>({});
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (consumable) {
      setFormData(consumable);
      setPhotoPreview(consumable.receiptPhotoUrl || null);
    } else {
      setFormData({ 
        name: '', 
        type: 'Consumable',
        purchasedFrom: '',
        purchaseAmount: 0,
        datePurchased: new Date().toISOString().split('T')[0]
      });
      setPhotoPreview(null);
    }
    setPhotoFile(null);
  }, [consumable, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [id]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleTypeChange = (value: PurchaseType) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>, source: 'file' | 'camera') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormData(prev => ({ 
      ...prev, 
      receiptPhotoUrl: undefined,
      receiptPhotoName: undefined
    }));
  };

  const uploadPhoto = async (): Promise<{ url: string; fileName: string } | null> => {
    if (!photoFile) return null;
    
    setUploadingPhoto(true);
    try {
      const timestamp = Date.now();
      const fileName = `receipts/${timestamp}_${photoFile.name}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, photoFile);
      const url = await getDownloadURL(storageRef);
      
      return { url, fileName };
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.purchasedFrom || !formData.datePurchased || formData.purchaseAmount === undefined) {
      return;
    }

    setLoading(true);
    try {
      let finalFormData = { ...formData };
      
      // Upload photo if there's a new one
      if (photoFile) {
        const photoResult = await uploadPhoto();
        if (photoResult) {
          finalFormData.receiptPhotoUrl = photoResult.url;
          finalFormData.receiptPhotoName = photoResult.fileName;
        }
      }
      
      onSave(finalFormData as Consumable);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving consumable:', error);
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.name && formData.purchasedFrom && formData.datePurchased && formData.purchaseAmount !== undefined && formData.purchaseAmount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{consumable ? 'Edit Purchase' : 'Add New Purchase'}</DialogTitle>
          <DialogDescription>
            {consumable ? 'Update the details for this purchase.' : 'Record a new consumable purchase.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input 
              id="name" 
              value={formData.name || ''} 
              onChange={handleInputChange}
              placeholder="e.g. Surface Cleaner, Vacuum Cleaner, Office Chair"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Purchase Type</Label>
            <Select value={formData.type || 'Consumable'} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consumable">Consumable</SelectItem>
                <SelectItem value="Plant & Equipment">Plant & Equipment</SelectItem>
                <SelectItem value="Office Equipment">Office Equipment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="purchasedFrom">Purchased From</Label>
            <Input 
              id="purchasedFrom" 
              value={formData.purchasedFrom || ''} 
              onChange={handleInputChange}
              placeholder="e.g. Bunnings, Coles, Supplier Name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="purchaseAmount">Purchase Amount (AUD)</Label>
            <Input 
              id="purchaseAmount" 
              type="number" 
              step="0.01"
              min="0"
              value={formData.purchaseAmount || ''} 
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="datePurchased">Date Purchased</Label>
            <Input 
              id="datePurchased" 
              type="date"
              value={formData.datePurchased || ''} 
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label>Receipt Photo (Optional)</Label>
            {photoPreview ? (
              <div className="relative">
                <img 
                  src={photoPreview} 
                  alt="Receipt preview" 
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemovePhoto}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="receipt-file"
                    onChange={(e) => handlePhotoSelect(e, 'file')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('receipt-file')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    id="receipt-camera"
                    onChange={(e) => handlePhotoSelect(e, 'camera')}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('receipt-camera')?.click()}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !isValid || uploadingPhoto}>
            {uploadingPhoto ? 'Uploading...' : loading ? 'Saving...' : 'Save Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
