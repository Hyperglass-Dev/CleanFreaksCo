
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function QuotePage() {
  return (
    <>
      <PageHeader title="Request a Quote" />
      <Card className="max-w-2xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Get a Free Estimate</CardTitle>
          <CardDescription>
            Fill out the form below and one of our team members will get back to you shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Service Address</Label>
              <Input id="address" placeholder="123 Main St, Anytown, USA" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-type">Service Type</Label>
                <Select>
                  <SelectTrigger id="service-type">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Cleaning</SelectItem>
                    <SelectItem value="deep">Deep Cleaning</SelectItem>
                    <SelectItem value="move-out">Move-Out Cleaning</SelectItem>
                    <SelectItem value="commercial">Commercial Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date</Label>
                <Input id="date" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Additional Details</Label>
              <Textarea id="details" placeholder="Tell us more about your needs (e.g., number of bedrooms, specific areas to focus on)." />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Submit Request</Button>
        </CardFooter>
      </Card>
    </>
  );
}
