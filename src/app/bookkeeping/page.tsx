
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { InvoiceTable } from '@/components/invoice-table';
import { BillTable } from '@/components/bill-table';
import { QuoteTable } from '@/components/quote-table';
import Link from 'next/link';

export default function BookkeepingPage() {
  return (
    <>
      <PageHeader title="Bookkeeping">
        <div className="flex gap-2">
            <Button asChild>
                <Link href="/quote/new">
                    <PlusCircle className="mr-2" />
                    Create Quote
                </Link>
            </Button>
             <Button asChild>
                <Link href="/invoice/new">
                    <PlusCircle className="mr-2" />
                    Create Invoice
                </Link>
            </Button>
            <Button asChild>
                <Link href="/bill/new">
                    <PlusCircle className="mr-2" />
                    Create Bill
                </Link>
            </Button>
        </div>
      </PageHeader>
      <div className="grid gap-8">
        <QuoteTable />
        <InvoiceTable />
        <BillTable />
      </div>
    </>
  );
}
