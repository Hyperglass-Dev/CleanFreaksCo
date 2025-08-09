
import type { Cleaner, Job, Client, Kpi, NavLink, Invoice, Bill, Quote, CompanySettings } from '@/lib/types';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  BellRing,
  Settings,
  Receipt,
  FileWarning,
  DollarSign,
  BookOpen,
} from 'lucide-react';

export const navLinks: NavLink[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scheduling', label: 'Scheduling', icon: Calendar },
  { href: '/bookkeeping', label: 'Bookkeeping', icon: Receipt },
  { href: '/run-sheet', label: 'Run Sheet', icon: ClipboardList },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/reminders', label: 'Reminders', icon: BellRing },
  { href: '/settings', label: 'Settings', icon: Settings },
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
    title: 'Pending Invoices',
    value: '$2,350',
    change: '3 overdue',
    changeType: 'increase',
    icon: Receipt,
  },
  {
    title: 'Bills to Pay',
    value: '$850',
    change: '2 upcoming',
    changeType: 'increase',
    icon: FileWarning,
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

export const invoices: Invoice[] = [
    { id: 'inv-1', clientName: 'Maplewood Inc.', amount: 1200, dueDate: '2024-08-15', status: 'Pending' },
    { id: 'inv-2', clientName: 'Pinecrest Apartments', amount: 750, dueDate: '2024-07-20', status: 'Paid' },
    { id: 'inv-3', clientName: 'Cedar Retail', amount: 400, dueDate: '2024-07-10', status: 'Overdue' },
    { id: 'inv-4', clientName: 'Birch Home', amount: 1150, dueDate: '2024-08-01', status: 'Pending' },
];

export const bills: Bill[] = [
    { id: 'bill-1', supplierName: 'Cleaning Supplies Co.', amount: 350, dueDate: '2024-08-10', status: 'Unpaid' },
    { id: 'bill-2', supplierName: 'Vehicle Maintenance Inc.', amount: 500, dueDate: '2024-08-20', status: 'Unpaid' },
    { id: 'bill-3', supplierName: 'Uniform Providers', amount: 250, dueDate: '2024-07-25', status: 'Paid' },
];

export const quotes: Quote[] = [
    { id: 'quote-1', clientName: 'Willow Creek Bistro', amount: 800, expiryDate: '2024-08-15', status: 'Sent' },
    { id: 'quote-2', clientName: 'Elm Tech Park', amount: 2500, expiryDate: '2024-08-20', status: 'Draft' },
    { id: 'quote-3', clientName: 'Spruce Industries', amount: 1800, expiryDate: '2024-07-25', status: 'Accepted' },
];

// Mock company settings data
export const companySettings: CompanySettings = {
    name: 'Clean Freaks Co',
    abn: '12 345 678 901',
    address: '123 Cleaning Ave, Sydney NSW 2000',
    phone: '02 9876 5432',
    email: 'contact@cleanfreaks.co',
    website: 'https://cleanfreaks.co',
    logo: 'https://placehold.co/150x150.png',
    bankDetails: 'Bank: Example Bank\nAccount Name: Clean Freaks Co\nBSB: 123-456\nAccount: 12345678',
};
