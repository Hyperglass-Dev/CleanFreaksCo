import type { Cleaner, Staff, Job, Client, Kpi, NavLink, Invoice, Bill, Quote, CompanySettings } from '@/lib/types';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  Settings,
  Receipt,
  FileWarning,
  DollarSign,
  BookOpen,
  Bot,
  User,
  Users2,
} from 'lucide-react';

export const navLinks: NavLink[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scheduling', label: 'Scheduling', icon: Calendar },
  { href: '/bookkeeping', label: 'Bookkeeping', icon: Receipt },
  { href: '/run-sheet', label: 'Run Sheet', icon: ClipboardList },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/staff', label: 'Staff', icon: Users2 },
  { href: '/assistant', label: 'Assistant', icon: Bot },
  { href: '/settings', label: 'Settings', icon: Settings },
];

// Firebase collection names
const COLLECTIONS = {
  cleaners: 'cleaners',
  staff: 'staff',
  jobs: 'jobs',
  clients: 'clients',
  invoices: 'invoices',
  bills: 'bills',
  quotes: 'quotes',
  settings: 'settings',
  kpis: 'kpis'
} as const;

// Helper function to convert Firestore Timestamp to date string
const timestampToDateString = (timestamp: any): string => {
  if (!timestamp) return '';
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString().split('T')[0];
  }
  return timestamp;
};

// CLEANERS/STAFF FUNCTIONS
export const getCleaners = async (): Promise<Cleaner[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.cleaners));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      avatar: doc.data().avatar || `https://ui-avatars.io/api/?name=${encodeURIComponent(doc.data().name || 'User')}&background=E6E6FA&color=800000`
    })) as Cleaner[];
  } catch (error) {
    console.error('Error fetching cleaners:', error);
    return [];
  }
};

export const addCleaner = async (cleaner: Omit<Cleaner, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.cleaners), {
      ...cleaner,
      avatar: cleaner.avatar || `https://ui-avatars.io/api/?name=${encodeURIComponent(cleaner.name)}&background=E6E6FA&color=800000`,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding cleaner:', error);
    throw error;
  }
};

export const updateCleaner = async (id: string, updates: Partial<Cleaner>): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.cleaners, id), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating cleaner:', error);
    throw error;
  }
};

export const deleteCleaner = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.cleaners, id));
  } catch (error) {
    console.error('Error deleting cleaner:', error);
    throw error;
  }
};

// STAFF FUNCTIONS
export const getStaff = async (): Promise<Staff[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.staff));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      avatar: doc.data().avatar || `https://ui-avatars.io/api/?name=${encodeURIComponent(doc.data().name || 'User')}&background=E6E6FA&color=800000`
    })) as Staff[];
  } catch (error) {
    console.error('Error fetching staff:', error);
    return [];
  }
};

export const addStaff = async (staff: Omit<Staff, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.staff), {
      ...staff,
      avatar: staff.avatar || `https://ui-avatars.io/api/?name=${encodeURIComponent(staff.name)}&background=E6E6FA&color=800000`,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding staff:', error);
    throw error;
  }
};

export const updateStaff = async (id: string, updates: Partial<Staff>): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.staff, id), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
};

export const deleteStaff = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.staff, id));
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
};

export const initializeDijanaAsStaff = async (): Promise<void> => {
  try {
    // Check if Dijana already exists in staff
    const staffSnapshot = await getDocs(
      query(collection(db, COLLECTIONS.staff), where('email', '==', 'dijanatodorovic88@gmail.com'))
    );
    
    if (staffSnapshot.empty) {
      // Add Dijana as Owner/Manager
      const dijanaStaff: Omit<Staff, 'id'> = {
        name: 'Dijana Todorovic',
        email: 'dijanatodorovic88@gmail.com',
        position: 'Owner/Manager',
        skills: ['Business Management', 'Operations', 'Customer Service', 'Quality Control'],
        location: 'Sydney',
        availability: 'Mon-Fri 8am-6pm',
        avatar: `https://ui-avatars.io/api/?name=${encodeURIComponent('Dijana Todorovic')}&background=E6E6FA&color=800000`,
        phone: ''
      };
      
      await addStaff(dijanaStaff);
      console.log('Dijana added to staff system as Owner/Manager');
    }
  } catch (error) {
    console.error('Error initializing Dijana as staff:', error);
  }
};

// JOB FUNCTIONS
export const getJobs = async (): Promise<Job[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.jobs), orderBy('date', 'desc'))
    );
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: timestampToDateString(data.date),
      } as Job;
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

export const addJob = async (job: Omit<Job, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.jobs), {
      ...job,
      date: job.date ? Timestamp.fromDate(new Date(job.date)) : null,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding job:', error);
    throw error;
  }
};

export const updateJob = async (id: string, updates: Partial<Job>): Promise<void> => {
  try {
    const updateData: any = { ...updates };
    if (updates.date) {
      updateData.date = Timestamp.fromDate(new Date(updates.date));
    }
    await updateDoc(doc(db, COLLECTIONS.jobs, id), {
      ...updateData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.jobs, id));
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// CLIENT FUNCTIONS
export const getClients = async (): Promise<Client[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.clients));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      avatar: doc.data().avatar || `https://ui-avatars.io/api/?name=${encodeURIComponent(doc.data().name || 'Client')}&background=F8BBD0&color=800000`
    })) as Client[];
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
};

export const addClient = async (client: Omit<Client, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.clients), {
      ...client,
      avatar: client.avatar || `https://ui-avatars.io/api/?name=${encodeURIComponent(client.name)}&background=F8BBD0&color=800000`,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding client:', error);
    throw error;
  }
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.clients, id), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.clients, id));
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

// INVOICE FUNCTIONS
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.invoices), orderBy('dueDate', 'desc'))
    );
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dueDate: timestampToDateString(data.dueDate),
      } as Invoice;
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};

export const addInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.invoices), {
      ...invoice,
      dueDate: Timestamp.fromDate(new Date(invoice.dueDate)),
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding invoice:', error);
    throw error;
  }
};

export const updateInvoice = async (id: string, updates: Partial<Invoice>): Promise<void> => {
  try {
    const updateData: any = { ...updates };
    if (updates.dueDate) {
      updateData.dueDate = Timestamp.fromDate(new Date(updates.dueDate));
    }
    await updateDoc(doc(db, COLLECTIONS.invoices, id), {
      ...updateData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

export const deleteInvoice = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.invoices, id));
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};

// BILL FUNCTIONS
export const getBills = async (): Promise<Bill[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.bills), orderBy('dueDate', 'desc'))
    );
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dueDate: timestampToDateString(data.dueDate),
      } as Bill;
    });
  } catch (error) {
    console.error('Error fetching bills:', error);
    return [];
  }
};

export const addBill = async (bill: Omit<Bill, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.bills), {
      ...bill,
      dueDate: Timestamp.fromDate(new Date(bill.dueDate)),
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding bill:', error);
    throw error;
  }
};

export const updateBill = async (id: string, updates: Partial<Bill>): Promise<void> => {
  try {
    const updateData: any = { ...updates };
    if (updates.dueDate) {
      updateData.dueDate = Timestamp.fromDate(new Date(updates.dueDate));
    }
    await updateDoc(doc(db, COLLECTIONS.bills, id), {
      ...updateData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating bill:', error);
    throw error;
  }
};

export const deleteBill = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.bills, id));
  } catch (error) {
    console.error('Error deleting bill:', error);
    throw error;
  }
};

// QUOTE FUNCTIONS
export const getQuotes = async (): Promise<Quote[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.quotes), orderBy('expiryDate', 'desc'))
    );
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        expiryDate: timestampToDateString(data.expiryDate),
      } as Quote;
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
};

export const addQuote = async (quote: Omit<Quote, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.quotes), {
      ...quote,
      expiryDate: Timestamp.fromDate(new Date(quote.expiryDate)),
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding quote:', error);
    throw error;
  }
};

export const updateQuote = async (id: string, updates: Partial<Quote>): Promise<void> => {
  try {
    const updateData: any = { ...updates };
    if (updates.expiryDate) {
      updateData.expiryDate = Timestamp.fromDate(new Date(updates.expiryDate));
    }
    await updateDoc(doc(db, COLLECTIONS.quotes, id), {
      ...updateData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    throw error;
  }
};

export const deleteQuote = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.quotes, id));
  } catch (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }
};

// COMPANY SETTINGS FUNCTIONS
export const getCompanySettings = async (): Promise<CompanySettings | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.settings, 'company');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as CompanySettings;
    }
    
    // Return default settings if none exist
    const defaultSettings: CompanySettings = {
      name: 'Clean Freaks Co',
      abn: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      logo: '',
      bankDetails: '',
    };
    
    await updateDoc(docRef, defaultSettings as any);
    return defaultSettings;
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return null;
  }
};

export const updateCompanySettings = async (settings: CompanySettings): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.settings, 'company');
    const updateData: any = {
      ...settings,
      updatedAt: Timestamp.now()
    };
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating company settings:', error);
    throw error;
  }
};

// KPI FUNCTIONS - Calculate from real data
export const calculateKpis = async (): Promise<Kpi[]> => {
  try {
    const [invoicesSnapshot, billsSnapshot, jobsSnapshot] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.invoices)),
      getDocs(collection(db, COLLECTIONS.bills)),
      getDocs(collection(db, COLLECTIONS.jobs))
    ]);

    const invoices = invoicesSnapshot.docs.map(doc => doc.data() as Invoice);
    const bills = billsSnapshot.docs.map(doc => doc.data() as Bill);
    const jobs = jobsSnapshot.docs.map(doc => doc.data() as Job);

    // Calculate revenue (paid invoices)
    const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    // Calculate pending invoices
    const pendingInvoices = invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue');
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;

    // Calculate bills to pay
    const unpaidBills = bills.filter(bill => bill.status === 'Unpaid');
    const billsAmount = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0);

    // Calculate bookings (completed jobs)
    const completedJobs = jobs.filter(job => job.status === 'Completed');

    return [
      {
        title: 'Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        change: '+11.2%', // This would need historical data to calculate properly
        changeType: 'increase',
        icon: DollarSign,
      },
      {
        title: 'Bookings',
        value: completedJobs.length.toString(),
        change: '+5.1%', // This would need historical data to calculate properly
        changeType: 'increase',
        icon: BookOpen,
      },
      {
        title: 'Pending Invoices',
        value: `$${pendingAmount.toLocaleString()}`,
        change: overdueCount > 0 ? `${overdueCount} overdue` : 'All current',
        changeType: overdueCount > 0 ? 'increase' : 'decrease',
        icon: Receipt,
      },
      {
        title: 'Bills to Pay',
        value: `$${billsAmount.toLocaleString()}`,
        change: `${unpaidBills.length} upcoming`,
        changeType: 'increase',
        icon: FileWarning,
      },
    ];
  } catch (error) {
    console.error('Error calculating KPIs:', error);
    return [];
  }
};

// CHART DATA FUNCTIONS - Calculate from real data
export const getRevenueData = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.invoices), where('status', '==', 'Paid'))
    );
    
    // Group revenue by month
    const revenueByMonth: { [key: string]: number } = {};
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const date = data.dueDate instanceof Timestamp ? data.dueDate.toDate() : new Date(data.dueDate);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!revenueByMonth[monthKey]) {
        revenueByMonth[monthKey] = 0;
      }
      revenueByMonth[monthKey] += data.amount;
    });

    // Convert to chart format
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      revenue: revenueByMonth[month] || 0
    }));
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return [];
  }
};

export const getBookingsData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.jobs));
    
    // Group jobs by service type (extracted from description)
    const serviceTypes: { [key: string]: number } = {
      'Standard': 0,
      'Deep Clean': 0,
      'Windows': 0,
      'Carpet': 0,
      'Other': 0
    };

    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const description = data.description?.toLowerCase() || '';
      
      if (description.includes('deep')) {
        serviceTypes['Deep Clean']++;
      } else if (description.includes('window')) {
        serviceTypes['Windows']++;
      } else if (description.includes('carpet')) {
        serviceTypes['Carpet']++;
      } else if (description.includes('standard')) {
        serviceTypes['Standard']++;
      } else {
        serviceTypes['Other']++;
      }
    });

    return [
      { service: 'Standard', bookings: serviceTypes['Standard'], fill: 'hsl(var(--chart-1))' },
      { service: 'Deep Clean', bookings: serviceTypes['Deep Clean'], fill: 'hsl(var(--chart-2))' },
      { service: 'Windows', bookings: serviceTypes['Windows'], fill: 'hsl(var(--chart-3))' },
      { service: 'Carpet', bookings: serviceTypes['Carpet'], fill: 'hsl(var(--chart-4))' },
      { service: 'Other', bookings: serviceTypes['Other'], fill: 'hsl(var(--chart-5))' },
    ];
  } catch (error) {
    console.error('Error fetching bookings data:', error);
    return [];
  }
};

// Legacy exports for backward compatibility during migration
export const cleaners: Cleaner[] = [];
export const jobs: Job[] = [];
export const clients: Client[] = [];
export const invoices: Invoice[] = [];
export const bills: Bill[] = [];
export const quotes: Quote[] = [];
export const kpis: Kpi[] = [];
export const revenueData: Array<{ month: string; revenue: number }> = [];
export const bookingsData: Array<{ service: string; bookings: number; fill: string }> = [];
export const companySettings: CompanySettings = {
  name: 'Clean Freaks Co',
  abn: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  logo: '',
  bankDetails: '',
};
