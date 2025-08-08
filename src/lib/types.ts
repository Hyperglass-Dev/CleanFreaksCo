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
