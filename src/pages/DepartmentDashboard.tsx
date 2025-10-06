import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useTheme } from '@/contexts/ThemeContext';
import { GraduationCap, Users, FileText, Calendar, Briefcase, Bell, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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

const DepartmentDashboard = () => {
  const { theme } = useTheme();
  const { toast } = useToast();

  const [jobPostings, setJobPostings] = useState([
    { id: 1, title: 'Software Engineer Intern', company: 'TechCorp Inc.', type: 'Internship', applications: 45, deadline: '2025-02-15', eligibility: ['10th Math > 75%', '12th CS > 80%'] },
    { id: 2, title: 'Data Analyst', company: 'DataWorks', type: 'Full-time', applications: 32, deadline: '2025-02-20', eligibility: ['12th Math > 85%', 'Degree in Stats'] },
    { id: 3, title: 'Web Developer', company: 'Creative Studios', type: 'Part-time', applications: 28, deadline: '2025-02-18', eligibility: ['12th CS > 70%'] },
  ]);

  const [meetings, setMeetings] = useState([
    { id: 1, title: 'Faculty Meeting', date: '2025-01-20', time: '2:00 PM', location: 'Conference Room A', attendees: 18 },
    { id: 2, title: 'Curriculum Review', date: '2025-01-22', time: '10:00 AM', location: 'Board Room', attendees: 12 },
    { id: 3, title: 'Student Council', date: '2025-01-24', time: '4:00 PM', location: 'Meeting Hall', attendees: 25 },
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Mid-term Examinations', content: 'Scheduled for next week. Please ensure all students are prepared.', date: '2025-01-18', priority: 'high' },
    { id: 2, title: 'Guest Lecture Series', content: 'Industry experts will be visiting next month for special lectures.', date: '2025-01-16', priority: 'medium' },
    { id: 3, title: 'Lab Equipment Upgrade', content: 'New equipment has been installed in Lab 3. Training sessions scheduled.', date: '2025-01-14', priority: 'low' },
  ]);

  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [noticeDialogOpen, setNoticeDialogOpen] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    type: 'Internship',
    deadline: '',
    eligibility: {
      tenthMath: false,
      twelfthMath: false,
      twelfthCS: false,
      degree: false,
    }
  });

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
  });

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    priority: 'medium',
  });

  const stats = [
    { icon: GraduationCap, label: 'Total Students', value: '245', color: 'text-primary' },
    { icon: Users, label: 'Faculty Members', value: '24', color: 'text-secondary' },
    { icon: FileText, label: 'Active Courses', value: '32', color: 'text-accent' },
    { icon: Briefcase, label: 'Job Postings', value: jobPostings.length.toString(), color: 'text-primary' },
  ];

  const handlePostJob = () => {
    if (!newJob.title || !newJob.company || !newJob.deadline) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const eligibilityList = [];
    if (newJob.eligibility.tenthMath) eligibilityList.push('10th Math > 75%');
    if (newJob.eligibility.twelfthMath) eligibilityList.push('12th Math > 85%');
    if (newJob.eligibility.twelfthCS) eligibilityList.push('12th CS > 80%');
    if (newJob.eligibility.degree) eligibilityList.push('Degree Required');

    const job = {
      id: jobPostings.length + 1,
      title: newJob.title,
      company: newJob.company,
      type: newJob.type,
      deadline: newJob.deadline,
      applications: 0,
      eligibility: eligibilityList,
    };

    setJobPostings([...jobPostings, job]);
    setNewJob({ title: '', company: '', type: 'Internship', deadline: '', eligibility: { tenthMath: false, twelfthMath: false, twelfthCS: false, degree: false } });
    setJobDialogOpen(false);
    toast({ title: 'Success', description: 'Job posted successfully' });
  };

  const handlePostMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time || !newMeeting.location) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const meeting = {
      id: meetings.length + 1,
      ...newMeeting,
      attendees: 0,
    };

    setMeetings([...meetings, meeting]);
    setNewMeeting({ title: '', date: '', time: '', location: '' });
    setMeetingDialogOpen(false);
    toast({ title: 'Success', description: 'Meeting scheduled successfully' });
  };

  const handlePostNotice = () => {
    if (!newNotice.title || !newNotice.content) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const notice = {
      id: announcements.length + 1,
      ...newNotice,
      date: new Date().toISOString().split('T')[0],
    };

    setAnnouncements([notice, ...announcements]);
    setNewNotice({ title: '', content: '', priority: 'medium' });
    setNoticeDialogOpen(false);
    toast({ title: 'Success', description: 'Notice posted successfully' });
  };

  return (
    <DashboardLayout userRole="department">
      <div className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
            <DialogTrigger asChild>
              <Button className={theme === 'neon' ? 'neon-glow' : ''}>
                <Plus className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            </DialogTrigger>
            <DialogContent className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} max-h-[90vh] overflow-y-auto`}>
              <DialogHeader>
                <DialogTitle>Post New Job</DialogTitle>
                <DialogDescription>Create a job posting with eligibility criteria</DialogDescription>
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
                  <Label htmlFor="job-type">Job Type</Label>
                  <Select value={newJob.type} onValueChange={(value) => setNewJob({...newJob, type: value})}>
                    <SelectTrigger id="job-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="job-deadline">Application Deadline</Label>
                  <Input id="job-deadline" type="date" value={newJob.deadline} onChange={(e) => setNewJob({...newJob, deadline: e.target.value})} />
                </div>
                <div>
                  <Label>Eligibility Criteria</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tenth-math"
                        checked={newJob.eligibility.tenthMath}
                        onCheckedChange={(checked) => setNewJob({...newJob, eligibility: {...newJob.eligibility, tenthMath: checked as boolean}})}
                      />
                      <label htmlFor="tenth-math" className="text-sm cursor-pointer">10th Math &gt; 75%</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="twelfth-math"
                        checked={newJob.eligibility.twelfthMath}
                        onCheckedChange={(checked) => setNewJob({...newJob, eligibility: {...newJob.eligibility, twelfthMath: checked as boolean}})}
                      />
                      <label htmlFor="twelfth-math" className="text-sm cursor-pointer">12th Math &gt; 85%</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="twelfth-cs"
                        checked={newJob.eligibility.twelfthCS}
                        onCheckedChange={(checked) => setNewJob({...newJob, eligibility: {...newJob.eligibility, twelfthCS: checked as boolean}})}
                      />
                      <label htmlFor="twelfth-cs" className="text-sm cursor-pointer">12th CS &gt; 80%</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="degree"
                        checked={newJob.eligibility.degree}
                        onCheckedChange={(checked) => setNewJob({...newJob, eligibility: {...newJob.eligibility, degree: checked as boolean}})}
                      />
                      <label htmlFor="degree" className="text-sm cursor-pointer">Degree Required</label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handlePostJob}>Post Job</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={meetingDialogOpen} onOpenChange={setMeetingDialogOpen}>
            <DialogTrigger asChild>
              <Button className={theme === 'neon' ? 'neon-glow' : ''}>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
              <DialogHeader>
                <DialogTitle>Schedule Meeting</DialogTitle>
                <DialogDescription>Add a new meeting to the calendar</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meeting-title">Meeting Title</Label>
                  <Input id="meeting-title" value={newMeeting.title} onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="meeting-date">Date</Label>
                  <Input id="meeting-date" type="date" value={newMeeting.date} onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="meeting-time">Time</Label>
                  <Input id="meeting-time" type="time" value={newMeeting.time} onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="meeting-location">Location</Label>
                  <Input id="meeting-location" value={newMeeting.location} onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handlePostMeeting}>Schedule Meeting</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={noticeDialogOpen} onOpenChange={setNoticeDialogOpen}>
            <DialogTrigger asChild>
              <Button className={theme === 'neon' ? 'neon-glow' : ''}>
                <Plus className="w-4 h-4 mr-2" />
                Post Notice
              </Button>
            </DialogTrigger>
            <DialogContent className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
              <DialogHeader>
                <DialogTitle>Post Notice</DialogTitle>
                <DialogDescription>Create a new announcement</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notice-title">Notice Title</Label>
                  <Input id="notice-title" value={newNotice.title} onChange={(e) => setNewNotice({...newNotice, title: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="notice-content">Content</Label>
                  <Textarea id="notice-content" value={newNotice.content} onChange={(e) => setNewNotice({...newNotice, content: e.target.value})} rows={4} />
                </div>
                <div>
                  <Label htmlFor="notice-priority">Priority</Label>
                  <Select value={newNotice.priority} onValueChange={(value) => setNewNotice({...newNotice, priority: value})}>
                    <SelectTrigger id="notice-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handlePostNotice}>Post Notice</Button>
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
                  <TableHead>Eligibility</TableHead>
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
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {job.eligibility.map((criteria, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {criteria}
                          </Badge>
                        ))}
                      </div>
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
