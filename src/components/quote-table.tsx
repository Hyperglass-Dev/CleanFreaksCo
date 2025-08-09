
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
import { quotes } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MoreHorizontal, FileCheck2 } from 'lucide-react';
import type { Quote } from '@/lib/types';

export function QuoteTable() {
    const statusColors: { [key in Quote['status']]: string } = {
        Draft: 'bg-gray-100 text-gray-800',
        Sent: 'bg-blue-100 text-blue-800',
        Accepted: 'bg-green-100 text-green-800',
        Declined: 'bg-red-100 text-red-800',
    };

    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quotes</CardTitle>
                <Button variant="outline" size="sm" disabled>
                    <FileCheck2 className="mr-2" />
                    Convert Accepted to Invoice
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="hidden sm:table-cell">Expiry Date</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quotes.map(quote => (
                            <TableRow key={quote.id}>
                                <TableCell className="font-medium">{quote.clientName}</TableCell>
                                <TableCell className="text-right font-medium">
                                    {new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(quote.amount)}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">{new Date(quote.expiryDate).toLocaleDateString('en-AU')}</TableCell>
                                <TableCell className="text-center">
                                    <Badge className={cn(statusColors[quote.status], 'py-1 px-3 text-xs')}>
                                        {quote.status}
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
