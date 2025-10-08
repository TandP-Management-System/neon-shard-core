import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import ActivityFeed from '@/components/ActivityFeed';
import SystemHealth from '@/components/SystemHealth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { Users, Building2, GraduationCap, Briefcase, Building, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { colleges, addStudent } = useData();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const totalStudents = colleges.reduce((sum, college) => sum + college.students, 0);
  const totalDepartments = colleges.reduce((sum, college) => sum + college.departments, 0);
  const totalJobs = colleges.reduce((sum, college) => sum + college.jobs, 0);

  const stats = [
    { icon: Building, label: 'Total Colleges', value: colleges.length, change: '+3', color: 'text-primary' },
    { icon: Building2, label: 'Total Departments', value: totalDepartments, change: '+8', color: 'text-secondary' },
    { icon: GraduationCap, label: 'Total Students', value: totalStudents, change: '+125', color: 'text-accent' },
    { icon: Briefcase, label: 'Jobs Posted', value: totalJobs, change: '+15', color: 'text-primary' },
  ];

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              SaaS Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">System-wide analytics and management</p>
          </div>
          <div className="flex gap-3">
            <Button
              className={theme === 'neon' ? 'neon-glow' : ''}
              onClick={() => navigate('/admin/colleges')}
            >
              <Building className="w-4 h-4 mr-2" />
              Manage Colleges
            </Button>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className={theme === 'neon' ? 'neon-border' : ''}>
                  <Upload className="w-4 h-4 mr-2" />
                  Quick Upload
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
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              color={stat.color}
            />
          ))}
        </div>

        {/* Activity and System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <div>
            <SystemHealth />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
