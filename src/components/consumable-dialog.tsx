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

  useEffect(() => {
    if (consumable) {
      setFormData(consumable);
    } else {
      setFormData({ 
        name: '', 
        type: 'Consumable',
        purchasedFrom: '',
        purchaseAmount: 0,
        datePurchased: new Date().toISOString().split('T')[0]
      });
    }
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

  const handleSave = async () => {
    if (!formData.name || !formData.purchasedFrom || !formData.datePurchased || formData.purchaseAmount === undefined) {
      return;
    }

    setLoading(true);
    try {
      onSave(formData as Consumable);
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !isValid}>
            {loading ? 'Saving...' : 'Save Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
