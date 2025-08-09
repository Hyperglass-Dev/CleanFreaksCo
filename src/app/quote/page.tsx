
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
import { clients } from '@/lib/data';

export default function NewQuotePage() {
  return (
    <>
      <PageHeader title="Create a New Quote" />
      <Card className="max-w-4xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
          <CardDescription>
            Create a quote to send to a client. This can be converted into an invoice later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="client">Select Client</Label>
                <Select>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="quote-date">Quote Date</Label>
                <Input id="quote-date" type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
              </div>
            </div>
             <div className="space-y-2">
              <Label>Line Items</Label>
              <div className="p-2 border rounded-lg space-y-4">
                 <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6"><Input placeholder="Service or Item Description" /></div>
                    <div className="col-span-2"><Input type="number" placeholder="Qty" defaultValue="1" /></div>
                    <div className="col-span-2"><Input type="number" placeholder="Price" /></div>
                    <div className="col-span-2 text-right font-medium">$0.00</div>
                 </div>
                 <Button variant="outline" size="sm">Add Line Item</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes or Terms</Label>
              <Textarea id="notes" placeholder="e.g., Quote is valid for 30 days." />
            </div>
             <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>$0.00</span>
                    </div>
                     <div className="flex justify-between">
                        <span>GST (10%)</span>
                        <span>$0.00</span>
                    </div>
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>$0.00</span>
                    </div>
                </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="ghost">Save as Draft</Button>
          <Button>Save and Send</Button>
        </CardFooter>
      </Card>
    </>
  );
}
