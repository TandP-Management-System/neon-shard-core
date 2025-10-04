import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { GraduationCap, Users, FileText, Calendar, Briefcase, Bell } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const DepartmentDashboard = () => {
  const { theme } = useTheme();

  const stats = [
    { icon: GraduationCap, label: 'Total Students', value: '245', color: 'text-primary' },
    { icon: Users, label: 'Faculty Members', value: '24', color: 'text-secondary' },
    { icon: FileText, label: 'Active Courses', value: '32', color: 'text-accent' },
    { icon: Briefcase, label: 'Job Postings', value: '8', color: 'text-primary' },
  ];

  const jobPostings = [
    { id: 1, title: 'Software Engineer Intern', company: 'TechCorp Inc.', type: 'Internship', applications: 45, deadline: '2025-02-15' },
    { id: 2, title: 'Data Analyst', company: 'DataWorks', type: 'Full-time', applications: 32, deadline: '2025-02-20' },
    { id: 3, title: 'Web Developer', company: 'Creative Studios', type: 'Part-time', applications: 28, deadline: '2025-02-18' },
    { id: 4, title: 'Research Assistant', company: 'University Lab', type: 'Internship', applications: 19, deadline: '2025-02-25' },
  ];

  const meetings = [
    { id: 1, title: 'Faculty Meeting', date: '2025-01-20', time: '2:00 PM', location: 'Conference Room A', attendees: 18 },
    { id: 2, title: 'Curriculum Review', date: '2025-01-22', time: '10:00 AM', location: 'Board Room', attendees: 12 },
    { id: 3, title: 'Student Council', date: '2025-01-24', time: '4:00 PM', location: 'Meeting Hall', attendees: 25 },
    { id: 4, title: 'Department Head Meeting', date: '2025-01-26', time: '11:00 AM', location: 'Admin Building', attendees: 8 },
  ];

  const announcements = [
    { id: 1, title: 'Mid-term Examinations', content: 'Scheduled for next week. Please ensure all students are prepared.', date: '2025-01-18', priority: 'high' },
    { id: 2, title: 'Guest Lecture Series', content: 'Industry experts will be visiting next month for special lectures.', date: '2025-01-16', priority: 'medium' },
    { id: 3, title: 'Lab Equipment Upgrade', content: 'New equipment has been installed in Lab 3. Training sessions scheduled.', date: '2025-01-14', priority: 'low' },
  ];

  return (
    <DashboardLayout userRole="department">
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

        {/* Job Postings */}
        <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Active Job Postings</h2>
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobPostings.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>
                      <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>
                        {job.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.applications}</TableCell>
                    <TableCell>{job.deadline}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Meetings & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Meetings */}
          <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Upcoming Meetings</h2>
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-4 rounded-lg bg-background/50 border border-border">
                  <h3 className="font-semibold mb-2">{meeting.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>📅 {meeting.date} at {meeting.time}</p>
                    <p>📍 {meeting.location}</p>
                    <p>👥 {meeting.attendees} attendees</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Announcements */}
          <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Recent Announcements</h2>
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-lg bg-background/50 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <Badge variant={
                      announcement.priority === 'high' ? 'destructive' : 
                      announcement.priority === 'medium' ? 'default' : 
                      'secondary'
                    }>
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                  <p className="text-xs text-muted-foreground">{announcement.date}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentDashboard;
