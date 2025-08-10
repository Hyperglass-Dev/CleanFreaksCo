
import type { LucideIcon } from 'lucide-react';

export interface Cleaner {
  id: string;
  name: string;
  skills: string[];
  location: string;
  availability: string;
  avatar: string;
}

export interface Staff {
  id?: string;
  name: string;
  email: string;
  position: StaffPosition;
  skills: string[];
  location: string;
  availability: string;
  avatar: string;
  phone?: string;
  address?: string;
  suburb?: string;
  archived?: boolean;
}

export interface Job {
  id: string;
  clientName: string;
  address: string;
  time: string;
  date: string;
  description: string;
  status: 'Unscheduled' | 'Scheduled' | 'In Progress' | 'Completed';
  cleanerIds?: string[];
  estimatedValue?: number;
  quotedPrice?: number;
  estimatedDuration?: number; // Duration in minutes
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  upcomingJobs: number;
  totalSpent: number;
  archived?: boolean;
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

export interface Quote {
    id: string;
    clientName: string;
    amount: number;
    expiryDate: string;
    status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
}

export interface CompanySettings {
    name: string;
    abn: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo: string;
    bankDetails: string;
}

export type UserRole = 'admin' | 'staff' | 'customer';

export type StaffPosition = 'Owner/Manager' | 'Staff' | 'Contractor';

export interface User {
    uid: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    address?: string;
    createdAt: string;
    lastLoginAt?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateUserRole: (uid: string, role: UserRole) => Promise<void>;
}

export interface RevenueData {
    month: string;
    revenue: number;
}



export type PurchaseType = 'Consumable' | 'Plant & Equipment' | 'Office Equipment';

export interface Consumable {
    id?: string;
    name: string;
    type: PurchaseType;
    purchasedFrom: string;
    purchaseAmount: number;
    datePurchased: string;
    createdAt: string;
    createdBy: string;
    receiptPhotoUrl?: string;
    receiptPhotoName?: string;
}

export interface JobRecord {
    id?: string;
    jobId: string;
    clientName: string;
    clientId: string;
    address: string;
    serviceDate: string;
    serviceTime: string;
    description: string;
    staffAssigned: string[];
    priceCharged: number;
    completedAt: string;
    completedBy: string;
    notes?: string;
}

export interface MonthlyGroup<T> {
    month: string;
    year: number;
    items: T[];
    totalAmount?: number;
    itemCount: number;
}
