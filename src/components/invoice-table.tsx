'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { invoices as initialInvoices } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Calendar as CalendarIcon } from 'lucide-react';
import type { Invoice } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';

export function InvoiceTable() {
    const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().substring(0, 10));
    const { toast } = useToast();

    const statusColors: { [key in Invoice['status']]: string } = {
        Paid: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Overdue: 'bg-red-100 text-red-800',
    };

    const handleMarkAsPaid = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsConfirmOpen(true);
    };

    const confirmPayment = () => {
        if (selectedInvoice) {
            setInvoices(invoices.map(inv => 
                inv.id === selectedInvoice.id ? { ...inv, status: 'Paid' } : inv
            ));
            toast({
                title: 'Payment Confirmed',
                description: `Invoice ${selectedInvoice.id} marked as paid on ${paymentDate}.`
            });
        }
        setIsConfirmOpen(false);
        setSelectedInvoice(null);
    }

    return (
        <>
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map(invoice => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.clientName}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.amount)}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">{invoice.dueDate}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={cn(statusColors[invoice.status], 'py-1 px-3 text-xs')}>
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice)} disabled={invoice.status === 'Paid'}>
                                                    Mark as Paid
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Payment Received</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please select the date the payment was received for invoice <span className="font-semibold">{selectedInvoice?.id}</span>.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-2 py-2">
                        <Label htmlFor="payment-date">Payment Date</Label>
                        <Input 
                            id="payment-date" 
                            type="date" 
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                        />
                    </div>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmPayment}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}