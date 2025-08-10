
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cleaners, jobs } from "@/lib/data";
import { cn } from "@/lib/utils";

const timeSlots = ["7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM"];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getJobForSlot = (cleanerId: string, dayIndex: number, time: string) => {
    // This is a mock implementation. A real app would parse dates and times.
    const job = jobs.find(j => 
        j.cleanerIds?.includes(cleanerId) && 
        j.time.startsWith(time.split(' ')[0])
    );
    if(job && (job.id === 'job-1' && dayIndex === 0 && time === '9 AM')) return job;
    if(job && (job.id === 'job-4' && dayIndex === 1 && time === '10 AM')) return job;
    return null;
}

export function SchedulingCalendar() {
    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[150px] sticky left-0 bg-card z-10">Cleaner</TableHead>
                                {weekDays.map(day => <TableHead key={day}>{day}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cleaners.map(cleaner => (
                                <TableRow key={cleaner.id}>
                                    <TableCell className="font-semibold sticky left-0 bg-card z-10">{cleaner.name}</TableCell>
                                    {weekDays.map((day, dayIndex) => (
                                        <TableCell key={day} className="p-0 align-top">
                                            <div className="grid grid-rows-13">
                                                {timeSlots.map(time => {
                                                    const job = getJobForSlot(cleaner.id, dayIndex, time);
                                                    return (
                                                        <div key={time} className="h-24 p-1 border-b border-t border-dashed border-border/50 text-xs">
                                                            {job && (
                                                                <div className="h-full p-2 rounded-md bg-secondary text-secondary-foreground text-pretty">
                                                                    <p className="font-bold truncate">{job.clientName}</p>
                                                                    <p className="text-wrap">{job.description}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
