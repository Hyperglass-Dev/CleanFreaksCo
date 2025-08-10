'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { JobCard } from '@/components/job-card';
import { getJobs, getStaff } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addWeeks, subWeeks, addMonths, subMonths, addDays, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { RouteMap } from '@/components/route-map';
import { useAuth } from '@/contexts/AuthContext';
import type { Job, Staff } from '@/lib/types';

type ViewType = 'daily' | 'weekly' | 'monthly';

export default function RunSheetPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>('weekly');
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const [jobsData, staffData] = await Promise.all([
        getJobs(),
        getStaff()
      ]);
      setJobs(jobsData);
      setStaff(staffData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredJobs = () => {
    const scheduledJobs = jobs.filter(job => job.status !== 'Unscheduled' && job.status !== 'Completed');
    
    switch (viewType) {
      case 'daily':
        return scheduledJobs.filter(job => {
          if (!job.date) return false;
          const jobDate = new Date(job.date);
          return isSameDay(jobDate, selectedDate);
        });
      
      case 'weekly':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday start
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return scheduledJobs.filter(job => {
          if (!job.date) return false;
          const jobDate = new Date(job.date);
          return jobDate >= weekStart && jobDate <= weekEnd;
        });
      
      case 'monthly':
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        return scheduledJobs.filter(job => {
          if (!job.date) return false;
          const jobDate = new Date(job.date);
          return jobDate >= monthStart && jobDate <= monthEnd;
        });
      
      default:
        return scheduledJobs;
    }
  };

  const filteredJobs = getFilteredJobs();

  const navigateDate = (direction: 'prev' | 'next') => {
    switch (viewType) {
      case 'daily':
        setSelectedDate(direction === 'next' ? addDays(selectedDate, 1) : subDays(selectedDate, 1));
        break;
      case 'weekly':
        setSelectedDate(direction === 'next' ? addWeeks(selectedDate, 1) : subWeeks(selectedDate, 1));
        break;
      case 'monthly':
        setSelectedDate(direction === 'next' ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1));
        break;
    }
  };

  const getDateRangeText = () => {
    switch (viewType) {
      case 'daily':
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
      case 'weekly':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'monthly':
        return format(selectedDate, 'MMMM yyyy');
      default:
        return '';
    }
  };

  const groupJobsByDate = () => {
    if (viewType === 'daily') {
      return [{ date: selectedDate, jobs: filteredJobs }];
    }

    const grouped: { [key: string]: Job[] } = {};
    filteredJobs.forEach(job => {
      if (job.date) {
        const dateKey = format(new Date(job.date), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(job);
      }
    });

    return Object.entries(grouped)
      .map(([dateStr, jobs]) => ({
        date: new Date(dateStr),
        jobs: jobs.sort((a, b) => a.time.localeCompare(b.time))
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const groupedJobs = groupJobsByDate();
  const todaysJobsForMap = filteredJobs.filter(job => {
    if (!job.date) return false;
    return isSameDay(new Date(job.date), new Date());
  });

  // Get staff address for daily planning (prioritize current user if they're staff, otherwise use first staff with address)
  const getStaffAddressForPlanning = () => {
    if (viewType !== 'daily') return undefined;
    
    // If current user is staff, use their address
    if (user?.role === 'staff') {
      const currentStaff = staff.find(s => s.email === user.email);
      if (currentStaff?.address) return currentStaff.address;
    }
    
    // Otherwise, find the first staff member with an address
    const staffWithAddress = staff.find(s => s.address);
    return staffWithAddress?.address;
  };

  return (
    <>
      <PageHeader title="Run Sheet" />
      
      <div className="space-y-6">
        {/* View Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Tabs value={viewType} onValueChange={(value) => setViewType(value as ViewType)}>
                  <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-right">
                <h3 className="text-lg font-semibold">{getDateRangeText()}</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} scheduled
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Jobs Display */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded mb-2 w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : groupedJobs.length > 0 ? (
              groupedJobs.map(({ date, jobs }) => (
                <Card key={date.toISOString()} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {format(date, 'EEEE, MMMM d, yyyy')}
                      </CardTitle>
                      <Badge variant="secondary">
                        {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4 p-6">
                      {jobs.map(job => (
                        <JobCard 
                          key={job.id} 
                          job={job} 
                          onJobUpdated={loadJobs}
                          showDeleteButton={isAdmin}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    No jobs scheduled for this {viewType === 'daily' ? 'day' : viewType === 'weekly' ? 'week' : 'month'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Map Section - Only show for daily view or current day */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <RouteMap 
                jobs={viewType === 'daily' ? filteredJobs : todaysJobsForMap} 
                loading={loading}
                staffAddress={getStaffAddressForPlanning()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
