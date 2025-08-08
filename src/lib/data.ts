import type { Cleaner, Job, Client, Kpi, NavLink } from '@/lib/types';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  BellRing,
  FileText,
  DollarSign,
  BookOpen,
  UserCheck,
  Sparkles,
  UserPlus
} from 'lucide-react';

export const navLinks: NavLink[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scheduling', label: 'Scheduling', icon: Calendar },
  { href: '/run-sheet', label: 'Run Sheet', icon: ClipboardList },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/reminders', label: 'Reminders', icon: BellRing },
  { href: '/quote', label: 'Request Quote', icon: FileText },
];

export const cleaners: Cleaner[] = [
  {
    id: 'cleaner-1',
    name: 'Ana Silva',
    skills: ['Deep Cleaning', 'Window Washing', 'Carpet Cleaning'],
    location: 'Downtown',
    availability: 'Mon-Fri 9am-5pm',
    avatar: 'https://i.pravatar.cc/150?u=cleaner-1',
  },
  {
    id: 'cleaner-2',
    name: 'Ben Carter',
    skills: ['Standard Cleaning', 'Eco-Friendly Cleaning'],
    location: 'North Suburbs',
    availability: 'Mon, Wed, Fri 10am-6pm',
    avatar: 'https://i.pravatar.cc/150?u=cleaner-2',
  },
  {
    id: 'cleaner-3',
    name: 'Carlos Diaz',
    skills: ['Deep Cleaning', 'Upholstery Cleaning', 'Post-Construction'],
    location: 'Eastside',
    availability: 'Tue-Sat 8am-4pm',
    avatar: 'https://i.pravatar.cc/150?u=cleaner-3',
  },
  {
    id: 'cleaner-4',
    name: 'Diana Evans',
    skills: ['Standard Cleaning', 'Window Washing'],
    location: 'West End',
    availability: 'Mon-Thu 9am-3pm',
    avatar: 'https://i.pravatar.cc/150?u=cleaner-4',
  },
];

export const jobs: Job[] = [
  {
    id: 'job-1',
    clientName: 'Maplewood Inc.',
    address: '123 Oak St, Cityville',
    time: '9:00 AM',
    date: '2024-07-29',
    description: 'Standard office cleaning. Focus on conference rooms.',
    status: 'Scheduled',
    cleanerId: 'cleaner-1',
  },
  {
    id: 'job-2',
    clientName: 'Pinecrest Apartments',
    address: '456 Pine Ave, Cityville',
    time: '11:00 AM',
    date: '2024-07-29',
    description: 'Move-out deep clean for apartment 3B.',
    status: 'In Progress',
    cleanerId: 'cleaner-2',
  },
  {
    id: 'job-3',
    clientName: 'Cedar Retail',
    address: '789 Cedar Blvd, Cityville',
    time: '2:00 PM',
    date: '2024-07-29',
    description: 'Weekly retail space cleaning. High-traffic areas.',
    status: 'Completed',
    cleanerId: 'cleaner-3'
  },
  {
    id: 'job-4',
    clientName: 'Birch Home',
    address: '101 Birch Ln, Suburbia',
    time: '10:00 AM',
    date: '2024-07-30',
    description: 'Residential deep clean. 3 bed, 2 bath.',
    status: 'Scheduled',
    cleanerId: 'cleaner-4',
  },
  {
    id: 'job-5',
    clientName: 'Willow Creek Bistro',
    address: '212 Willow Way, Cityville',
    time: 'N/A',
    date: 'N/A',
    description: 'Emergency cleanup after event. Requires two cleaners.',
    status: 'Unscheduled',
  },
  {
    id: 'job-6',
    clientName: 'Elm Tech Park',
    address: '333 Elm Rd, Tech City',
    time: 'N/A',
    date: 'N/A',
    description: 'Post-construction cleaning for new office wing.',
    status: 'Unscheduled',
  },
];

export const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Maplewood Inc.',
    email: 'contact@maplewood.com',
    phone: '555-0101',
    avatar: 'https://i.pravatar.cc/150?u=client-1',
    upcomingJobs: 1,
    totalSpent: 4500,
  },
  {
    id: 'client-2',
    name: 'Pinecrest Apartments',
    email: 'manager@pinecrest.com',
    phone: '555-0102',
    avatar: 'https://i.pravatar.cc/150?u=client-2',
    upcomingJobs: 3,
    totalSpent: 12000,
  },
  {
    id: 'client-3',
    name: 'Cedar Retail',
    email: 'store@cedarretail.com',
    phone: '555-0103',
    avatar: 'https://i.pravatar.cc/150?u=client-3',
    upcomingJobs: 4,
    totalSpent: 8500,
  },
  {
    id: 'client-4',
    name: 'Birch Home',
    email: 'hello@birchhome.com',
    phone: '555-0104',
    avatar: 'https://i.pravatar.cc/150?u=client-4',
    upcomingJobs: 1,
    totalSpent: 1200,
  },
];

export const kpis: Kpi[] = [
  {
    title: 'Revenue',
    value: '$12,450',
    change: '+11.2%',
    changeType: 'increase',
    icon: DollarSign,
  },
  {
    title: 'Bookings',
    value: '82',
    change: '+5.1%',
    changeType: 'increase',
    icon: BookOpen,
  },
  {
    title: 'Staff Utilization',
    value: '88%',
    change: '-1.5%',
    changeType: 'decrease',
    icon: UserCheck,
  },
  {
    title: 'New Clients',
    value: '7',
    change: '+2',
    changeType: 'increase',
    icon: UserPlus,
  },
];

export const revenueData = [
  { month: 'Jan', revenue: 8200 },
  { month: 'Feb', revenue: 9600 },
  { month: 'Mar', revenue: 11200 },
  { month: 'Apr', revenue: 10500 },
  { month: 'May', revenue: 13100 },
  { month: 'Jun', revenue: 12450 },
];

export const bookingsData = [
    { service: 'Standard', bookings: 45, fill: 'hsl(var(--chart-1))' },
    { service: 'Deep Clean', bookings: 25, fill: 'hsl(var(--chart-2))' },
    { service: 'Windows', bookings: 12, fill: 'hsl(var(--chart-3))' },
    { service: 'Carpet', bookings: 8, fill: 'hsl(var(--chart-4))' },
    { service: 'Other', bookings: 5, fill: 'hsl(var(--chart-5))' },
];
