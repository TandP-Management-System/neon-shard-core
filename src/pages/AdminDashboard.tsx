import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { Users, Building2, GraduationCap, BarChart3, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminDashboard = () => {
  const { theme } = useTheme();

  const stats = [
    { icon: Users, label: 'Total Users', value: '1,234', change: '+12%', color: 'text-primary' },
    { icon: Building2, label: 'Departments', value: '12', change: '+2', color: 'text-secondary' },
    { icon: GraduationCap, label: 'Students', value: '987', change: '+45', color: 'text-accent' },
    { icon: BarChart3, label: 'Active Sessions', value: '456', change: '+23%', color: 'text-primary' },
  ];

  const departments = [
    { id: 1, name: 'Computer Science', students: 245, faculty: 24, head: 'Dr. Sarah Johnson' },
    { id: 2, name: 'Mathematics', students: 198, faculty: 18, head: 'Prof. Michael Chen' },
    { id: 3, name: 'Physics', students: 167, faculty: 16, head: 'Dr. Emily Davis' },
    { id: 4, name: 'Chemistry', students: 189, faculty: 20, head: 'Prof. Robert Brown' },
    { id: 5, name: 'Biology', students: 156, faculty: 15, head: 'Dr. Lisa Anderson' },
  ];

  const recentStudents = [
    { id: 1, name: 'John Doe', email: 'john.doe@university.edu', department: 'Computer Science', enrolled: '2025-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@university.edu', department: 'Mathematics', enrolled: '2025-01-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike.j@university.edu', department: 'Physics', enrolled: '2025-01-14' },
    { id: 4, name: 'Sarah Williams', email: 'sarah.w@university.edu', department: 'Chemistry', enrolled: '2025-01-13' },
    { id: 5, name: 'David Lee', email: 'david.lee@university.edu', department: 'Biology', enrolled: '2025-01-13' },
  ];

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6 space-y-6">
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
                  <TableHead>Faculty</TableHead>
                  <TableHead>Department Head</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.students}</TableCell>
                    <TableCell>{dept.faculty}</TableCell>
                    <TableCell>{dept.head}</TableCell>
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
                  <TableHead>Enrolled Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.enrolled}</TableCell>
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
