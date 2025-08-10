
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
import { getStaff, addStaff, updateStaff, deleteStaff, archiveStaff, initializeDijanaAsStaff } from '@/lib/data';
import { MoreHorizontal, PlusCircle, Trash2, Archive } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Staff } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { StaffDialog } from '@/components/staff-dialog';
import { useToast } from '@/hooks/use-toast';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadStaff = async () => {
      try {
        // Initialize Dijana as staff if not already present
        await initializeDijanaAsStaff();
        
        const staffData = await getStaff();
        setStaff(staffData);
      } catch (error) {
        console.error('Error loading staff:', error);
        toast({ title: "Error", description: "Failed to load staff.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, [toast]);

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setIsDialogOpen(true);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsDialogOpen(true);
  };

  const handleSaveStaff = async (staffMember: Staff) => {
    try {
      if (staffMember.id) {
        // Edit existing staff
        await updateStaff(staffMember.id, staffMember);
        setStaff(staff.map(s => s.id === staffMember.id ? staffMember : s));
        toast({ title: "Staff Updated", description: `${staffMember.name}'s details have been updated.`});
      } else {
        // Add new staff
        const newStaffId = await addStaff(staffMember);
        const newStaff = { ...staffMember, id: newStaffId };
        setStaff([...staff, newStaff]);
        toast({ title: "Staff Added", description: `${staffMember.name} has been added to your team.`});
      }
    } catch (error) {
      console.error('Error saving staff:', error);
      toast({ title: "Error", description: "Failed to save staff member.", variant: "destructive" });
    }
  };

  const handleArchiveStaff = async (staffMember: Staff) => {
    try {
      if (staffMember.id) {
        await archiveStaff(staffMember.id);
        setStaff(staff.filter(s => s.id !== staffMember.id));
        toast({ title: "Staff Archived", description: `${staffMember.name} has been archived.`});
      }
    } catch (error) {
      console.error('Error archiving staff:', error);
      toast({ title: "Error", description: "Failed to archive staff member.", variant: "destructive" });
    }
  };

  const handleDeleteStaff = async (staffMember: Staff) => {
    try {
      if (staffMember.id && confirm(`Are you sure you want to permanently delete ${staffMember.name}? This action cannot be undone.`)) {
        await deleteStaff(staffMember.id);
        setStaff(staff.filter(s => s.id !== staffMember.id));
        toast({ title: "Staff Deleted", description: `${staffMember.name} has been deleted.`});
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast({ title: "Error", description: "Failed to delete staff member.", variant: "destructive" });
    }
  };
  
  return (
    <>
      <PageHeader title="Staff Members">
        <Button onClick={handleAddStaff}>
          <PlusCircle className="mr-2" />
          Add Staff
        </Button>
      </PageHeader>
      <Card className="shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="hidden md:table-cell">Skills</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Loading staff...
                  </TableCell>
                </TableRow>
              ) : staff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No staff members found. Add your first team member to get started.
                  </TableCell>
                </TableRow>
              ) : (
                staff.map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                        {member.suburb && (
                           <div className="text-xs text-muted-foreground">{member.suburb}</div>
                         )}
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.position === 'Owner/Manager' ? 'default' : member.position === 'Staff' ? 'secondary' : 'outline'}>
                      {member.position}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                     <div className="flex flex-wrap gap-1">
                        {member.skills.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                     </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditStaff(member)}>
                      Edit Staff
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                      View Schedule
                      </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchiveStaff(member)}>
                           <Archive className="w-4 h-4 mr-2" />
                           Archive
                         </DropdownMenuItem>
                         <DropdownMenuItem 
                           onClick={() => handleDeleteStaff(member)}
                           className="text-red-600 focus:text-red-600"
                         >
                           <Trash2 className="w-4 h-4 mr-2" />
                           Delete
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
      <StaffDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        staff={selectedStaff}
        onSave={handleSaveStaff}
      />
    </>
  );
}
