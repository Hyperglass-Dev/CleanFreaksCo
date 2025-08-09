
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { companySettings as initialSettings } from '@/lib/data';
import Image from 'next/image';
import { Upload, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [isAbnSet, setIsAbnSet] = useState(!!initialSettings.abn);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialSettings.logo);
  const [isGstRegistered, setIsGstRegistered] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    console.log('Saving settings:', {...settings, isGstRegistered});
    if (settings.abn) {
      setIsAbnSet(true);
    }
    alert('Settings saved successfully!');
  };

  return (
    <>
      <PageHeader title="Company Settings" />
      <form onSubmit={(e) => {e.preventDefault(); handleSave();}}>
      <Card className="max-w-4xl mx-auto shadow-md mb-8">
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
                        <Input id="abn" value={settings.abn} onChange={handleInputChange} disabled={isAbnSet} placeholder="e.g. 12 345 678 901" />
                         {isAbnSet && (
                           <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                             <AlertTriangle className="w-3 h-3" /> The ABN cannot be changed once set.
                           </p>
                          )}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={settings.address} onChange={handleInputChange} placeholder="e.g. 123 Example St, Sydney NSW 2000" />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={settings.phone} onChange={handleInputChange} placeholder="e.g. 02 9123 4567" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={settings.email} onChange={handleInputChange} placeholder="e.g. contact@company.com.au" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" value={settings.website} onChange={handleInputChange} placeholder="e.g. www.company.com.au" />
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="max-w-4xl mx-auto shadow-md">
        <CardHeader>
            <CardTitle>Financial Settings</CardTitle>
            <CardDescription>Configure payment details and tax settings for your invoices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="bankDetails">Bank Details for Invoices</Label>
                <Textarea id="bankDetails" value={settings.bankDetails} onChange={handleInputChange} placeholder="e.g.&#10;Bank Name: Commonwealth Bank&#10;Account Name: Clean Freaks Co&#10;BSB: 062-000&#10;Account Number: 1234 5678" rows={4}/>
                <p className="text-xs text-muted-foreground">This information will be displayed on your invoices for bank transfer payments.</p>
            </div>
            <Separator />
             <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="gst-registration" className="font-medium">Are you registered for GST?</Label>
                  <p className="text-sm text-muted-foreground">If enabled, GST will be automatically calculated and added to your invoices.</p>
                </div>
                <Switch id="gst-registration" checked={isGstRegistered} onCheckedChange={setIsGstRegistered} />
              </div>
        </CardContent>
        <CardFooter className="justify-end">
            <Button type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
      </form>
    </>
  );
}
