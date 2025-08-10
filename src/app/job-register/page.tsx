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
import { Badge } from '@/components/ui/badge';
import { getJobRecordsGroupedByMonth } from '@/lib/data';
import { Calendar, DollarSign, ClipboardCheck, Users, Clock, MapPin } from 'lucide-react';
import type { JobRecord, MonthlyGroup } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function JobRegisterPage() {
  const [monthlyGroups, setMonthlyGroups] = useState<MonthlyGroup<JobRecord>[]>([]);
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    loadJobRecords();
  }, []);

  const loadJobRecords = async () => {
    try {
      const groups = await getJobRecordsGroupedByMonth();
      setMonthlyGroups(groups);
      // Open the first (most recent) group by default
      if (groups.length > 0) {
        setOpenGroups(new Set([groups[0].month]));
      }
    } catch (error) {
      console.error('Error loading job records:', error);
      toast({ title: "Error", description: "Failed to load job records.", variant: "destructive" });
    } finally {
      setLoading(false);
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

  const formatTime = (timeString: string): string => {
    // Handle both HH:MM and HH:MM:SS formats
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatStaffList = (staffIds: string[]): string => {
    if (!staffIds || staffIds.length === 0) return 'Unassigned';
    return staffIds.join(', ');
  };

  return (
    <>
      <PageHeader title="Job Register">
        <div className="text-sm text-muted-foreground">
          Completed jobs and revenue tracking
        </div>
      </PageHeader>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthlyGroups.reduce((sum, group) => sum + group.itemCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Completed jobs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(monthlyGroups.reduce((sum, group) => sum + (group.totalAmount || 0), 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                All time revenue
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
                {monthlyGroups.length > 0 ? `${monthlyGroups[0].itemCount} jobs` : '0 jobs'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Job Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {monthlyGroups.length > 0 && monthlyGroups[0].itemCount > 0 
                  ? formatCurrency((monthlyGroups[0].totalAmount || 0) / monthlyGroups[0].itemCount)
                  : formatCurrency(0)
                }
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Groups */}
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">Loading job records...</div>
            </CardContent>
          </Card>
        ) : monthlyGroups.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                No completed jobs recorded yet. Complete jobs from the scheduling page to see them here.
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
                        <span>{group.itemCount} jobs</span>
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
                          <TableHead>Client & Service</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Staff</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.items.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{record.clientName}</div>
                                <div className="text-sm text-muted-foreground line-clamp-2">
                                  {record.description}
                                </div>
                                {record.notes && (
                                  <div className="text-xs text-muted-foreground italic">
                                    Notes: {record.notes}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{formatDate(record.serviceDate)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{formatTime(record.serviceTime)}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-start space-x-1">
                                <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <span className="text-sm line-clamp-2">{record.address}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{formatStaffList(record.staffAssigned)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-semibold text-lg">
                                {formatCurrency(record.priceCharged)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Completed {formatDate(record.completedAt)}
                              </div>
                            </TableCell>
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
    </>
  );
}
