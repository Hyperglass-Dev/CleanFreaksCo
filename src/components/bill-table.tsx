
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
import { bills } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import type { Bill } from '@/lib/types';

export function BillTable() {
    const statusColors: { [key in Bill['status']]: string } = {
        Paid: 'bg-green-100 text-green-800',
        Unpaid: 'bg-orange-100 text-orange-800',
    };

    return (
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
