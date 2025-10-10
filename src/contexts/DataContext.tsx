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
  enrollment_number?: string;
  name: string;
  phone?: string;
  email: string;
  department: string;
  branch?: string;
  cgpa?: number;
  backlogs?: number;
  tenthPercent?: number;
  twelfthPercent?: number;
  graduationPercent?: number;
  graduationPeriod?: string;
  educationGapYears?: number;
  pastBacklogs?: number;
  skills?: string[];
  resumeUrl?: string;
  blacklisted?: boolean;
  enrolledJobs: number;
  tenthMath?: number;
  twelfthMath?: number;
  twelfthCS?: number;
  hasDegree?: boolean;
}

export interface CourseEnrollment {
  studentId: string;
  progress: number; // 0-100
  grade?: string; // e.g., A, B, C
}

export interface Course {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
  skillsCovered: string[];
  status: 'Active' | 'Inactive' | 'Completed';
  enrolled: CourseEnrollment[];
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

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed';
export type EventType = 'Workshop' | 'Seminar' | 'Hackathon' | 'Training' | 'Webinar';

export interface DepartmentEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  date: string; // ISO date
  time?: string; // HH:mm
  location?: string;
  onlineLink?: string;
  maxParticipants?: number;
  status: EventStatus;
  active: boolean;
  posterUrl?: string;
  registeredStudents: { studentId: string; status: 'Registered' | 'Attended' | 'No-show' }[];
}

export type DriveStatus = 'Announced' | 'Open' | 'Closed' | 'Completed';

export interface DriveEligibilityCriteria {
  minTenth?: number;
  minTwelfth?: number;
  minGraduation?: number;
  gradYearFrom?: number;
  gradYearTo?: number;
  maxEducationGapYears?: number;
  allowActiveBacklog?: boolean;
  allowPastBacklog?: boolean;
  requiredSkills?: string[];
  location?: 'On-Campus' | 'Virtual';
  resumeRequired?: boolean;
}

export interface CampusDrive {
  id: string;
  company: string;
  role: string;
  ctcLpa: number;
  driveDate: string; // ISO date
  description?: string;
  deadline?: string; // ISO date
  criteria: DriveEligibilityCriteria;
  status: DriveStatus;
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
  courses: Course[];
  events: DepartmentEvent[];
  drives: CampusDrive[];
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
  updateStudent: (id: string, updates: Partial<Student>) => void;
  getStudentByEnrollment: (enrollment: string) => Student | undefined;
  addEvent: (evt: Omit<DepartmentEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<DepartmentEvent>) => void;
  deleteEvent: (id: string) => void;
  addDrive: (drv: Omit<CampusDrive, 'id'>) => void;
  updateDrive: (id: string, updates: Partial<CampusDrive>) => void;
  deleteDrive: (id: string) => void;
  addJob: (job: Omit<Job, 'id'>) => void;
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  enrollInJob: (studentId: string, jobId: string) => void;
  getCourses: () => Course[];
  upsertCourse: (course: Partial<Course> & { id?: string }) => void;
  updateCourseProgress: (courseId: string, studentId: string, progress: number, grade?: string) => void;
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
  { id: '1', enrollment_number: 'ENG20220045', name: 'Riya Sharma', email: 'riya.sharma@university.edu', phone: '+91-98200-00001', department: 'Computer Science', branch: 'CSE', cgpa: 8.7, tenthPercent: 92, twelfthPercent: 90, graduationPercent: 86, graduationPeriod: '2021-2025', educationGapYears: 0, pastBacklogs: 0, backlogs: 0, skills: ['Python','Data Analysis','SQL'], resumeUrl: 'https://example.com/resume/riya', blacklisted: false, enrolledJobs: 2 },
  { id: '2', enrollment_number: 'ENG20220046', name: 'Arjun Mehta', email: 'arjun.mehta@university.edu', phone: '+91-98200-00002', department: 'Computer Science', branch: 'CSE', cgpa: 7.9, tenthPercent: 88, twelfthPercent: 85, graduationPercent: 80, graduationPeriod: '2021-2025', educationGapYears: 0, pastBacklogs: 1, backlogs: 1, skills: ['Java','DSA'], resumeUrl: 'https://example.com/resume/arjun', blacklisted: false, enrolledJobs: 1 },
  { id: '3', enrollment_number: 'ENG20220047', name: 'Neha Verma', email: 'neha.verma@university.edu', phone: '+91-98200-00003', department: 'Computer Science', branch: 'CSE', cgpa: 9.1, tenthPercent: 94, twelfthPercent: 93, graduationPercent: 91, graduationPeriod: '2021-2025', educationGapYears: 0, pastBacklogs: 0, backlogs: 0, skills: ['ML','Python','Pandas'], resumeUrl: 'https://example.com/resume/neha', blacklisted: false, enrolledJobs: 3 },
  { id: '4', enrollment_number: 'ENG20220048', name: 'Karan Gupta', email: 'karan.gupta@university.edu', phone: '+91-98200-00004', department: 'Computer Science', branch: 'CSE', cgpa: 7.2, tenthPercent: 80, twelfthPercent: 78, graduationPercent: 72, graduationPeriod: '2021-2025', educationGapYears: 1, pastBacklogs: 2, backlogs: 2, skills: ['HTML','CSS'], resumeUrl: 'https://example.com/resume/karan', blacklisted: true, enrolledJobs: 0 },
  { id: '5', enrollment_number: 'ENG20220049', name: 'Aisha Khan', email: 'aisha.khan@university.edu', phone: '+91-98200-00005', department: 'Information Technology', branch: 'IT', cgpa: 8.3, tenthPercent: 90, twelfthPercent: 88, graduationPercent: 84, graduationPeriod: '2021-2025', educationGapYears: 0, pastBacklogs: 0, backlogs: 0, skills: ['JavaScript','React'], resumeUrl: 'https://example.com/resume/aisha', blacklisted: false, enrolledJobs: 1 },
  { id: '6', enrollment_number: 'ENR2024IT002', name: 'Rohan Das', email: 'rohan.das@university.edu', department: 'Information Technology', branch: 'IT', cgpa: 7.6, backlogs: 1, blacklisted: false, enrolledJobs: 2 },
  { id: '7', enrollment_number: 'ENR2024ECE001', name: 'Priya Nair', email: 'priya.nair@university.edu', department: 'Electronics', branch: 'ECE', cgpa: 8.9, backlogs: 0, blacklisted: false, enrolledJobs: 2 },
  { id: '8', enrollment_number: 'ENR2024ECE002', name: 'Vikram Singh', email: 'vikram.singh@university.edu', department: 'Electronics', branch: 'ECE', cgpa: 7.8, backlogs: 1, blacklisted: false, enrolledJobs: 1 },
  { id: '9', enrollment_number: 'ENR2024ME001', name: 'Suresh Rao', email: 'suresh.rao@university.edu', department: 'Mechanical', branch: 'ME', cgpa: 7.1, backlogs: 2, blacklisted: false, enrolledJobs: 0 },
  { id: '10', enrollment_number: 'ENR2024CIV001', name: 'Meera Joshi', email: 'meera.joshi@university.edu', department: 'Civil', branch: 'CE', cgpa: 8.0, backlogs: 0, blacklisted: false, enrolledJobs: 1 },
  { id: '11', enrollment_number: 'ENR2024CSE005', name: 'Dev Patel', email: 'dev.patel@university.edu', department: 'Computer Science', branch: 'CSE', cgpa: 8.5, backlogs: 0, blacklisted: false, enrolledJobs: 2 },
  { id: '12', enrollment_number: 'ENR2024CSE006', name: 'Sanya Kapoor', email: 'sanya.kapoor@university.edu', department: 'Computer Science', branch: 'CSE', cgpa: 9.2, backlogs: 0, blacklisted: false, enrolledJobs: 3 },
  { id: '13', enrollment_number: 'ENR2024CSE007', name: 'Rahul Jain', email: 'rahul.jain@university.edu', department: 'Computer Science', branch: 'CSE', cgpa: 6.9, backlogs: 3, blacklisted: true, enrolledJobs: 0 },
  { id: '14', enrollment_number: 'ENR2024IT003', name: 'Ananya Roy', email: 'ananya.roy@university.edu', department: 'Information Technology', branch: 'IT', cgpa: 8.1, backlogs: 0, blacklisted: false, enrolledJobs: 1 },
  { id: '15', enrollment_number: 'ENR2024ECE003', name: 'Harsh Vardhan', email: 'harsh.vardhan@university.edu', department: 'Electronics', branch: 'ECE', cgpa: 7.4, backlogs: 1, blacklisted: false, enrolledJobs: 1 },
  { id: '16', enrollment_number: 'ENR2024ME002', name: 'Ishita Malhotra', email: 'ishita.malhotra@university.edu', department: 'Mechanical', branch: 'ME', cgpa: 7.7, backlogs: 1, blacklisted: false, enrolledJobs: 1 },
  { id: '17', enrollment_number: 'ENR2024CIV002', name: 'Tushar Kulkarni', email: 'tushar.kulkarni@university.edu', department: 'Civil', branch: 'CE', cgpa: 7.9, backlogs: 0, blacklisted: false, enrolledJobs: 1 },
  { id: '18', enrollment_number: 'ENR2024CSE008', name: 'Sneha Iyer', email: 'sneha.iyer@university.edu', department: 'Computer Science', branch: 'CSE', cgpa: 8.8, backlogs: 0, blacklisted: false, enrolledJobs: 2 },
  { id: '19', enrollment_number: 'ENR2024CSE009', name: 'Manav Kapoor', email: 'manav.kapoor@university.edu', department: 'Computer Science', branch: 'CSE', cgpa: 8.0, backlogs: 0, blacklisted: false, enrolledJobs: 2 },
  { id: '20', enrollment_number: 'ENR2024IT004', name: 'Zoya Sheikh', email: 'zoya.sheikh@university.edu', department: 'Information Technology', branch: 'IT', cgpa: 8.4, backlogs: 0, blacklisted: false, enrolledJobs: 1 },
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
  {
    id: '4',
    title: 'Google SDE',
    company: 'Google',
    type: 'Full-time',
    department: 'Computer Science',
    deadline: '2025-12-20',
    applicants: 45,
    eligibility: ['CGPA > 8.0', 'No active backlogs'],
  },
  {
    id: '5',
    title: 'TCS Ninja',
    company: 'TCS',
    type: 'Full-time',
    department: 'Information Technology',
    deadline: '2025-12-15',
    applicants: 80,
    eligibility: ['CGPA > 7.0'],
  },
];

const initialCourses: Course[] = [
  {
    id: 'c1',
    name: 'Python for Data Science',
    description: 'Hands-on course covering Python, Pandas, NumPy, and data analysis.',
    durationWeeks: 8,
    skillsCovered: ['Python','Pandas','NumPy','Data Analysis'],
    status: 'Active',
    enrolled: [
      { studentId: '1', progress: 85, grade: 'A' },
      { studentId: '3', progress: 70, grade: 'B+' },
      { studentId: '5', progress: 60 },
    ],
  },
  {
    id: 'c2',
    name: 'Aptitude Training',
    description: 'Quantitative aptitude, logical reasoning, and verbal ability.',
    durationWeeks: 6,
    skillsCovered: ['Quant','LR','Verbal'],
    status: 'Active',
    enrolled: [
      { studentId: '1', progress: 92, grade: 'A+' },
      { studentId: '2', progress: 68, grade: 'B' },
      { studentId: '4', progress: 40 },
    ],
  },
  {
    id: 'c3',
    name: 'Web Development Basics',
    description: 'HTML, CSS, JavaScript fundamentals and modern tooling.',
    durationWeeks: 10,
    skillsCovered: ['HTML','CSS','JavaScript'],
    status: 'Inactive',
    enrolled: [
      { studentId: '2', progress: 55 },
      { studentId: '5', progress: 20 },
    ],
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
  {
    id: '3',
    title: 'Resume Workshop',
    date: '2025-10-25',
    time: '11:00 AM',
    location: 'Lab 2',
    attendees: 35,
  },
];

const initialEvents: DepartmentEvent[] = [
  {
    id: 'e1',
    title: 'AI Workshop 2025',
    description: 'Hands-on session on practical AI applications.',
    type: 'Workshop',
    date: '2025-11-10',
    time: '10:00',
    location: 'Auditorium',
    active: true,
    status: 'Upcoming',
    posterUrl: '',
    registeredStudents: [{ studentId: '1', status: 'Registered' }, { studentId: '3', status: 'Registered' }],
    maxParticipants: 150,
  },
  {
    id: 'e2',
    title: 'Placement Bootcamp',
    description: 'Intensive placement readiness program.',
    type: 'Training',
    date: '2025-10-20',
    time: '09:00',
    location: 'Lab 1',
    active: true,
    status: 'Ongoing',
    registeredStudents: [{ studentId: '2', status: 'Attended' }, { studentId: '5', status: 'Registered' }],
    maxParticipants: 100,
  },
  {
    id: 'e3',
    title: 'TechFest 2025',
    description: 'Annual department tech fest.',
    type: 'Hackathon',
    date: '2025-09-15',
    time: '12:00',
    onlineLink: 'https://meet.example.com/techfest',
    active: false,
    status: 'Completed',
    registeredStudents: [{ studentId: '4', status: 'No-show' }],
    maxParticipants: 500,
  },
];

const initialDrives: CampusDrive[] = [
  {
    id: 'd1',
    company: 'Infosys',
    role: 'System Engineer',
    ctcLpa: 5,
    driveDate: '2025-12-05',
    description: 'Infosys SE role for graduating batch.',
    deadline: '2025-11-25',
    criteria: { minGraduation: 60, allowActiveBacklog: false, requiredSkills: ['Java','DSA'], location: 'On-Campus', resumeRequired: true },
    status: 'Announced',
  },
  {
    id: 'd2',
    company: 'TCS',
    role: 'Ninja',
    ctcLpa: 4.5,
    driveDate: '2025-11-28',
    description: 'TCS Ninja hiring drive',
    deadline: '2025-11-18',
    criteria: { minTenth: 70, minTwelfth: 70, minGraduation: 60, location: 'Virtual' },
    status: 'Open',
  },
  {
    id: 'd3',
    company: 'Google',
    role: 'STEP Internship',
    ctcLpa: 15,
    driveDate: '2026-01-15',
    description: 'Google STEP intern program',
    deadline: '2025-12-20',
    criteria: { minGraduation: 80, requiredSkills: ['Python','ML'], location: 'Virtual', resumeRequired: true },
    status: 'Announced',
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
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [events, setEvents] = useState<DepartmentEvent[]>(initialEvents);
  const [drives, setDrives] = useState<CampusDrive[]>(initialDrives);
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

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(students.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const getStudentByEnrollment = (enrollment: string) => {
    return students.find(s => s.enrollment_number?.toLowerCase() === enrollment.toLowerCase());
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

  const addEvent = (evt: Omit<DepartmentEvent, 'id'>) => {
    const newEvt = { ...evt, id: Date.now().toString() };
    setEvents([newEvt, ...events]);
    addNotification({ title: 'Event Created', message: `${evt.title}`, type: 'meeting' });
  };

  const updateEvent = (id: string, updates: Partial<DepartmentEvent>) => {
    setEvents(events.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const addDrive = (drv: Omit<CampusDrive, 'id'>) => {
    const newDrv = { ...drv, id: Date.now().toString() };
    setDrives([newDrv, ...drives]);
    addNotification({ title: 'Drive Announced', message: `${drv.company} - ${drv.role}`, type: 'job' });
  };

  const updateDrive = (id: string, updates: Partial<CampusDrive>) => {
    setDrives(drives.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDrive = (id: string) => {
    setDrives(drives.filter(d => d.id !== id));
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

  const getCourses = () => courses;

  const upsertCourse = (course: Partial<Course> & { id?: string }) => {
    if (course.id) {
      setCourses(courses.map(c => (c.id === course.id ? { ...c, ...course } as Course : c)));
      return;
    }
    const newCourse: Course = {
      id: Date.now().toString(),
      name: course.name || 'New Course',
      description: course.description || '',
      durationWeeks: course.durationWeeks || 4,
      skillsCovered: course.skillsCovered || [],
      status: course.status || 'Active',
      enrolled: course.enrolled || [],
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourseProgress = (courseId: string, studentId: string, progress: number, grade?: string) => {
    setCourses(courses.map(c => {
      if (c.id !== courseId) return c;
      const exists = c.enrolled.find(e => e.studentId === studentId);
      if (exists) {
        return {
          ...c,
          enrolled: c.enrolled.map(e => e.studentId === studentId ? { ...e, progress, grade } : e),
        };
      }
      return { ...c, enrolled: [...c.enrolled, { studentId, progress, grade }] };
    }));
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
        courses,
        events,
        drives,
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
        updateStudent,
        getStudentByEnrollment,
        addEvent,
        updateEvent,
        deleteEvent,
        addDrive,
        updateDrive,
        deleteDrive,
        addJob,
        addMeeting,
        addAnnouncement,
        enrollInJob,
        getCourses,
        upsertCourse,
        updateCourseProgress,
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
