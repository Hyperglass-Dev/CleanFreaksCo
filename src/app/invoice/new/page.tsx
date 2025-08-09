
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
import { PlusCircle, Trash2, Download, Printer } from 'lucide-react';

export default function NewInvoicePage() {
  return (
    <>
      <PageHeader title="Create a New Invoice">
        <div className="flex items-center gap-2">
            <Button variant="outline"><Printer className="mr-2" /> Print</Button>
            <Button variant="outline"><Download className="mr-2" /> Download PDF</Button>
            <Button>Save and Send</Button>
        </div>
      </PageHeader>
      <Card className="max-w-4xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
          <CardDescription>
            Create an invoice to send to a client for payment.
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
                <Label htmlFor="invoice-date">Invoice Date</Label>
                <Input id="invoice-date" type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
              </div>
            </div>
             <div className="space-y-2">
              <Label>Line Items</Label>
              <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                 <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5"><Input placeholder="Service or Item Description" /></div>
                    <div className="col-span-2"><Input type="number" placeholder="Qty" defaultValue="1" /></div>
                    <div className="col-span-2"><Input type="number" placeholder="Price" /></div>
                    <div className="col-span-2 text-right font-medium">$0.00</div>
                     <div className="col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive"/></Button>
                    </div>
                 </div>
                 <Button variant="outline" size="sm" className="bg-background">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Line Item
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes or Terms</Label>
              <Textarea id="notes" placeholder="e.g., Payment is due within 14 days." />
            </div>
             <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>$0.00</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">GST (10%)</span>
                        <span>$0.00</span>
                    </div>
                     <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span>Total</span>
                        <span>$0.00</span>
                    </div>
                </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="ghost">Save as Draft</Button>
        </CardFooter>
      </Card>
    </>
  );
}
