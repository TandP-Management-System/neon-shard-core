import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Breadcrumb from '@/components/Breadcrumb';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const CollegeManagement = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const { colleges, addCollege, updateCollege, deleteCollege } = useData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<any>(null);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [newCollege, setNewCollege] = useState({
    name: '',
    code: '',
    domain: '',
    contact: '',
    plan: 'Standard' as 'Standard' | 'Premium' | 'Enterprise',
    status: 'Active' as 'Active' | 'Inactive',
    departments: 0,
    students: 0,
    jobs: 0,
  });

  const handleAddCollege = () => {
    if (!newCollege.name || !newCollege.code || !newCollege.domain || !newCollege.contact) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    addCollege(newCollege);
    setNewCollege({
      name: '',
      code: '',
      domain: '',
      contact: '',
      plan: 'Standard',
      status: 'Active',
      departments: 0,
      students: 0,
      jobs: 0,
    });
    setDialogOpen(false);
    toast({ title: 'Success', description: 'College added successfully' });
  };

  const handleUpdateCollege = () => {
    if (!editingCollege) return;
    updateCollege(editingCollege.id, editingCollege);
    setEditingCollege(null);
    setDialogOpen(false);
    toast({ title: 'Success', description: 'College updated successfully' });
  };

  const handleDeleteCollege = (id: string) => {
    deleteCollege(id);
    toast({ title: 'Success', description: 'College deleted successfully' });
  };

  const openEditDialog = (college: any) => {
    setEditingCollege(college);
    setDialogOpen(true);
  };

  const openDetailDialog = (college: any) => {
    setSelectedCollege(college);
    setDetailDialogOpen(true);
  };

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         college.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         college.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || college.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6 space-y-6">
        <Breadcrumb />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">College Management</h1>
            <p className="text-muted-foreground">Manage all registered colleges and institutions</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className={theme === 'neon' ? 'neon-glow' : ''}
                onClick={() => {
                  setEditingCollege(null);
                  setNewCollege({
                    name: '',
                    code: '',
                    domain: '',
                    contact: '',
                    plan: 'Standard',
                    status: 'Active',
                    departments: 0,
                    students: 0,
                    jobs: 0,
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add College
              </Button>
            </DialogTrigger>
            <DialogContent className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} max-w-2xl`}>
              <DialogHeader>
                <DialogTitle>{editingCollege ? 'Edit College' : 'Add New College'}</DialogTitle>
                <DialogDescription>
                  {editingCollege ? 'Update college information' : 'Register a new college in the system'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="college-name">College Name *</Label>
                  <Input
                    id="college-name"
                    placeholder="XYZ Institute of Technology"
                    value={editingCollege ? editingCollege.name : newCollege.name}
                    onChange={(e) =>
                      editingCollege
                        ? setEditingCollege({ ...editingCollege, name: e.target.value })
                        : setNewCollege({ ...newCollege, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="college-code">College Code *</Label>
                  <Input
                    id="college-code"
                    placeholder="XYZ-001"
                    value={editingCollege ? editingCollege.code : newCollege.code}
                    onChange={(e) =>
                      editingCollege
                        ? setEditingCollege({ ...editingCollege, code: e.target.value })
                        : setNewCollege({ ...newCollege, code: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="college-domain">Domain *</Label>
                  <Input
                    id="college-domain"
                    placeholder="xyz.edu.in"
                    value={editingCollege ? editingCollege.domain : newCollege.domain}
                    onChange={(e) =>
                      editingCollege
                        ? setEditingCollege({ ...editingCollege, domain: e.target.value })
                        : setNewCollege({ ...newCollege, domain: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="college-contact">Contact Email *</Label>
                  <Input
                    id="college-contact"
                    type="email"
                    placeholder="tpo@xyz.edu.in"
                    value={editingCollege ? editingCollege.contact : newCollege.contact}
                    onChange={(e) =>
                      editingCollege
                        ? setEditingCollege({ ...editingCollege, contact: e.target.value })
                        : setNewCollege({ ...newCollege, contact: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="college-plan">Subscription Plan</Label>
                  <Select
                    value={editingCollege ? editingCollege.plan : newCollege.plan}
                    onValueChange={(value) =>
                      editingCollege
                        ? setEditingCollege({ ...editingCollege, plan: value })
                        : setNewCollege({ ...newCollege, plan: value as any })
                    }
                  >
                    <SelectTrigger id="college-plan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="college-status">Status</Label>
                  <Select
                    value={editingCollege ? editingCollege.status : newCollege.status}
                    onValueChange={(value) =>
                      editingCollege
                        ? setEditingCollege({ ...editingCollege, status: value })
                        : setNewCollege({ ...newCollege, status: value as any })
                    }
                  >
                    <SelectTrigger id="college-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={editingCollege ? handleUpdateCollege : handleAddCollege}>
                  {editingCollege ? 'Update College' : 'Add College'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className={`p-4 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search colleges by name, code, or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Colleges Table */}
        <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Registered Colleges</h2>
            <Badge variant="outline">{filteredColleges.length} Colleges</Badge>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>College Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Departments</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColleges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No colleges found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredColleges.map((college) => (
                    <TableRow key={college.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{college.name}</TableCell>
                      <TableCell>{college.code}</TableCell>
                      <TableCell>{college.domain}</TableCell>
                      <TableCell>{college.departments}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            college.plan === 'Enterprise'
                              ? 'bg-purple-500/10 text-purple-500 border-purple-500/30'
                              : college.plan === 'Premium'
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                              : 'bg-gray-500/10 text-gray-500 border-gray-500/30'
                          }
                        >
                          {college.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            college.status === 'Active'
                              ? 'bg-green-500/10 text-green-500 border-green-500/30'
                              : 'bg-red-500/10 text-red-500 border-red-500/30'
                          }
                        >
                          {college.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openDetailDialog(college)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(college)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteCollege(college.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* College Detail Modal */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} max-w-3xl`}>
            <DialogHeader>
              <DialogTitle>{selectedCollege?.name}</DialogTitle>
              <DialogDescription>College Details and Statistics</DialogDescription>
            </DialogHeader>
            {selectedCollege && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">College Code</Label>
                    <p className="font-medium">{selectedCollege.code}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Domain</Label>
                    <p className="font-medium">{selectedCollege.domain}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contact Email</Label>
                    <p className="font-medium">{selectedCollege.contact}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Subscription Plan</Label>
                    <Badge variant="outline" className="mt-1">
                      {selectedCollege.plan}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{selectedCollege.departments}</p>
                    <p className="text-sm text-muted-foreground">Departments</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-secondary">{selectedCollege.students}</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-accent">{selectedCollege.jobs}</p>
                    <p className="text-sm text-muted-foreground">Active Jobs</p>
                  </Card>
                </div>

                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className={
                        selectedCollege.status === 'Active'
                          ? 'bg-green-500/10 text-green-500 border-green-500/30'
                          : 'bg-red-500/10 text-red-500 border-red-500/30'
                      }
                    >
                      {selectedCollege.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        updateCollege(selectedCollege.id, {
                          status: selectedCollege.status === 'Active' ? 'Inactive' : 'Active',
                        });
                        setSelectedCollege({
                          ...selectedCollege,
                          status: selectedCollege.status === 'Active' ? 'Inactive' : 'Active',
                        });
                      }}
                    >
                      Toggle Status
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CollegeManagement;
