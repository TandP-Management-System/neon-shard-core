import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { BookOpen, Calendar, Award, FileText, Briefcase, Bell, Search, Filter } from 'lucide-react';
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

const StudentDashboard = () => {
  const { theme } = useTheme();
  const { toast } = useToast();

  // Mock student profile for eligibility checking
  const [studentProfile] = useState({
    tenthMath: 82,
    twelfthMath: 88,
    twelfthCS: 85,
    hasDegree: false,
  });

  const [enrolledJobs, setEnrolledJobs] = useState([
    { id: 1, title: 'Software Engineer Intern', company: 'TechCorp Inc.', status: 'Applied', appliedDate: '2025-01-15' },
    { id: 2, title: 'Data Analyst', company: 'DataWorks', status: 'Interview Scheduled', appliedDate: '2025-01-12' },
    { id: 3, title: 'Web Developer', company: 'Creative Studios', status: 'Under Review', appliedDate: '2025-01-10' },
  ]);

  const [availableJobs] = useState([
    { id: 4, title: 'Software Developer Internship', company: 'TechCorp', department: 'Computer Science', salary: '$50k', eligibility: ['10th Math > 75%', '12th CS > 80%'] },
    { id: 5, title: 'Data Analyst', company: 'DataWorks', department: 'Mathematics', salary: '$45k', eligibility: ['12th Math > 85%'] },
    { id: 6, title: 'Research Assistant', company: 'QuantumLabs', department: 'Physics', salary: '$40k', eligibility: ['Degree Required'] },
    { id: 7, title: 'Junior Developer', company: 'WebCo', department: 'Computer Science', salary: '$42k', eligibility: ['12th CS > 70%'] },
  ]);

  const [jobSearchOpen, setJobSearchOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '6', color: 'text-primary' },
    { icon: FileText, label: 'Assignments', value: '12', color: 'text-secondary' },
    { icon: Award, label: 'GPA', value: '3.8', color: 'text-accent' },
    { icon: Briefcase, label: 'Job Applications', value: enrolledJobs.length.toString(), color: 'text-primary' },
  ];

  const courses = [
    { id: 1, name: 'Data Structures', code: 'CS301', instructor: 'Dr. Smith', nextClass: 'Mon 10:00 AM', progress: 85 },
    { id: 2, name: 'Algorithms', code: 'CS302', instructor: 'Prof. Johnson', nextClass: 'Tue 2:00 PM', progress: 92 },
    { id: 3, name: 'Database Systems', code: 'CS303', instructor: 'Dr. Williams', nextClass: 'Wed 11:00 AM', progress: 88 },
    { id: 4, name: 'Web Development', code: 'CS304', instructor: 'Prof. Brown', nextClass: 'Thu 3:00 PM', progress: 76 },
    { id: 5, name: 'Software Engineering', code: 'CS305', instructor: 'Dr. Davis', nextClass: 'Fri 9:00 AM', progress: 94 },
  ];

  const notices = [
    { id: 1, title: 'Mid-term Exam Schedule Released', content: 'Check your course pages for detailed schedules.', date: '2025-01-18', priority: 'high' },
    { id: 2, title: 'Library Hours Extended', content: 'Library will remain open until 10 PM during exam week.', date: '2025-01-17', priority: 'medium' },
    { id: 3, title: 'Career Fair Next Month', content: 'Register for the annual career fair featuring 50+ companies.', date: '2025-01-16', priority: 'medium' },
    { id: 4, title: 'New Study Groups Available', content: 'Join peer study groups for CS courses.', date: '2025-01-15', priority: 'low' },
  ];

  const checkEligibility = (job: any) => {
    const requirements = job.eligibility || [];
    const unmet = [];

    for (const req of requirements) {
      if (req.includes('10th Math > 75%') && studentProfile.tenthMath <= 75) unmet.push(req);
      if (req.includes('12th Math > 85%') && studentProfile.twelfthMath <= 85) unmet.push(req);
      if (req.includes('12th CS > 80%') && studentProfile.twelfthCS <= 80) unmet.push(req);
      if (req.includes('Degree Required') && !studentProfile.hasDegree) unmet.push(req);
    }

    return { eligible: unmet.length === 0, unmet };
  };

  const handleEnrollJob = (job: any) => {
    const { eligible, unmet } = checkEligibility(job);

    if (!eligible) {
      toast({ 
        title: 'Not Eligible', 
        description: `You don't meet: ${unmet.join(', ')}`, 
        variant: 'destructive' 
      });
      return;
    }

    const newApplication = {
      id: job.id,
      title: job.title,
      company: job.company,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
    };

    setEnrolledJobs([...enrolledJobs, newApplication]);
    setJobSearchOpen(false);
    setSelectedJob(null);
    toast({ title: 'Success', description: 'Successfully applied to job!' });
  };

  const filteredJobs = availableJobs.filter(job => 
    !enrolledJobs.some(enrolled => enrolled.id === job.id) &&
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     job.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout userRole="student">
      <div className="p-6 space-y-6">
        {/* Browse Jobs Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <Dialog open={jobSearchOpen} onOpenChange={setJobSearchOpen}>
            <DialogTrigger asChild>
              <Button className={theme === 'neon' ? 'neon-glow' : ''}>
                <Briefcase className="w-4 h-4 mr-2" />
                Browse Jobs
              </Button>
            </DialogTrigger>
            <DialogContent className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} max-w-4xl max-h-[90vh] overflow-y-auto`}>
              <DialogHeader>
                <DialogTitle>Available Jobs</DialogTitle>
                <DialogDescription>Browse and apply to jobs based on your eligibility</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {filteredJobs.map((job) => {
                    const { eligible, unmet } = checkEligibility(job);
                    return (
                      <Card key={job.id} className={`p-4 ${eligible ? 'border-primary/50' : 'border-muted'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">{job.company} • {job.department}</p>
                            <p className="text-sm font-medium mt-1">{job.salary}</p>
                            
                            <div className="mt-2 flex flex-wrap gap-1">
                              {job.eligibility.map((criteria: string, idx: number) => (
                                <Badge 
                                  key={idx} 
                                  variant={unmet.includes(criteria) ? 'destructive' : 'outline'} 
                                  className="text-xs"
                                >
                                  {criteria}
                                </Badge>
                              ))}
                            </div>
                            
                            {!eligible && (
                              <p className="text-xs text-destructive mt-2">
                                Not eligible: {unmet.join(', ')}
                              </p>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            disabled={!eligible}
                            onClick={() => handleEnrollJob(job)}
                          >
                            {eligible ? 'Apply' : 'Not Eligible'}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                  
                  {filteredJobs.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No jobs found matching your search
                    </p>
                  )}
                </div>
              </div>
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
