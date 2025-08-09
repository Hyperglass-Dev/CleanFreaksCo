'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Users, 
  Calendar,
  X
} from 'lucide-react';
import { getJobs, getInvoices, getClients } from '@/lib/data';

interface Notification {
  id: string;
  type: 'urgent' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  action?: {
    label: string;
    href: string;
  };
  read: boolean;
}

export function NotificationsCard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateNotifications();
  }, []);

  const generateNotifications = async () => {
    try {
      const [jobs, invoices, clients] = await Promise.all([
        getJobs(),
        getInvoices(),
        getClients()
      ]);

      const newNotifications: Notification[] = [];

      // Today's jobs
      const today = new Date().toDateString();
      const todaysJobs = jobs.filter(job => 
        new Date(job.date).toDateString() === today
      );

      if (todaysJobs.length > 0) {
        newNotifications.push({
          id: 'todays-jobs',
          type: 'info',
          title: `${todaysJobs.length} Job${todaysJobs.length > 1 ? 's' : ''} Today`,
          message: `You have ${todaysJobs.length} cleaning appointment${todaysJobs.length > 1 ? 's' : ''} scheduled for today.`,
          timestamp: new Date().toISOString(),
          action: {
            label: 'View Schedule',
            href: '/scheduling'
          },
          read: false
        });
      }

      // Overdue invoices
      const overdueInvoices = invoices.filter(invoice => {
        const dueDate = new Date(invoice.dueDate);
        return invoice.status === 'Pending' && dueDate < new Date();
      });

      if (overdueInvoices.length > 0) {
        newNotifications.push({
          id: 'overdue-invoices',
          type: 'urgent',
          title: `${overdueInvoices.length} Overdue Invoice${overdueInvoices.length > 1 ? 's' : ''}`,
          message: `${overdueInvoices.length} invoice${overdueInvoices.length > 1 ? 's are' : ' is'} past due and need${overdueInvoices.length === 1 ? 's' : ''} attention.`,
          timestamp: new Date().toISOString(),
          action: {
            label: 'Review Invoices',
            href: '/bookkeeping'
          },
          read: false
        });
      }

      // Unscheduled jobs
      const unscheduledJobs = jobs.filter(job => job.status === 'Unscheduled');
      if (unscheduledJobs.length > 0) {
        newNotifications.push({
          id: 'unscheduled-jobs',
          type: 'warning',
          title: `${unscheduledJobs.length} Unscheduled Job${unscheduledJobs.length > 1 ? 's' : ''}`,
          message: `${unscheduledJobs.length} job${unscheduledJobs.length > 1 ? 's need' : ' needs'} to be scheduled.`,
          timestamp: new Date().toISOString(),
          action: {
            label: 'Schedule Jobs',
            href: '/scheduling'
          },
          read: false
        });
      }

      // New client milestone
      if (clients.length > 0 && clients.length % 10 === 0) {
        newNotifications.push({
          id: 'client-milestone',
          type: 'success',
          title: 'Client Milestone! 🎉',
          message: `Congratulations! You now have ${clients.length} clients in your business.`,
          timestamp: new Date().toISOString(),
          action: {
            label: 'View Clients',
            href: '/clients'
          },
          read: false
        });
      }

      // Upcoming jobs tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowsJobs = jobs.filter(job => 
        new Date(job.date).toDateString() === tomorrow.toDateString()
      );

      if (tomorrowsJobs.length > 0) {
        newNotifications.push({
          id: 'tomorrows-jobs',
          type: 'info',
          title: `${tomorrowsJobs.length} Job${tomorrowsJobs.length > 1 ? 's' : ''} Tomorrow`,
          message: `Don't forget about your ${tomorrowsJobs.length} appointment${tomorrowsJobs.length > 1 ? 's' : ''} tomorrow.`,
          timestamp: new Date().toISOString(),
          action: {
            label: 'View Schedule',
            href: '/scheduling'
          },
          read: false
        });
      }

      // Daily encouragement
      const encouragements = [
        "You're building something amazing! Every client served is a step toward your dreams.",
        "Your dedication to quality cleaning is making homes and lives better every day.",
        "Remember to take breaks and celebrate your hard work - you deserve it!",
        "Your business is growing because of your passion and commitment.",
        "Take a moment to appreciate how far you've come in your entrepreneurial journey."
      ];

      const todayEncouragement = encouragements[new Date().getDate() % encouragements.length];
      
      newNotifications.push({
        id: 'daily-encouragement',
        type: 'success',
        title: 'Daily Inspiration 💪',
        message: todayEncouragement,
        timestamp: new Date().toISOString(),
        read: false
      });

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error generating notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Stay updated with your business alerts and reminders
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : getNotificationBadgeColor(notification.type)
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      {notification.action && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto mt-2"
                          asChild
                        >
                          <a href={notification.action.href}>
                            {notification.action.label} →
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-semibold mb-2">All caught up!</h3>
                  <p className="text-sm text-muted-foreground">
                    No new notifications at the moment.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
