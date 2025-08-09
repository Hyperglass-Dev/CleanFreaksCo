
'use client';

import { useState } from 'react';
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
import { clients as initialClients } from '@/lib/data';
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
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };

  const handleSaveClient = (client: Client) => {
    if (client.id) {
      // Edit existing client
      setClients(clients.map(c => c.id === client.id ? client : c));
      toast({ title: "Client Updated", description: `${client.name}'s details have been updated.`});
    } else {
      // Add new client
      const newClient = { ...client, id: `client-${clients.length + 1}`, upcomingJobs: 0, totalSpent: 0 };
      setClients([...clients, newClient]);
       toast({ title: "Client Added", description: `${client.name} has been added to your client list.`});
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
              {clients.map(client => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={client.avatar} alt={client.name} />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{client.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm text-muted-foreground">{client.email}</div>
                    <div className="text-sm text-muted-foreground">{client.phone}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">{client.upcomingJobs}</TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(client.totalSpent)}
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
              ))}
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
