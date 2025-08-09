
import { PageHeader } from '@/components/page-header';
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
import { invoices, bills } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';
import { InvoiceTable } from '@/components/invoice-table';
import { BillTable } from '@/components/bill-table';

export default function BookkeepingPage() {
  return (
    <>
      <PageHeader title="Bookkeeping">
        <Button>
            <PlusCircle className="mr-2" />
            Add New
        </Button>
      </PageHeader>
      <div className="grid gap-8">
        <InvoiceTable />
        <BillTable />
      </div>
    </>
  );
}
