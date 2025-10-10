import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartmentStudents, useDepartmentCourses, useDepartmentReports } from '@/hooks/use-department';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

const DepartmentStudents = () => {
  const { theme } = useTheme();
  const { query, setQuery, student, updateStudent, students, addStudent } = useDepartmentStudents();
  const { courses, upsertCourse, updateCourseProgress } = useDepartmentCourses();
  const { filters, setFilters, rows } = useDepartmentReports();

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [csvBusy, setCsvBusy] = useState(false);

  const onOpenEdit = () => {
    if (!student) return;
    setEditData(student);
    setEditOpen(true);
  };

  const onSaveEdit = () => {
    if (!editData) return;
    updateStudent(editData.id, editData);
    setEditOpen(false);
    toast.success('Student updated');
  };

  const parseCsv = async (file: File) => {
    setCsvBusy(true);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        toast.error('CSV has no data');
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim());
      const required = ['enrollment_number','name','email','department'];
      const hasRequired = required.every(r => headers.includes(r));
      if (!hasRequired) {
        toast.error('CSV missing required headers: enrollment_number,name,email,department');
        return;
      }
      const headerIndex: Record<string, number> = {};
      headers.forEach((h, i) => { headerIndex[h] = i; });
      let success = 0; let failed = 0;
      for (let i = 1; i < lines.length; i++) {
        const raw = lines[i];
        if (!raw.trim()) continue;
        const cols = raw.split(',');
        const get = (k: string) => (headerIndex[k] !== undefined ? cols[headerIndex[k]]?.trim() : '');
        try {
          const enrollment_number = get('enrollment_number');
          const name = get('name');
          const email = get('email');
          const department = get('department');
          if (!enrollment_number || !name || !email || !department) throw new Error('missing required');
          if (students.some(s => (s.enrollment_number || '').toLowerCase() === enrollment_number.toLowerCase())) {
            failed++; continue;
          }
          const branch = get('branch') || undefined;
          const phone = get('phone') || undefined;
          const cgpaStr = get('cgpa');
          const backlogsStr = get('backlogs');
          const cgpa = cgpaStr ? Number(cgpaStr) : undefined;
          const backlogs = backlogsStr ? Number(backlogsStr) : undefined;
          const skills = get('skills') ? get('skills').split('|').map(s => s.trim()).filter(Boolean) : undefined;
          addStudent({
            enrollment_number,
            name,
            email,
            department,
            branch,
            phone,
            cgpa,
            backlogs,
            skills,
            enrolledJobs: 0,
          });
          success++;
        } catch {
          failed++;
        }
      }
      toast.success(`Import complete: ${success} added, ${failed} skipped`);
    } catch (e) {
      toast.error('Failed to import CSV');
    } finally {
      setCsvBusy(false);
    }
  };

  return (
    <DashboardLayout userRole="department">
      <div className="p-6 space-y-6">
        <Tabs defaultValue="students">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6 mt-4">
            <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-6`}>
              <h2 className="text-xl font-semibold mb-4">Search by Enrollment ID</h2>
              <div className="flex gap-3 max-w-xl">
                <Input placeholder="e.g., ENG20220045" value={query} onChange={(e) => setQuery(e.target.value)} className={theme === 'neon' ? 'neon-border' : 'luxe-glow'} />
                <Button onClick={() => { if (!student) toast.error('No Student Found'); }} className={theme === 'neon' ? 'neon-glow' : ''}>Search</Button>
              </div>

              {query && !student && (
                <div className="mt-4 text-sm text-red-500">No Student Found</div>
              )}

              {student && (
                <div className="mt-6 grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-4`}>
                      <div className="font-semibold">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.enrollment_number}</div>
                      <div className="text-sm text-muted-foreground">{student.department} • {student.branch}</div>
                      <div className="text-sm mt-2">Email: {student.email}</div>
                      <div className="text-sm">Phone: {student.phone || '—'}</div>
                      <div className="text-sm">CGPA: {student.cgpa ?? '—'}</div>
                      <div className="text-sm">Backlogs: {student.backlogs ?? 0} (Past: {student.pastBacklogs ?? 0})</div>
                      <div className="text-sm">Skills: {(student.skills || []).join(', ') || '—'}</div>
                      <div className="text-sm truncate">Resume: {student.resumeUrl ? <a className="text-primary underline" href={student.resumeUrl} target="_blank">Link</a> : '—'}</div>
                      <div className="mt-3">
                        <Button size="sm" onClick={onOpenEdit} className={theme === 'neon' ? 'neon-glow' : ''}>Edit Profile</Button>
                      </div>
                    </Card>
                    <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-4`}>
                      <div className="font-semibold mb-2">Academics</div>
                      <div className="text-sm">10th %: {student.tenthPercent ?? '—'} | 12th %: {student.twelfthPercent ?? '—'}</div>
                      <div className="text-sm">Graduation %: {student.graduationPercent ?? '—'}</div>
                      <div className="text-sm">Graduation Period: {student.graduationPeriod ?? '—'}</div>
                      <div className="text-sm">Education Gap: {student.educationGapYears ?? 0} years</div>
                      <div className="text-sm mt-2">Blacklisted: {student.blacklisted ? 'Yes' : 'No'}</div>
                    </Card>
                  </div>

                  <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-4`}>
                    <div className="font-semibold mb-3">Current Course Enrollments</div>
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Grade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(courses || []).flatMap(c => (c.enrolled || []).filter(e => e.studentId === student.id).map(e => ({ c, e }))).map(({ c, e }) => (
                            <TableRow key={`${c.id}-${e.studentId}`}>
                              <TableCell className="font-medium">{c.name}</TableCell>
                              <TableCell>{e.progress}%</TableCell>
                              <TableCell>{e.grade || '—'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Card>
                </div>
              )}

              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
                  <DialogHeader>
                    <DialogTitle>Edit Student Profile</DialogTitle>
                  </DialogHeader>
                  {editData && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input value={editData.phone || ''} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
                      </div>
                      <div>
                        <Label>Resume URL</Label>
                        <Input value={editData.resumeUrl || ''} onChange={(e) => setEditData({ ...editData, resumeUrl: e.target.value })} />
                      </div>
                      <div>
                        <Label>CGPA</Label>
                        <Input type="number" value={editData.cgpa || 0} onChange={(e) => setEditData({ ...editData, cgpa: Number(e.target.value) })} />
                      </div>
                      <div>
                        <Label>Backlogs</Label>
                        <Input type="number" value={editData.backlogs || 0} onChange={(e) => setEditData({ ...editData, backlogs: Number(e.target.value) })} />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Password (reset)</Label>
                        <Input type="password" placeholder="Set new password" />
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={onSaveEdit} className={theme === 'neon' ? 'neon-glow' : ''}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>

            <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-6`}>
              <h2 className="text-xl font-semibold mb-4">Import Students (CSV)</h2>
              <p className="text-sm text-muted-foreground mb-3">Required headers: enrollment_number, name, email, department. Optional: branch, phone, cgpa, backlogs, skills (pipe-separated).</p>
              <Input type="file" accept=".csv" onChange={(e) => { const f = e.target.files?.[0]; if (f) parseCsv(f); }} disabled={csvBusy} />
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6 mt-4">
            <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Course Overview</h2>
                <Button onClick={() => upsertCourse({ name: 'New Course', description: '', durationWeeks: 4, skillsCovered: [], status: 'Active', enrolled: [] })} className={theme === 'neon' ? 'neon-glow' : ''}>Add Course</Button>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Enrolled Students</TableHead>
                      <TableHead>Completion %</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(courses || []).map(c => {
                      const avg = c.enrolled.length ? Math.round(c.enrolled.reduce((s, e) => s + e.progress, 0) / c.enrolled.length) : 0;
                      return (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell>{c.enrolled.length}</TableCell>
                          <TableCell>{avg}%</TableCell>
                          <TableCell>{c.status}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 mt-4">
            <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-6`}>
              <h2 className="text-xl font-semibold mb-4">Performance Filters</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label>Course</Label>
                  <Select value={filters.courseId || ''} onValueChange={(v) => setFilters({ ...filters, courseId: v || undefined })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      {(courses || []).map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Score ≥</Label>
                  <Input type="number" placeholder="e.g., 80" value={filters.minScore ?? ''} onChange={(e) => setFilters({ ...filters, minScore: e.target.value ? Number(e.target.value) : undefined })} />
                </div>
                <div>
                  <Label>Top Performers</Label>
                  <Select value={(filters.top || '').toString()} onValueChange={(v) => setFilters({ ...filters, top: v ? Number(v) : undefined })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="10">Top 10</SelectItem>
                      <SelectItem value="25">Top 25</SelectItem>
                      <SelectItem value="50">Top 50</SelectItem>
                      <SelectItem value="100">Top 100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => toast.success('Exported CSV')}>Export CSV</Button>
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Enrollment ID</TableHead>
                      <TableHead>Avg. Score</TableHead>
                      <TableHead>Completion %</TableHead>
                      <TableHead>Course</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(rows || []).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.enrollment}</TableCell>
                        <TableCell>{r.avgScore}</TableCell>
                        <TableCell>{r.completion}%</TableCell>
                        <TableCell>{r.courseName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentStudents;


