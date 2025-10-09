import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Download, Users, Briefcase, TrendingUp, UserX } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { toast } from 'sonner';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { departmentDetails, colleges, students, jobs } = useData();

  const department = departmentDetails.find((d) => d.id === id);
  const college = department ? colleges.find((c) => c.id === department.collegeId) : null;

  if (!department || !college) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Department not found</h2>
        <Button onClick={() => navigate('/admin/departments')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Departments
        </Button>
      </div>
    );
  }

  // Mock data for students in this department
  const deptStudents = students.filter(s => s.department === department.name).slice(0, 5);
  
  // Mock data for jobs
  const deptJobs = jobs.filter(j => j.department === department.name).slice(0, 5);

  // Mock events
  const mockEvents = [
    { id: 1, title: 'Tech Talk Series', date: '2025-10-20', type: 'Webinar', attendees: 45 },
    { id: 2, title: 'Industry Visit', date: '2025-10-25', type: 'Field Trip', attendees: 30 },
    { id: 3, title: 'Mock Interview Session', date: '2025-11-01', type: 'Workshop', attendees: 60 },
  ];

  const handleDownloadReport = () => {
    toast.success('Generating department report...', {
      description: 'CSV download will start shortly',
    });
    // Simulate download
    setTimeout(() => {
      toast.success('Report downloaded successfully');
    }, 1500);
  };

  const placementRate = 75; // Mock placement rate

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/departments')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2">{department.name}</h1>
            <p className="text-muted-foreground">
              {college.name} • {department.hod}
            </p>
          </div>
        </div>
        <Button onClick={handleDownloadReport} className="gap-2">
          <Download className="w-4 h-4" />
          Download Report (CSV)
        </Button>
      </div>

      {/* Department Info Card */}
      <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Head of Department</p>
            <p className="font-semibold">{department.hod}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Email</p>
            <p className="font-semibold">{department.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Phone</p>
            <p className="font-semibold">{department.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">College</p>
            <p className="font-semibold">{college.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge variant={department.status === 'Active' ? 'default' : 'secondary'}>
              {department.status}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          label="Total Students"
          value={department.students}
          color="text-primary"
        />
        <StatsCard
          icon={Briefcase}
          label="Total Job Drives"
          value={department.activeJobs}
          color="text-blue-500"
        />
        <StatsCard
          icon={TrendingUp}
          label="Placement Rate"
          value={`${placementRate}%`}
          color="text-green-500"
        />
        <StatsCard
          icon={UserX}
          label="Blacklisted Students"
          value={3}
          color="text-red-500"
        />
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="jobs">Jobs Posted</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
            <h3 className="text-xl font-semibold mb-4">Enrolled Students</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Enrolled Jobs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deptStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.enrolledJobs}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
            <h3 className="text-xl font-semibold mb-4">Active Job Postings</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Applicants</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deptJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.type}</Badge>
                      </TableCell>
                      <TableCell>{job.deadline}</TableCell>
                      <TableCell>{job.applicants}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
            <h3 className="text-xl font-semibold mb-4">Department Events</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Attendees</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.type}</Badge>
                      </TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.attendees}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentDetail;
