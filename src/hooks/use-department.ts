import { useMemo, useState } from 'react';
import { useData } from '@/contexts/DataContext';

export function useDepartmentStudents() {
  const { students, getStudentByEnrollment, addStudent, updateStudent } = useData();
  const [query, setQuery] = useState('');

  const student = useMemo(() => {
    if (!query) return undefined;
    return getStudentByEnrollment(query.trim());
  }, [query, getStudentByEnrollment]);

  return { students, query, setQuery, student, getStudentByEnrollment, addStudent, updateStudent };
}

export function useDepartmentCourses() {
  const { courses, getCourses, upsertCourse, updateCourseProgress } = useData();
  const data = useMemo(() => getCourses(), [courses]);
  return { courses: data, upsertCourse, updateCourseProgress };
}

export type ReportFilters = {
  courseId?: string;
  minScore?: number;
  enrollmentPeriod?: string;
  top?: number;
};

export function useDepartmentReports() {
  const { courses = [], students = [] } = useData() as any;
  const [filters, setFilters] = useState<ReportFilters>({});

  const rows = useMemo(() => {
    const results: { name: string; enrollment: string; avgScore: number; completion: number; courseName: string }[] = [];
    courses.forEach(course => {
      const courseName = course.name;
      (course.enrolled || []).forEach(en => {
        const st = students.find(s => s.id === en.studentId);
        if (!st) return;
        const row = {
          name: st.name,
          enrollment: st.enrollment_number || st.id,
          avgScore: Math.round((en.progress || 0)),
          completion: en.progress,
          courseName,
        };
        results.push(row);
      });
    });

    let filtered = results;
    if (filters.courseId) {
      const nameFilter = (courses.find((c: any) => c.id === filters.courseId) as any)?.name as string | undefined;
      filtered = nameFilter ? filtered.filter(r => r.courseName === nameFilter) : filtered;
    }
    if (filters.minScore !== undefined) {
      filtered = filtered.filter(r => r.avgScore >= filters.minScore!);
    }
    if (filters.top !== undefined) {
      filtered = [...filtered].sort((a, b) => b.avgScore - a.avgScore).slice(0, filters.top);
    }

    return filtered;
  }, [courses, students, filters]);

  return { filters, setFilters, rows, courses };
}

export function useEvents() {
  const { events = [], addEvent, updateEvent, deleteEvent } = useData() as any;
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
      const matchesType = !type || e.type === (type as any);
      const matchesStatus = !status || e.status === (status as any);
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, search, type, status]);

  return { events: filtered, addEvent, updateEvent, deleteEvent, search, setSearch, type, setType, status, setStatus };
}

export function useDrives() {
  const { drives = [], addDrive, updateDrive, deleteDrive, students = [] } = useData() as any;
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');

  const filtered = useMemo(() => {
    return drives.filter(d => {
      const matchesSearch = !search || `${d.company} ${d.role}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || d.status === (status as any);
      return matchesSearch && matchesStatus;
    });
  }, [drives, search, status]);

  return { drives: filtered, rawDrives: drives, addDrive, updateDrive, deleteDrive, students, search, setSearch, status, setStatus };
}

export function useEligibility() {
  const { students = [] } = useData() as any;
  const computeEligible = (criteria: {
    minTenth?: number;
    minTwelfth?: number;
    minGraduation?: number;
    gradYearFrom?: number;
    gradYearTo?: number;
    maxEducationGapYears?: number;
    allowActiveBacklog?: boolean;
    allowPastBacklog?: boolean;
    requiredSkills?: string[];
  }) => {
    return students.map(s => {
      let ok = true;
      if (criteria.minGraduation !== undefined) ok &&= (s.graduationPercent ?? (s.cgpa ? s.cgpa * 10 : 0)) >= criteria.minGraduation;
      if (criteria.minTenth !== undefined) ok &&= (s.tenthPercent ?? 0) >= criteria.minTenth;
      if (criteria.minTwelfth !== undefined) ok &&= (s.twelfthPercent ?? 0) >= criteria.minTwelfth;
      if (criteria.maxEducationGapYears !== undefined) ok &&= (s.educationGapYears ?? 0) <= criteria.maxEducationGapYears;
      if (criteria.allowActiveBacklog === false) ok &&= (s.backlogs ?? 0) === 0;
      if (criteria.allowPastBacklog === false) ok &&= (s.pastBacklogs ?? 0) === 0;
      if (criteria.requiredSkills && criteria.requiredSkills.length) {
        const have = (s.skills || []).map(x => x.toLowerCase());
        ok &&= criteria.requiredSkills.every(r => have.includes(r.toLowerCase()));
      }
      return { student: s, eligible: ok };
    });
  };

  return { computeEligible };
}


