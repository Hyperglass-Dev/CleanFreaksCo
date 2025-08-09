
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { getCompanySettings, updateCompanySettings } from '@/lib/data';
import type { CompanySettings } from '@/lib/types';
import Image from 'next/image';
import { Upload, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>({
    name: '',
    abn: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    bankDetails: '',
  });
  const [isAbnSet, setIsAbnSet] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isGstRegistered, setIsGstRegistered] = useState(true);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsData = await getCompanySettings();
        if (settingsData) {
          setSettings(settingsData);
          setIsAbnSet(!!settingsData.abn);
          setLogoPreview(settingsData.logo || null);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({ title: "Error", description: "Failed to load settings.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

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

  const handleSave = async () => {
    try {
      await updateCompanySettings({...settings});
      if (settings.abn) {
        setIsAbnSet(true);
      }
      toast({ title: "Settings Saved", description: "Company settings updated successfully." });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    }
  };

  return (
    <>
      <PageHeader title="Company Settings" />
      <div className="space-y-8">
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
                      src={logoPreview || "https://ui-avatars.io/api/?name=Company&background=E6E6FA&color=800000&size=150"}
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
        </Card>
        
        <Card className="max-w-4xl mx-auto shadow-md">
          <CardHeader>
            <CardTitle>Reminder Settings</CardTitle>
            <CardDescription>
              Configure automated SMS and email reminders for your clients and staff.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-headline">Client Reminders</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="booking-confirmation" className="font-medium">Booking Confirmation</Label>
                    <p className="text-sm text-muted-foreground">Send immediately after a job is booked.</p>
                  </div>
                  <Switch id="booking-confirmation" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="upcoming-reminder" className="font-medium">24-Hour Reminder</Label>
                    <p className="text-sm text-muted-foreground">Send 24 hours before the scheduled job.</p>
                  </div>
                  <Switch id="upcoming-reminder" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="on-the-way" className="font-medium">&apos;On the Way&apos; Alert</Label>
                    <p className="text-sm text-muted-foreground">Triggered when cleaner starts their route.</p>
                  </div>
                  <Switch id="on-the-way" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-headline">Staff Notifications</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="new-job-alert" className="font-medium">New Job Alert</Label>
                    <p className="text-sm text-muted-foreground">Notify staff when they are assigned a new job.</p>
                  </div>
                  <Switch id="new-job-alert" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="daily-schedule" className="font-medium">Daily Run Sheet</Label>
                    <p className="text-sm text-muted-foreground">Send the day&apos;s schedule every morning at 7 AM.</p>
                  </div>
                  <Switch id="daily-schedule" defaultChecked />
                </div>
              </div>
          </CardContent>
        </Card>

        <div className="max-w-4xl mx-auto flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </>
  );
}
