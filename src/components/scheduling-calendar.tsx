
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getJobs, getStaff } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Job, Staff } from "@/lib/types";

const timeSlots = ["7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM"];
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SchedulingCalendar() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [jobsData, staffData] = await Promise.all([
                getJobs(),
                getStaff()
            ]);
            console.log('Scheduling Calendar - Jobs loaded:', jobsData);
            console.log('Scheduling Calendar - Scheduled jobs:', jobsData.filter(job => job.status === 'Scheduled'));
            console.log('Scheduling Calendar - Staff loaded:', staffData);
            setJobs(jobsData);
            setStaff(staffData);
        } catch (error) {
            console.error('Failed to load scheduling data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get current week's dates
    const getCurrentWeekDates = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Monday

        return weekDays.map((_, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            return date;
        });
    };

    const weekDates = getCurrentWeekDates();

    const getJobsForDate = (staffId: string, date: Date) => {
        const scheduledJobs = jobs.filter(job => 
            job.status === 'Scheduled' && 
            job.cleanerIds?.includes(staffId) &&
            job.date
        );
        
        const dayJobs = scheduledJobs.filter(job => {
            if (!job.date) return false;
            
            const jobDate = new Date(job.date);
            return jobDate.getDate() === date.getDate() &&
                   jobDate.getMonth() === date.getMonth() &&
                   jobDate.getFullYear() === date.getFullYear();
        });
        
        if (dayJobs.length > 0) {
            console.log(`Jobs for staff ${staffId} on ${date.toDateString()}:`, dayJobs);
        }
        
        return dayJobs;
    };

    const formatDuration = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}min`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}min`;
    };

    const calculateEndTime = (startTime: string, durationMinutes: number): string => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);
        
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
        return endDate.toTimeString().substring(0, 5);
    };
    if (loading) {
        return (
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Week of {weekDates[0].toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}
                </p>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[120px] sticky left-0 bg-card z-10">Staff</TableHead>
                                {weekDays.map((day, index) => (
                                    <TableHead key={day} className="text-center min-w-[120px]">
                                        <div className="flex flex-col">
                                            <span>{day.substring(0, 3)}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {weekDates[index].getDate()}/{weekDates[index].getMonth() + 1}
                                            </span>
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staff.length > 0 ? (
                                staff.filter(member => !member.archived).map(member => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-semibold sticky left-0 bg-card z-10">
                                            <div className="text-sm">
                                                <div>{member.name}</div>
                                                <div className="text-xs text-muted-foreground">{member.position}</div>
                                            </div>
                                        </TableCell>
                                        {weekDates.map((date, dayIndex) => {
                                            const dayJobs = getJobsForDate(member.id!, date);
                                            return (
                                                <TableCell key={dayIndex} className="p-1 align-top">
                                                    <div className="space-y-1 min-h-[200px]">
                                                        {dayJobs.map(job => (
                                                            <div key={job.id} className="p-2 rounded-md bg-blue-100 text-blue-900 text-xs border">
                                                                <div className="font-semibold truncate">{job.clientName}</div>
                                                                <div className="text-xs opacity-75">
                                                                    {job.time} - {calculateEndTime(job.time, job.estimatedDuration || 120)}
                                                                </div>
                                                                <div className="text-xs opacity-75">
                                                                    Duration: {formatDuration(job.estimatedDuration || 120)}
                                                                </div>
                                                                <div className="text-xs truncate mt-1">{job.description}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                        No staff members found. Add staff members to see the schedule.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                {/* Legend */}
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-100 border rounded"></div>
                        <span>Scheduled Job</span>
                    </div>
                    <div className="text-xs">
                        Total scheduled jobs this week: {jobs.filter(job => job.status === 'Scheduled').length}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
