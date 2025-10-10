import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Department {
  id: string;
  name: string;
  head: string;
  students: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  enrolledJobs: number;
  tenthMath?: number;
  twelfthMath?: number;
  twelfthCS?: number;
  hasDegree?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  type: string;
  department: string;
  deadline: string;
  applicants: number;
  eligibility: string[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export interface College {
  id: string;
  name: string;
  code: string;
  domain: string;
  contact: string;
  plan: 'Standard' | 'Premium' | 'Enterprise';
  status: 'Active' | 'Inactive';
  departments: number;
  students: number;
  jobs: number;
}

export interface DepartmentDetail {
  id: string;
  collegeId: string;
  name: string;
  hod: string;
  email: string;
  phone?: string;
  students: number;
  activeJobs: number;
  status: 'Active' | 'Inactive';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'job' | 'meeting' | 'announcement' | 'enrollment' | 'college' | 'department';
  timestamp: string;
  read: boolean;
}

export interface Analytics {
  placementsByCollege: { college: string; placed: number }[];
  topDepartments: { name: string; percentage: number }[];
  jobDrives: number[];
  studentGrowth: number[];
}

interface DataContextType {
  departments: Department[];
  students: Student[];
  jobs: Job[];
  meetings: Meeting[];
  announcements: Announcement[];
  notifications: Notification[];
  colleges: College[];
  departmentDetails: DepartmentDetail[];
  analytics: Analytics;
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  addJob: (job: Omit<Job, 'id'>) => void;
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  enrollInJob: (studentId: string, jobId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  addCollege: (college: Omit<College, 'id'>) => void;
  updateCollege: (id: string, college: Partial<College>) => void;
  deleteCollege: (id: string) => void;
  addDepartmentDetail: (dept: Omit<DepartmentDetail, 'id'>) => void;
  updateDepartmentDetail: (id: string, dept: Partial<DepartmentDetail>) => void;
  deleteDepartmentDetail: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Demo Dataset
const initialDepartments: Department[] = [
  { id: '1', name: 'Computer Science', head: 'Dr. Smith', students: 150 },
  { id: '2', name: 'Mathematics', head: 'Dr. Johnson', students: 120 },
  { id: '3', name: 'Physics', head: 'Dr. Williams', students: 100 },
];

const initialStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'student1@saas.com',
    department: 'Computer Science',
    enrolledJobs: 2,
    tenthMath: 85,
    twelfthMath: 90,
    twelfthCS: 88,
    hasDegree: false,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'student2@saas.com',
    department: 'Mathematics',
    enrolledJobs: 1,
    tenthMath: 78,
    twelfthMath: 87,
    twelfthCS: 82,
    hasDegree: false,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'student3@saas.com',
    department: 'Computer Science',
    enrolledJobs: 3,
    tenthMath: 92,
    twelfthMath: 95,
    twelfthCS: 93,
    hasDegree: true,
  },
];

const initialJobs: Job[] = [
  {
    id: '1',
    title: 'Software Engineer Intern',
    company: 'Tech Corp',
    type: 'Internship',
    department: 'Computer Science',
    deadline: '2025-11-15',
    applicants: 25,
    eligibility: ['10th Math > 75%', '12th Math > 85%', '12th CS > 80%'],
  },
  {
    id: '2',
    title: 'Data Analyst',
    company: 'Data Inc',
    type: 'Full-time',
    department: 'Mathematics',
    deadline: '2025-11-30',
    applicants: 18,
    eligibility: ['10th Math > 75%', '12th Math > 85%', 'Degree Required'],
  },
  {
    id: '3',
    title: 'Research Assistant',
    company: 'Research Lab',
    type: 'Part-time',
    department: 'Physics',
    deadline: '2025-12-10',
    applicants: 12,
    eligibility: ['12th Math > 85%'],
  },
];

const initialMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Placement Drive Briefing',
    date: '2025-10-15',
    time: '10:00 AM',
    location: 'Auditorium',
    attendees: 75,
  },
  {
    id: '2',
    title: 'Career Counseling Session',
    date: '2025-10-20',
    time: '2:00 PM',
    location: 'Room 301',
    attendees: 40,
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'New Job Postings Available',
    content: 'Check out the latest job opportunities from top tech companies.',
    date: '2025-10-08',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Campus Placement Schedule',
    content: 'The placement drive schedule for this semester has been released.',
    date: '2025-10-05',
    priority: 'medium',
  },
];

const initialColleges: College[] = [
  {
    id: '1',
    name: 'XYZ Institute of Technology',
    code: 'XYZ-001',
    domain: 'xyz.edu.in',
    contact: 'tpo@xyz.edu.in',
    plan: 'Premium',
    status: 'Active',
    departments: 5,
    students: 450,
    jobs: 12,
  },
  {
    id: '2',
    name: 'ABC College of Engineering',
    code: 'ABC-002',
    domain: 'abc.edu.in',
    contact: 'placement@abc.edu.in',
    plan: 'Standard',
    status: 'Inactive',
    departments: 3,
    students: 280,
    jobs: 8,
  },
  {
    id: '3',
    name: 'Global Institute',
    code: 'GLB-003',
    domain: 'global.edu.in',
    contact: 'tp@global.edu.in',
    plan: 'Enterprise',
    status: 'Active',
    departments: 6,
    students: 620,
    jobs: 18,
  },
];

const initialDepartmentDetails: DepartmentDetail[] = [
  { 
    id: '1', 
    collegeId: '1', 
    name: 'Computer Science', 
    hod: 'Dr. Meera Patel', 
    email: 'hod.cse@xyz.edu.in', 
    phone: '+91-9876543210',
    students: 120, 
    activeJobs: 4, 
    status: 'Active' 
  },
  { 
    id: '2', 
    collegeId: '1', 
    name: 'Electronics', 
    hod: 'Dr. Anil Singh', 
    email: 'hod.ece@xyz.edu.in', 
    phone: '+91-9876543211',
    students: 80, 
    activeJobs: 2, 
    status: 'Active' 
  },
  { 
    id: '3', 
    collegeId: '2', 
    name: 'Mechanical', 
    hod: 'Dr. S. Rao', 
    email: 'hod.mech@abc.edu.in', 
    phone: '+91-9876543212',
    students: 90, 
    activeJobs: 1, 
    status: 'Inactive' 
  },
  { 
    id: '4', 
    collegeId: '3', 
    name: 'Information Technology', 
    hod: 'Dr. Priya Sharma', 
    email: 'hod.it@global.edu.in', 
    phone: '+91-9876543213',
    students: 150, 
    activeJobs: 5, 
    status: 'Active' 
  },
  { 
    id: '5', 
    collegeId: '2', 
    name: 'Civil Engineering', 
    hod: 'Dr. Rajesh Kumar', 
    email: 'hod.civil@abc.edu.in', 
    phone: '+91-9876543214',
    students: 70, 
    activeJobs: 2, 
    status: 'Active' 
  },
];

const initialAnalytics: Analytics = {
  placementsByCollege: [
    { college: 'XYZ Institute of Technology', placed: 240 },
    { college: 'ABC College of Engineering', placed: 120 },
    { college: 'Global Institute', placed: 300 }
  ],
  topDepartments: [
    { name: 'CSE', percentage: 35 },
    { name: 'ECE', percentage: 25 },
    { name: 'Mechanical', percentage: 20 },
    { name: 'Civil', percentage: 10 },
    { name: 'IT', percentage: 10 }
  ],
  jobDrives: [10, 12, 14, 9, 15, 18, 16, 20],
  studentGrowth: [200, 250, 310, 350, 420, 500, 580]
};

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Job Posted',
    message: 'Software Engineer Intern position at Tech Corp',
    type: 'job',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: '2',
    title: 'Meeting Reminder',
    message: 'Placement Drive Briefing tomorrow at 10:00 AM',
    type: 'meeting',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
  },
  {
    id: '3',
    title: 'New Announcement',
    message: 'Campus Placement Schedule has been updated',
    type: 'announcement',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: false,
  },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [colleges, setColleges] = useState<College[]>(initialColleges);
  const [departmentDetails, setDepartmentDetails] = useState<DepartmentDetail[]>(initialDepartmentDetails);
  const [analytics] = useState<Analytics>(initialAnalytics);

  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept = { ...dept, id: Date.now().toString() };
    setDepartments([...departments, newDept]);
    addNotification({
      title: 'Department Added',
      message: `${dept.name} department has been created`,
      type: 'announcement',
    });
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments(departments.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setStudents([...students, newStudent]);
  };

  const addJob = (job: Omit<Job, 'id'>) => {
    const newJob = { ...job, id: Date.now().toString() };
    setJobs([...jobs, newJob]);
    addNotification({
      title: 'New Job Posted',
      message: `${job.title} at ${job.company}`,
      type: 'job',
    });
  };

  const addMeeting = (meeting: Omit<Meeting, 'id'>) => {
    const newMeeting = { ...meeting, id: Date.now().toString() };
    setMeetings([...meetings, newMeeting]);
    addNotification({
      title: 'New Meeting Scheduled',
      message: `${meeting.title} on ${meeting.date} at ${meeting.time}`,
      type: 'meeting',
    });
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement = { ...announcement, id: Date.now().toString() };
    setAnnouncements([...announcements, newAnnouncement]);
    addNotification({
      title: 'New Announcement',
      message: announcement.title,
      type: 'announcement',
    });
  };

  const enrollInJob = (studentId: string, jobId: string) => {
    setStudents(
      students.map(s =>
        s.id === studentId ? { ...s, enrolledJobs: s.enrolledJobs + 1 } : s
      )
    );
    setJobs(jobs.map(j => (j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j)));
    addNotification({
      title: 'Job Enrollment',
      message: 'Successfully enrolled in job',
      type: 'enrollment',
    });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addCollege = (college: Omit<College, 'id'>) => {
    const newCollege = { ...college, id: Date.now().toString() };
    setColleges([...colleges, newCollege]);
    addNotification({
      title: 'College Added',
      message: `${college.name} has been registered`,
      type: 'college',
    });
  };

  const updateCollege = (id: string, updates: Partial<College>) => {
    setColleges(colleges.map(c => (c.id === id ? { ...c, ...updates } : c)));
    addNotification({
      title: 'College Updated',
      message: 'College information has been updated',
      type: 'college',
    });
  };

  const deleteCollege = (id: string) => {
    const college = colleges.find(c => c.id === id);
    setColleges(colleges.filter(c => c.id !== id));
    if (college) {
      addNotification({
        title: 'College Removed',
        message: `${college.name} has been removed`,
        type: 'college',
      });
    }
  };

  const addDepartmentDetail = (dept: Omit<DepartmentDetail, 'id'>) => {
    const newDept = { ...dept, id: Date.now().toString() };
    setDepartmentDetails([...departmentDetails, newDept]);
    addNotification({
      title: 'Department Added',
      message: `${dept.name} department has been created`,
      type: 'department',
    });
  };

  const updateDepartmentDetail = (id: string, updates: Partial<DepartmentDetail>) => {
    setDepartmentDetails(departmentDetails.map(d => (d.id === id ? { ...d, ...updates } : d)));
    addNotification({
      title: 'Department Updated',
      message: 'Department information has been updated',
      type: 'department',
    });
  };

  const deleteDepartmentDetail = (id: string) => {
    const dept = departmentDetails.find(d => d.id === id);
    setDepartmentDetails(departmentDetails.filter(d => d.id !== id));
    if (dept) {
      addNotification({
        title: 'Department Removed',
        message: `${dept.name} has been removed`,
        type: 'department',
      });
    }
  };

  return (
    <DataContext.Provider
      value={{
        departments,
        students,
        jobs,
        meetings,
        announcements,
        notifications,
        colleges,
        departmentDetails,
        analytics,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addStudent,
        addJob,
        addMeeting,
        addAnnouncement,
        enrollInJob,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        addCollege,
        updateCollege,
        deleteCollege,
        addDepartmentDetail,
        updateDepartmentDetail,
        deleteDepartmentDetail,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
