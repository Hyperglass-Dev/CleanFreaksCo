
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { companySettings as initialSettings } from '@/lib/data';
import Image from 'next/image';
import { Upload } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [isAbnSet, setIsAbnSet] = useState(!!initialSettings.abn);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialSettings.logo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setSettings(prev => ({...prev, logo: reader.result as string}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real app, you'd save this to a database.
    // We'll just log it for now.
    console.log('Saving settings:', settings);
    if (settings.abn) {
      setIsAbnSet(true);
    }
    alert('Settings saved successfully!');
  };

  return (
    <>
      <PageHeader title="Company Settings" />
      <Card className="max-w-4xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>
            Set up your company information. This will be used on invoices and other documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4">
                 <Image
                    src={logoPreview || "https://placehold.co/150x150.png"}
                    alt="Company Logo"
                    width={128}
                    height={128}
                    className="rounded-full object-cover"
                    />
                 <Button asChild size="icon" className="absolute bottom-0 right-0 rounded-full">
                     <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4"/>
                        <span className="sr-only">Upload logo</span>
                     </label>
                 </Button>
                 <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
              </div>
              <p className="text-sm text-muted-foreground">Upload your company logo. A square image works best.</p>
            </div>
            <div className="md:col-span-2 grid gap-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Company Name</Label>
                        <Input id="name" value={settings.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="abn">Australian Business Number (ABN)</Label>
                        <Input id="abn" value={settings.abn} onChange={handleInputChange} disabled={isAbnSet} />
                         {isAbnSet && <p className="text-xs text-muted-foreground">The ABN cannot be changed once set.</p>}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={settings.address} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={settings.phone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={settings.email} onChange={handleInputChange} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" value={settings.website} onChange={handleInputChange} />
                </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </>
  );
}
