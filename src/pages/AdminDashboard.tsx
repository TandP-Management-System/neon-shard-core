import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { Users, Building2, GraduationCap, BarChart3, TrendingUp, Upload, Plus, Edit, Trash2, Briefcase } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const { departments, students, jobs, addDepartment, updateDepartment, deleteDepartment, addJob, addStudent } = useData();

  const [deptDialogOpen, setDeptDialogOpen] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);

  const [newDept, setNewDept] = useState({ name: '', head: '', students: 0 });
  const [newJob, setNewJob] = useState({ title: '', company: '', type: 'Internship', department: '', deadline: '', eligibility: [] as string[] });

  const stats = [
    { icon: Users, label: 'Total Users', value: (departments.length + students.length).toString(), change: '+12%', color: 'text-primary' },
    { icon: Building2, label: 'Departments', value: departments.length.toString(), change: '+2', color: 'text-secondary' },
    { icon: GraduationCap, label: 'Students', value: students.length.toString(), change: '+45', color: 'text-accent' },
    { icon: Briefcase, label: 'Active Jobs', value: jobs.length.toString(), change: '+5', color: 'text-primary' },
  ];

  const handleAddDepartment = () => {
    if (!newDept.name || !newDept.head) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    addDepartment(newDept);
    setNewDept({ name: '', head: '', students: 0 });
    setDeptDialogOpen(false);
    toast({ title: 'Success', description: 'Department added successfully' });
  };

  const handleEditDepartment = () => {
    updateDepartment(editingDept.id, editingDept);
    setEditingDept(null);
    setDeptDialogOpen(false);
    toast({ title: 'Success', description: 'Department updated successfully' });
  };

  const handleDeleteDepartment = (id: string) => {
    deleteDepartment(id);
    toast({ title: 'Success', description: 'Department deleted successfully' });
  };

  const handleAddJob = () => {
    if (!newJob.title || !newJob.company || !newJob.department || !newJob.deadline) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    addJob({ ...newJob, applicants: 0 });
    setNewJob({ title: '', company: '', type: 'Internship', department: '', deadline: '', eligibility: [] });
    setJobDialogOpen(false);
    toast({ title: 'Success', description: 'Job posted successfully' });
  };

  const handleUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simulate CSV parsing
    const mockStudents = [
      { name: 'Alice Brown', email: 'alice.b@university.edu', department: 'Computer Science', enrolledJobs: 0 },
      { name: 'Bob Wilson', email: 'bob.w@university.edu', department: 'Mathematics', enrolledJobs: 0 },
    ];
    mockStudents.forEach(s => addStudent(s));
    setUploadDialogOpen(false);
    toast({ title: 'Success', description: `Uploaded ${mockStudents.length} students from CSV` });
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className={theme === 'neon' ? 'neon-glow' : ''}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Students CSV
              </Button>
            </DialogTrigger>
            <DialogContent className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
              <DialogHeader>
                <DialogTitle>Upload Students via CSV</DialogTitle>
                <DialogDescription>Select a CSV file containing student data</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-upload">CSV File</Label>
                  <Input id="csv-upload" type="file" accept=".csv" onChange={handleUploadCSV} />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={deptDialogOpen} onOpenChange={setDeptDialogOpen}>
            <DialogTrigger asChild>
              <Button className={theme === 'neon' ? 'neon-glow' : ''} onClick={() => { setEditingDept(null); setNewDept({ name: '', head: '', students: 0 }); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
              <DialogHeader>
                <DialogTitle>{editingDept ? 'Edit Department' : 'Add New Department'}</DialogTitle>
                <DialogDescription>Enter department details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dept-name">Department Name</Label>
                  <Input
                    id="dept-name"
                    value={editingDept ? editingDept.name : newDept.name}
                    onChange={(e) => editingDept ? setEditingDept({...editingDept, name: e.target.value}) : setNewDept({...newDept, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dept-head">Department Head</Label>
                  <Input
                    id="dept-head"
                    value={editingDept ? editingDept.head : newDept.head}
                    onChange={(e) => editingDept ? setEditingDept({...editingDept, head: e.target.value}) : setNewDept({...newDept, head: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dept-students">Initial Student Count</Label>
                  <Input
                    id="dept-students"
                    type="number"
                    value={editingDept ? editingDept.students : newDept.students}
                    onChange={(e) => editingDept ? setEditingDept({...editingDept, students: parseInt(e.target.value)}) : setNewDept({...newDept, students: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={editingDept ? handleEditDepartment : handleAddDepartment}>
                  {editingDept ? 'Update' : 'Add'} Department
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
            <DialogTrigger asChild>
              <Button className={theme === 'neon' ? 'neon-glow' : ''}>
                <Briefcase className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            </DialogTrigger>
            <DialogContent className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
              <DialogHeader>
                <DialogTitle>Post New Job</DialogTitle>
                <DialogDescription>Create a new job posting</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input id="job-title" value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="job-company">Company</Label>
                  <Input id="job-company" value={newJob.company} onChange={(e) => setNewJob({...newJob, company: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="job-dept">Department</Label>
                  <Input id="job-dept" value={newJob.department} onChange={(e) => setNewJob({...newJob, department: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="job-deadline">Deadline</Label>
                  <Input id="job-deadline" type="date" value={newJob.deadline} onChange={(e) => setNewJob({...newJob, deadline: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddJob}>Post Job</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`p-6 ${
                  theme === 'neon' 
                    ? 'glass neon-border hover:shadow-[0_0_30px_rgba(0,243,255,0.3)]' 
                    : 'glass-luxe hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]'
                } transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    theme === 'neon' ? 'bg-primary/20' : 'bg-primary/20'
                  }`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-green-500">
                      <TrendingUp className="w-4 h-4" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Departments Table */}
        <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <h2 className="text-2xl font-bold mb-4">Departments Overview</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Department Head</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.students}</TableCell>
                    <TableCell>{dept.head}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEditingDept(dept); setDeptDialogOpen(true); }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteDepartment(dept.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Jobs Table */}
        <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <h2 className="text-2xl font-bold mb-4">Job Postings</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.applicants}</TableCell>
                    <TableCell>{job.deadline}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Recent Students */}
        <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <h2 className="text-2xl font-bold mb-4">Recently Enrolled Students</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Enrollments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.slice(0, 5).map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.enrolledJobs} jobs</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
