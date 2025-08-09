
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getClients, addClient, updateClient } from '@/lib/data';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClientDialog } from '@/components/client-dialog';
import type { Client } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Error loading clients:', error);
        toast({ title: "Error", description: "Failed to load clients.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [toast]);

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleSaveClient = async (client: Client) => {
    try {
      if (client.id) {
        // Edit existing client
        await updateClient(client.id, client);
        setClients(clients.map(c => c.id === client.id ? client : c));
        toast({ title: "Client Updated", description: `${client.name}'s details have been updated.`});
      } else {
        // Add new client
        const newClientData = { ...client, upcomingJobs: 0, totalSpent: 0 };
        const newClientId = await addClient(newClientData);
        const newClient = { ...newClientData, id: newClientId };
        setClients([...clients, newClient]);
        toast({ title: "Client Added", description: `${client.name} has been added to your client list.`});
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast({ title: "Error", description: "Failed to save client.", variant: "destructive" });
    }
  };


  return (
    <>
      <PageHeader title="Clients">
        <Button onClick={handleAddClient}>
          <PlusCircle className="mr-2" />
          Add Client
        </Button>
      </PageHeader>
      <Card className="shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden sm:table-cell text-center">Upcoming Jobs</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Loading clients...
                  </TableCell>
                </TableRow>
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No clients found. Add your first client to get started.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map(client => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={client.avatar} alt={client.name} />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.address}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm text-muted-foreground">{client.email}</div>
                    <div className="text-sm text-muted-foreground">{client.phone}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">{client.upcomingJobs}</TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(client.totalSpent)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClient(client)}>
                          Edit Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={selectedClient}
        onSave={handleSaveClient}
      />
    </>
  );
}
