import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { BookOpen, Calendar, Award, FileText, Briefcase, Bell } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const StudentDashboard = () => {
  const { theme } = useTheme();

  const stats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '6', color: 'text-primary' },
    { icon: FileText, label: 'Assignments', value: '12', color: 'text-secondary' },
    { icon: Award, label: 'GPA', value: '3.8', color: 'text-accent' },
    { icon: Calendar, label: 'Upcoming Events', value: '4', color: 'text-primary' },
  ];

  const courses = [
    { id: 1, name: 'Data Structures', code: 'CS301', instructor: 'Dr. Smith', nextClass: 'Mon 10:00 AM', progress: 85 },
    { id: 2, name: 'Algorithms', code: 'CS302', instructor: 'Prof. Johnson', nextClass: 'Tue 2:00 PM', progress: 92 },
    { id: 3, name: 'Database Systems', code: 'CS303', instructor: 'Dr. Williams', nextClass: 'Wed 11:00 AM', progress: 88 },
    { id: 4, name: 'Web Development', code: 'CS304', instructor: 'Prof. Brown', nextClass: 'Thu 3:00 PM', progress: 76 },
    { id: 5, name: 'Software Engineering', code: 'CS305', instructor: 'Dr. Davis', nextClass: 'Fri 9:00 AM', progress: 94 },
  ];

  const enrolledJobs = [
    { id: 1, title: 'Software Engineer Intern', company: 'TechCorp Inc.', status: 'Applied', appliedDate: '2025-01-15' },
    { id: 2, title: 'Data Analyst', company: 'DataWorks', status: 'Interview Scheduled', appliedDate: '2025-01-12' },
    { id: 3, title: 'Web Developer', company: 'Creative Studios', status: 'Under Review', appliedDate: '2025-01-10' },
  ];

  const notices = [
    { id: 1, title: 'Mid-term Exam Schedule Released', content: 'Check your course pages for detailed schedules.', date: '2025-01-18', priority: 'high' },
    { id: 2, title: 'Library Hours Extended', content: 'Library will remain open until 10 PM during exam week.', date: '2025-01-17', priority: 'medium' },
    { id: 3, title: 'Career Fair Next Month', content: 'Register for the annual career fair featuring 50+ companies.', date: '2025-01-16', priority: 'medium' },
    { id: 4, title: 'New Study Groups Available', content: 'Join peer study groups for CS courses.', date: '2025-01-15', priority: 'low' },
  ];

  return (
    <DashboardLayout userRole="student">
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
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Enrolled Courses */}
        <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="p-4 rounded-lg bg-background/50 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.code} • {course.instructor}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Next: {course.nextClass}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Course Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Job Applications & Notices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Applications */}
          <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Job Applications</h2>
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>
                        <Badge variant={
                          job.status === 'Interview Scheduled' ? 'default' : 
                          job.status === 'Applied' ? 'secondary' : 
                          'outline'
                        }>
                          {job.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Notices */}
          <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Important Notices</h2>
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notices.map((notice) => (
                <div key={notice.id} className="p-4 rounded-lg bg-background/50 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{notice.title}</h3>
                    <Badge variant={
                      notice.priority === 'high' ? 'destructive' : 
                      notice.priority === 'medium' ? 'default' : 
                      'secondary'
                    } className="text-xs">
                      {notice.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notice.content}</p>
                  <p className="text-xs text-muted-foreground">{notice.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
