'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  Settings,
  LogOut,
  Star,
  CheckCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Mock data for customer bookings
const customerBookings = [
  {
    id: '1',
    date: '2024-01-15',
    time: '09:00 AM',
    service: 'Regular Cleaning',
    cleaner: 'Ana Silva',
    status: 'confirmed',
    address: '123 Main St, Melbourne VIC'
  },
  {
    id: '2',
    date: '2024-01-22',
    time: '10:30 AM',
    service: 'Deep Cleaning',
    cleaner: 'Ben Carter',
    status: 'pending',
    address: '123 Main St, Melbourne VIC'
  }
];

export default function CustomerDashboard() {
  const { user, signOut } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState(customerBookings);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-sm text-muted-foreground">Clean Freaks Co - Manage your cleaning schedule</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Plus className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Book Cleaning</h3>
            <p className="text-sm text-muted-foreground">Schedule new service</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">View Schedule</h3>
            <p className="text-sm text-muted-foreground">See all bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Cleanings
          </CardTitle>
          <CardDescription>Your scheduled cleaning appointments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
                <div className="text-right">
                  <p className="font-semibold">{new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">{booking.time}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{booking.service}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{booking.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Cleaner: {booking.cleaner}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Reschedule
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Contact Cleaner
                </Button>
              </div>
            </div>
          ))}
          
          {upcomingBookings.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-semibold mb-2">No upcoming cleanings</h3>
              <p className="text-sm text-muted-foreground mb-4">Book your first cleaning to get started</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Book Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Get in touch with Clean Freaks Co</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="tel:+61400000000">
              <Phone className="w-4 h-4 mr-2" />
              Call Us
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="mailto:support@cleanfreaks.co">
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
