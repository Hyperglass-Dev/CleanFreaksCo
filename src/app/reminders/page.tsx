
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function RemindersPage() {
  return (
    <>
      <PageHeader title="Appointment Reminders" />
      <Card className="max-w-2xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Automation Settings</CardTitle>
          <CardDescription>
            Configure automated SMS and email reminders for your clients and staff.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-8">
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
                  <Label htmlFor="on-the-way" className="font-medium">'On the Way' Alert</Label>
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
                  <p className="text-sm text-muted-foreground">Send the day's schedule every morning at 7 AM.</p>
                </div>
                <Switch id="daily-schedule" defaultChecked />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
