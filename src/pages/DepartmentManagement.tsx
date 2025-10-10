import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import DashboardLayout from '@/components/DashboardLayout';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Ban } from 'lucide-react';
import { toast } from 'sonner';

const DepartmentManagement = () => {
  const { departmentDetails, colleges, addDepartmentDetail, updateDepartmentDetail } = useData();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    collegeId: '',
    name: '',
    hod: '',
    email: '',
    phone: '',
    students: 0,
    activeJobs: 0,
    status: 'Active' as 'Active' | 'Inactive',
  });

  const filteredDepartments = departmentDetails.filter((dept) => {
    const college = colleges.find(c => c.id === dept.collegeId);
    const matchesSearch = 
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.hod.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async () => {
    if (!formData.collegeId || !formData.name || !formData.hod || !formData.email) {
      toast.error('Please fill all required fields');
      return;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addDepartmentDetail(formData);
    toast.success('Department added successfully');
    setIsAddOpen(false);
    setFormData({
      collegeId: '',
      name: '',
      hod: '',
      email: '',
      phone: '',
      students: 0,
      activeJobs: 0,
      status: 'Active',
    });
  };

  const handleStatusToggle = (dept: any) => {
    updateDepartmentDetail(dept.id, { 
      status: dept.status === 'Active' ? 'Inactive' : 'Active' 
    });
    toast.success(`Department ${dept.status === 'Active' ? 'deactivated' : 'activated'}`);
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6 space-y-6">
        <Breadcrumb />
        
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Department Management</h1>
          <p className="text-muted-foreground">Manage departments across all colleges</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>
                Create a new department within a college
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="college">College *</Label>
                <Select
                  value={formData.collegeId}
                  onValueChange={(value) => setFormData({ ...formData, collegeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Department Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hod">Head of Department *</Label>
                <Input
                  id="hod"
                  value={formData.hod}
                  onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
                  placeholder="e.g., Dr. John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="hod@college.edu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91-9876543210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'Active' | 'Inactive') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
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
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Add Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by college or department name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College Name</TableHead>
                <TableHead>Department Name</TableHead>
                <TableHead>Head of Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Students</TableHead>
                <TableHead>Active Jobs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((dept) => {
                const college = colleges.find(c => c.id === dept.collegeId);
                return (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{college?.name}</TableCell>
                    <TableCell>{dept.name}</TableCell>
                    <TableCell>{dept.hod}</TableCell>
                    <TableCell>{dept.email}</TableCell>
                    <TableCell>{dept.students}</TableCell>
                    <TableCell>{dept.activeJobs}</TableCell>
                    <TableCell>
                      <Badge variant={dept.status === 'Active' ? 'default' : 'secondary'}>
                        {dept.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/admin/departments/${dept.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusToggle(dept)}
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentManagement;
