import type { LucideIcon } from 'lucide-react';

export interface Cleaner {
  id: string;
  name: string;
  skills: string[];
  location: string;
  availability: string;
  avatar: string;
}

export interface Job {
  id: string;
  clientName: string;
  address: string;
  time: string;
  date: string;
  description: string;
  status: 'Unscheduled' | 'Scheduled' | 'In Progress' | 'Completed';
  cleanerId?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  upcomingJobs: number;
  totalSpent: number;
}

export interface Kpi {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
}

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface Invoice {
    id: string;
    clientName: string;
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Bill {
    id: string;
    supplierName: string;
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Unpaid';
}
