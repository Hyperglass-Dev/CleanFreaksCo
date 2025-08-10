'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Printer } from 'lucide-react';
import { getConsumablesGroupedByMonth } from '@/lib/data';
import type { Consumable, MonthlyGroup, PurchaseType } from '@/lib/types';

type EofySummaryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EofySummaryDialog({ open, onOpenChange }: EofySummaryDialogProps) {
  const [monthlyGroups, setMonthlyGroups] = useState<MonthlyGroup<Consumable>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>('');

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    try {
      const groups = await getConsumablesGroupedByMonth();
      setMonthlyGroups(groups);
      
      // Set default to current financial year
      const now = new Date();
      const currentYear = now.getFullYear();
      const financialYear = now.getMonth() >= 6 ? currentYear : currentYear - 1; // July to June
      setSelectedFinancialYear(`${financialYear}-${financialYear + 1}`);
    } catch (error) {
      console.error('Error loading EOFY data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFinancialYearData = () => {
    if (!selectedFinancialYear) return [];
    
    const [startYear, endYear] = selectedFinancialYear.split('-').map(Number);
    const startDate = new Date(startYear, 6, 1); // July 1st
    const endDate = new Date(endYear, 5, 30); // June 30th
    
    const filteredItems: Consumable[] = [];
    monthlyGroups.forEach(group => {
      group.items.forEach(item => {
        const itemDate = new Date(item.datePurchased);
        if (itemDate >= startDate && itemDate <= endDate) {
          filteredItems.push(item);
        }
      });
    });
    
    return filteredItems.sort((a, b) => new Date(a.datePurchased).getTime() - new Date(b.datePurchased).getTime());
  };

  const getSummaryByType = () => {
    const items = getFinancialYearData();
    const summary: { [key in PurchaseType]: { count: number; total: number } } = {
      'Consumable': { count: 0, total: 0 },
      'Plant & Equipment': { count: 0, total: 0 },
      'Office Equipment': { count: 0, total: 0 }
    };
    
    items.forEach(item => {
      summary[item.type].count++;
      summary[item.type].total += item.purchaseAmount;
    });
    
    return summary;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTypeColor = (type: PurchaseType): string => {
    switch (type) {
      case 'Consumable': return 'bg-blue-100 text-blue-800';
      case 'Plant & Equipment': return 'bg-green-100 text-green-800';
      case 'Office Equipment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const items = getFinancialYearData();
    const summary = getSummaryByType();
    
    // Create CSV content
    let csvContent = `CleanFreaksCo - EOFY Purchasing Summary ${selectedFinancialYear}\n\n`;
    
    // Summary section
    csvContent += "SUMMARY BY TYPE\n";
    csvContent += "Type,Count,Total Amount\n";
    Object.entries(summary).forEach(([type, data]) => {
      csvContent += `${type},${data.count},${data.total.toFixed(2)}\n`;
    });
    
    const grandTotal = Object.values(summary).reduce((sum, data) => sum + data.total, 0);
    csvContent += `\nGRAND TOTAL,,${grandTotal.toFixed(2)}\n\n`;
    
    // Detailed transactions
    csvContent += "DETAILED TRANSACTIONS\n";
    csvContent += "Date,Product Name,Type,Supplier,Amount,Created By\n";
    items.forEach(item => {
      csvContent += `${item.datePurchased},"${item.name}",${item.type},"${item.purchasedFrom}",${item.purchaseAmount.toFixed(2)},${item.createdBy}\n`;
    });
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `CleanFreaksCo_EOFY_${selectedFinancialYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printSummary = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const items = getFinancialYearData();
    const summary = getSummaryByType();
    const grandTotal = Object.values(summary).reduce((sum, data) => sum + data.total, 0);
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CleanFreaksCo - EOFY Summary ${selectedFinancialYear}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2 { color: #333; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; background-color: #f9f9f9; }
            .summary-card { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>CleanFreaksCo - End of Financial Year Summary</h1>
          <h2>Financial Year: ${selectedFinancialYear}</h2>
          
          <div class="summary-card">
            <h3>Summary by Purchase Type</h3>
            <table>
              <tr><th>Type</th><th>Count</th><th>Total Amount</th></tr>
              ${Object.entries(summary).map(([type, data]) => 
                `<tr><td>${type}</td><td>${data.count}</td><td>${formatCurrency(data.total)}</td></tr>`
              ).join('')}
              <tr class="total"><td><strong>TOTAL</strong></td><td><strong>${items.length}</strong></td><td><strong>${formatCurrency(grandTotal)}</strong></td></tr>
            </table>
          </div>
          
          <h3>Detailed Transactions</h3>
          <table>
            <tr>
              <th>Date</th><th>Product</th><th>Type</th><th>Supplier</th><th>Amount</th><th>Added By</th>
            </tr>
            ${items.map(item => `
              <tr>
                <td>${formatDate(item.datePurchased)}</td>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.purchasedFrom}</td>
                <td>${formatCurrency(item.purchaseAmount)}</td>
                <td>${item.createdBy}</td>
              </tr>
            `).join('')}
          </table>
          
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Generated on ${new Date().toLocaleDateString('en-AU')} by CleanFreaksCo Management System
          </p>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const items = getFinancialYearData();
  const summary = getSummaryByType();
  const grandTotal = Object.values(summary).reduce((sum, data) => sum + data.total, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>End of Financial Year Summary</DialogTitle>
          <DialogDescription>
            Comprehensive purchasing summary suitable for your accountant and tax purposes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Financial Year Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Financial Year:</label>
            <select
              value={selectedFinancialYear}
              onChange={(e) => setSelectedFinancialYear(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                {Object.entries(summary).map(([type, data]) => (
                  <Card key={type}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data.count}</div>
                      <div className="text-sm text-muted-foreground">{formatCurrency(data.total)}</div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{items.length}</div>
                    <div className="text-sm font-semibold text-primary">{formatCurrency(grandTotal)}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Table */}
              {items.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Supplier</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Added By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, index) => (
                          <TableRow key={item.id || index}>
                            <TableCell>{formatDate(item.datePurchased)}</TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={getTypeColor(item.type)}>
                                {item.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.purchasedFrom}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.purchaseAmount)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.createdBy}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No purchases found for the selected financial year.</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={printSummary} disabled={items.length === 0}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={exportToCSV} disabled={items.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
