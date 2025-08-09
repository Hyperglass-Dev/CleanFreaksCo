
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
import { invoices } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import type { Invoice } from '@/lib/types';

export function InvoiceTable() {
    const statusColors: { [key in Invoice['status']]: string } = {
        Paid: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Overdue: 'bg-red-100 text-red-800',
    };

    return (
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
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
