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
import { bills as initialBills } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import type { Bill } from '@/lib/types';
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

export function BillTable() {
    const [bills, setBills] = useState<Bill[]>(initialBills);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().substring(0, 10));
    const { toast } = useToast();

    const statusColors: { [key in Bill['status']]: string } = {
        Paid: 'bg-green-100 text-green-800',
        Unpaid: 'bg-orange-100 text-orange-800',
    };

    const handleMarkAsPaid = (bill: Bill) => {
        setSelectedBill(bill);
        setIsConfirmOpen(true);
    };

    const confirmPayment = () => {
        if (selectedBill) {
            setBills(bills.map(b => 
                b.id === selectedBill.id ? { ...b, status: 'Paid' } : b
            ));
            toast({
                title: 'Bill Paid',
                description: `Bill ${selectedBill.id} marked as paid on ${paymentDate}.`
            });
        }
        setIsConfirmOpen(false);
        setSelectedBill(null);
    }

    return (
        <>
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Supplier Bills</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Supplier</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bills.map(bill => (
                                <TableRow key={bill.id}>
                                    <TableCell className="font-medium">{bill.supplierName}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(bill.amount)}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">{bill.dueDate}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={cn(statusColors[bill.status], 'py-1 px-3 text-xs')}>
                                            {bill.status}
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
                                                <DropdownMenuItem onClick={() => handleMarkAsPaid(bill)} disabled={bill.status === 'Paid'}>
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
                    <AlertDialogTitle>Confirm Bill Payment</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please select the date the payment was made for bill <span className="font-semibold">{selectedBill?.id}</span>.
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