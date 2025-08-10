'use client';

import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { getConsumablesGroupedByMonth, addConsumable, updateConsumable, deleteConsumable } from '@/lib/data';
import { MoreHorizontal, PlusCircle, Trash2, Edit, Package, DollarSign, Calendar, Image, Download, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Consumable, MonthlyGroup, PurchaseType } from '@/lib/types';
import { ConsumableDialog } from '@/components/consumable-dialog';
import { EofySummaryDialog } from '@/components/eofy-summary-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function ConsumablesPage() {
  const [monthlyGroups, setMonthlyGroups] = useState<MonthlyGroup<Consumable>[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedConsumable, setSelectedConsumable] = useState<Consumable | null>(null);
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [isEofyDialogOpen, setIsEofyDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user has admin access
  const hasAdminAccess = user?.role === 'admin';

  useEffect(() => {
    loadConsumables();
  }, []);

  const loadConsumables = async () => {
    try {
      const groups = await getConsumablesGroupedByMonth();
      setMonthlyGroups(groups);
      // Open the first (most recent) group by default
      if (groups.length > 0) {
        setOpenGroups(new Set([groups[0].month]));
      }
    } catch (error) {
      console.error('Error loading consumables:', error);
      toast({ title: "Error", description: "Failed to load consumables.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddConsumable = () => {
    if (!hasAdminAccess) {
      toast({ title: "Access Denied", description: "Only owners/managers can add consumables.", variant: "destructive" });
      return;
    }
    setSelectedConsumable(null);
    setIsDialogOpen(true);
  };

  const handleEditConsumable = (consumable: Consumable) => {
    if (!hasAdminAccess) {
      toast({ title: "Access Denied", description: "Only owners/managers can edit consumables.", variant: "destructive" });
      return;
    }
    setSelectedConsumable(consumable);
    setIsDialogOpen(true);
  };

  const handleSaveConsumable = async (consumable: Consumable) => {
    try {
      if (consumable.id) {
        // Edit existing consumable
        await updateConsumable(consumable.id, consumable);
        toast({ title: "Consumable Updated", description: `${consumable.name} has been updated.` });
      } else {
        // Add new consumable
        const newConsumable = {
          ...consumable,
          createdBy: user?.name || 'Unknown',
          createdAt: new Date().toISOString()
        };
        await addConsumable(newConsumable);
        toast({ title: "Consumable Added", description: `${consumable.name} has been added to the register.` });
      }
      loadConsumables();
    } catch (error) {
      console.error('Error saving consumable:', error);
      toast({ title: "Error", description: "Failed to save consumable.", variant: "destructive" });
    }
  };

  const handleDeleteConsumable = async (consumable: Consumable) => {
    if (!hasAdminAccess) {
      toast({ title: "Access Denied", description: "Only owners/managers can delete consumables.", variant: "destructive" });
      return;
    }

    if (consumable.id && confirm(`Are you sure you want to delete ${consumable.name}? This action cannot be undone.`)) {
      try {
        await deleteConsumable(consumable.id);
        toast({ title: "Consumable Deleted", description: `${consumable.name} has been deleted.` });
        loadConsumables();
      } catch (error) {
        console.error('Error deleting consumable:', error);
        toast({ title: "Error", description: "Failed to delete consumable.", variant: "destructive" });
      }
    }
  };

  const toggleGroup = (groupName: string) => {
    const newOpenGroups = new Set(openGroups);
    if (newOpenGroups.has(groupName)) {
      newOpenGroups.delete(groupName);
    } else {
      newOpenGroups.add(groupName);
    }
    setOpenGroups(newOpenGroups);
  };

  const getTypeColor = (type: PurchaseType): string => {
    switch (type) {
      case 'Consumable': return 'bg-blue-100 text-blue-800';
      case 'Plant & Equipment': return 'bg-green-100 text-green-800';
      case 'Office Equipment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  return (
    <>
      <PageHeader title="Purchasing Register">
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setIsEofyDialogOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            EOFY Summary
          </Button>
          {hasAdminAccess && (
            <Button onClick={handleAddConsumable}>
              <PlusCircle className="mr-2" />
              Add Purchase
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthlyGroups.reduce((sum, group) => sum + group.itemCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                All time purchases
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(monthlyGroups.reduce((sum, group) => sum + (group.totalAmount || 0), 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                All time spending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthlyGroups.length > 0 ? formatCurrency(monthlyGroups[0].totalAmount || 0) : formatCurrency(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {monthlyGroups.length > 0 ? `${monthlyGroups[0].itemCount} items` : '0 items'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Groups */}
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">Loading consumables...</div>
            </CardContent>
          </Card>
        ) : monthlyGroups.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                No consumable purchases recorded yet.
                {hasAdminAccess && " Add your first purchase to get started."}
              </div>
            </CardContent>
          </Card>
        ) : (
          monthlyGroups.map((group) => (
            <Card key={group.month} className="shadow-sm">
              <Collapsible 
                open={openGroups.has(group.month)} 
                onOpenChange={() => toggleGroup(group.month)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {openGroups.has(group.month) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <CardTitle className="text-lg">{group.month}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{group.itemCount} purchases</span>
                        <span className="font-semibold">{formatCurrency(group.totalAmount || 0)}</span>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Supplier</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Receipt</TableHead>
                          {hasAdminAccess && <TableHead><span className="sr-only">Actions</span></TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.items.map((consumable) => (
                          <TableRow key={consumable.id}>
                            <TableCell>
                              <div className="font-medium">{consumable.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Added by {consumable.createdBy}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={getTypeColor(consumable.type)}>
                                {consumable.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{consumable.purchasedFrom}</TableCell>
                            <TableCell>{formatDate(consumable.datePurchased)}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(consumable.purchaseAmount)}
                            </TableCell>
                            <TableCell>
                              {consumable.receiptPhotoUrl ? (
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(consumable.receiptPhotoUrl, '_blank')}
                                  >
                                    <Image className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = consumable.receiptPhotoUrl!;
                                      link.download = consumable.receiptPhotoName || 'receipt.jpg';
                                      link.click();
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">No receipt</span>
                              )}
                            </TableCell>
                            {hasAdminAccess && (
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditConsumable(consumable)}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteConsumable(consumable)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>

      <ConsumableDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        consumable={selectedConsumable}
        onSave={handleSaveConsumable}
      />
      
      <EofySummaryDialog
        open={isEofyDialogOpen}
        onOpenChange={setIsEofyDialogOpen}
      />
    </>
  );
}
