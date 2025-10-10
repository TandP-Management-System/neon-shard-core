import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTheme } from '@/contexts/ThemeContext';
import { useEligibility, useEvents, useDrives } from '@/hooks/use-department';
import { useMemo, useState } from 'react';
import { Calendar, Building2, ClipboardList, Users } from 'lucide-react';
import { toast } from 'sonner';

const pageSize = 10;

const DepartmentEvents = () => {
  const { theme } = useTheme();
  const { events, addEvent, updateEvent, deleteEvent, search, setSearch, type, setType, status, setStatus } = useEvents();
  const { drives, rawDrives, addDrive, updateDrive, deleteDrive, students, search: dSearch, setSearch: setDSearch, status: dStatus, setStatus: setDStatus } = useDrives();
  const { computeEligible } = useEligibility();

  const [evtModalOpen, setEvtModalOpen] = useState(false);
  const [drvModalOpen, setDrvModalOpen] = useState(false);
  const [evtView, setEvtView] = useState<any>(null);
  const [drvView, setDrvView] = useState<any>(null);
  const [evtForm, setEvtForm] = useState<any>({ title: '', description: '', type: 'Workshop', date: '', time: '', location: '', onlineLink: '', maxParticipants: 0, active: true, status: 'Upcoming', posterUrl: '' });
  const [drvForm, setDrvForm] = useState<any>({ company: '', role: '', ctcLpa: 0, driveDate: '', description: '', deadline: '', criteria: { location: 'On-Campus', resumeRequired: false }, status: 'Announced' });
  const [evtPage, setEvtPage] = useState(1);
  const [drvPage, setDrvPage] = useState(1);

  const evtPaged = useMemo(() => {
    const start = (evtPage - 1) * pageSize;
    return events.slice(start, start + pageSize);
  }, [events, evtPage]);

  const drvPaged = useMemo(() => {
    const start = (drvPage - 1) * pageSize;
    return drives.slice(start, start + pageSize);
  }, [drives, drvPage]);

  const createOrEditEvent = () => {
    if (!evtForm.title || !evtForm.date) {
      toast.error('Please fill required fields');
      return;
    }
    if (evtForm.id) {
      updateEvent(evtForm.id, evtForm);
      toast.success('Event updated');
    } else {
      addEvent({ ...evtForm, registeredStudents: evtForm.registeredStudents || [] });
      toast.success('Event created');
    }
    setEvtModalOpen(false);
  };

  const createOrEditDrive = () => {
    if (!drvForm.company || !drvForm.role || !drvForm.driveDate) {
      toast.error('Please fill required fields');
      return;
    }
    if (drvForm.id) {
      updateDrive(drvForm.id, drvForm);
      toast.success('Drive updated');
    } else {
      addDrive(drvForm);
      toast.success('Drive created');
    }
    setDrvModalOpen(false);
  };

  const exportCsv = (rows: { [k: string]: any }[], filename: string) => {
    const headers = Object.keys(rows[0] || { id: 'ID' });
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => `${(r[h] ?? '').toString().replace(/,/g, ';')}`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };

  const onViewEvent = (e: any) => setEvtView(e);
  const onViewDrive = (d: any) => setDrvView(d);

  const eventParticipants = useMemo(() => {
    if (!evtView) return [];
    return (evtView.registeredStudents || []).map((r: any) => {
      const st = students.find(s => s.id === r.studentId);
      return { name: st?.name || 'Unknown', enrollment: st?.enrollment_number || st?.id, status: r.status };
    });
  }, [evtView, students]);

  const eligibleForDrive = useMemo(() => {
    if (!drvView) return [];
    const results = computeEligible({
      minTenth: drvView.criteria?.minTenth,
      minTwelfth: drvView.criteria?.minTwelfth,
      minGraduation: drvView.criteria?.minGraduation,
      maxEducationGapYears: drvView.criteria?.maxEducationGapYears,
      allowActiveBacklog: drvView.criteria?.allowActiveBacklog,
      allowPastBacklog: drvView.criteria?.allowPastBacklog,
      requiredSkills: drvView.criteria?.requiredSkills,
    });
    return results.map(r => ({ name: r.student.name, enrollment: r.student.enrollment_number || r.student.id, eligible: r.eligible ? 'Yes' : 'No' }));
  }, [drvView, computeEligible]);

  return (
    <DashboardLayout userRole="department">
      <div className="p-6 space-y-6">
        {/* Insight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Calendar, label: 'Upcoming Events', value: events.filter(e => e.status === 'Upcoming').length },
            { icon: ClipboardList, label: 'Active Drives', value: rawDrives.filter(d => d.status === 'Open' || d.status === 'Announced').length },
            { icon: Users, label: 'Total Participants Registered', value: events.reduce((s, e) => s + (e.registeredStudents?.length || 0), 0) },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <Card key={i} className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-4 flex items-center justify-between`}>
                <div>
                  <div className="text-sm text-muted-foreground">{c.label}</div>
                  <div className="text-2xl font-bold">{c.value}</div>
                </div>
                <Icon className="w-6 h-6 text-primary" />
              </Card>
            );
          })}
        </div>

        <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-6`}>
          <Tabs defaultValue="events">
            <TabsList className="grid grid-cols-2 max-w-xs">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="drives">Campus Drives</TabsTrigger>
            </TabsList>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4 mt-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="max-w-xs">
                  <Label>Search</Label>
                  <Input placeholder="Search events" value={search} onChange={(e) => { setSearch(e.target.value); setEvtPage(1); }} className={theme === 'neon' ? 'neon-border' : 'luxe-glow'} />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v) => { setType(v); setEvtPage(1); }}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      {['Workshop','Seminar','Hackathon','Training','Webinar'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => { setStatus(v); setEvtPage(1); }}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      {['Upcoming','Ongoing','Completed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => { setEvtForm({ title: '', description: '', type: 'Workshop', date: '', time: '', location: '', onlineLink: '', maxParticipants: 0, active: true, status: 'Upcoming', posterUrl: '' }); setEvtModalOpen(true); }} className={theme === 'neon' ? 'neon-glow' : ''}>Create Event</Button>
              </div>

              {events.length === 0 && (
                <div className="text-sm text-muted-foreground py-10 text-center">No events created yet — start by organizing your first one!</div>
              )}

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {evtPaged.map(e => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.title}</TableCell>
                        <TableCell>{e.date}{e.time ? ` ${e.time}` : ''}</TableCell>
                        <TableCell>{e.type}</TableCell>
                        <TableCell>{e.status}</TableCell>
                        <TableCell>{e.registeredStudents?.length || 0}</TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => onViewEvent(e)}>View</Button>
                          <Button size="sm" variant="outline" onClick={() => { setEvtForm(e); setEvtModalOpen(true); }}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteEvent(e.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end items-center gap-2">
                <Button variant="outline" disabled={evtPage === 1} onClick={() => setEvtPage(p => p - 1)}>Prev</Button>
                <div className="text-sm">Page {evtPage}</div>
                <Button variant="outline" disabled={evtPage * pageSize >= events.length} onClick={() => setEvtPage(p => p + 1)}>Next</Button>
              </div>
            </TabsContent>

            {/* Drives Tab */}
            <TabsContent value="drives" className="space-y-4 mt-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="max-w-xs">
                  <Label>Search</Label>
                  <Input placeholder="Search company/role" value={dSearch} onChange={(e) => { setDSearch(e.target.value); setDrvPage(1); }} className={theme === 'neon' ? 'neon-border' : 'luxe-glow'} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={dStatus} onValueChange={(v) => { setDStatus(v); setDrvPage(1); }}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      {['Announced','Open','Closed','Completed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => { setDrvForm({ company: '', role: '', ctcLpa: 0, driveDate: '', description: '', deadline: '', criteria: { location: 'On-Campus', resumeRequired: false }, status: 'Announced' }); setDrvModalOpen(true); }} className={theme === 'neon' ? 'neon-glow' : ''}>Create Drive</Button>
              </div>

              {drives.length === 0 && (
                <div className="text-sm text-muted-foreground py-10 text-center">No drives created yet — announce your first campus drive!</div>
              )}

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Package (LPA)</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drvPaged.map(d => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.company}</TableCell>
                        <TableCell>{d.role}</TableCell>
                        <TableCell>{d.ctcLpa}</TableCell>
                        <TableCell>{d.driveDate}</TableCell>
                        <TableCell>{d.status}</TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => onViewDrive(d)}>Eligible</Button>
                          <Button size="sm" variant="outline" onClick={() => { setDrvForm(d); setDrvModalOpen(true); }}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteDrive(d.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end items-center gap-2">
                <Button variant="outline" disabled={drvPage === 1} onClick={() => setDrvPage(p => p - 1)}>Prev</Button>
                <div className="text-sm">Page {drvPage}</div>
                <Button variant="outline" disabled={drvPage * pageSize >= drives.length} onClick={() => setDrvPage(p => p + 1)}>Next</Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Event Form Modal */}
        <Dialog open={evtModalOpen} onOpenChange={setEvtModalOpen}>
          <DialogContent className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
            <DialogHeader><DialogTitle>{evtForm?.id ? 'Edit Event' : 'Create Event'}</DialogTitle></DialogHeader>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input value={evtForm.title} onChange={(e) => setEvtForm({ ...evtForm, title: e.target.value })} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={evtForm.type} onValueChange={(v) => setEvtForm({ ...evtForm, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Workshop','Seminar','Hackathon','Training','Webinar'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={evtForm.date} onChange={(e) => setEvtForm({ ...evtForm, date: e.target.value })} />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" value={evtForm.time} onChange={(e) => setEvtForm({ ...evtForm, time: e.target.value })} />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={evtForm.location} onChange={(e) => setEvtForm({ ...evtForm, location: e.target.value })} />
              </div>
              <div>
                <Label>Online Link</Label>
                <Input value={evtForm.onlineLink} onChange={(e) => setEvtForm({ ...evtForm, onlineLink: e.target.value })} />
              </div>
              <div>
                <Label>Max Participants</Label>
                <Input type="number" value={evtForm.maxParticipants} onChange={(e) => setEvtForm({ ...evtForm, maxParticipants: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={evtForm.status} onValueChange={(v) => setEvtForm({ ...evtForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Upcoming','Ongoing','Completed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Input value={evtForm.description} onChange={(e) => setEvtForm({ ...evtForm, description: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEvtModalOpen(false)}>Cancel</Button>
              <Button onClick={createOrEditEvent} className={theme === 'neon' ? 'neon-glow' : ''}>{evtForm?.id ? 'Save' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Event Details Modal */}
        <Dialog open={!!evtView} onOpenChange={(o) => { if (!o) setEvtView(null); }}>
          <DialogContent className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
            <DialogHeader><DialogTitle>Event Details</DialogTitle></DialogHeader>
            {evtView && (
              <div className="space-y-3">
                <div className="text-lg font-semibold">{evtView.title}</div>
                <div className="text-sm text-muted-foreground">{evtView.type} • {evtView.date} {evtView.time}</div>
                <div className="text-sm">{evtView.description}</div>
                <div className="text-sm">Location: {evtView.location || evtView.onlineLink || '—'}</div>
                <div className="text-sm">Status: {evtView.status}</div>
                <div className="font-semibold mt-4">Participants</div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Enrollment</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventParticipants.map((p, i) => (
                        <TableRow key={i}>
                          <TableCell>{p.name}</TableCell>
                          <TableCell>{p.enrollment}</TableCell>
                          <TableCell>{p.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => exportCsv(eventParticipants, 'participants.csv')}>Export CSV</Button>
                  <Button variant="outline" onClick={() => { updateEvent(evtView.id, { status: 'Completed' }); toast.success('Marked as Completed'); }}>Mark as Completed</Button>
                  <Button variant="destructive" onClick={() => { deleteEvent(evtView.id); setEvtView(null); }}>Delete</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Drive Form Modal */}
        <Dialog open={drvModalOpen} onOpenChange={setDrvModalOpen}>
          <DialogContent className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
            <DialogHeader><DialogTitle>{drvForm?.id ? 'Edit Drive' : 'Create Drive'}</DialogTitle></DialogHeader>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Company</Label>
                <Input value={drvForm.company} onChange={(e) => setDrvForm({ ...drvForm, company: e.target.value })} />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={drvForm.role} onChange={(e) => setDrvForm({ ...drvForm, role: e.target.value })} />
              </div>
              <div>
                <Label>CTC (LPA)</Label>
                <Input type="number" value={drvForm.ctcLpa} onChange={(e) => setDrvForm({ ...drvForm, ctcLpa: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Drive Date</Label>
                <Input type="date" value={drvForm.driveDate} onChange={(e) => setDrvForm({ ...drvForm, driveDate: e.target.value })} />
              </div>
              <div>
                <Label>Deadline</Label>
                <Input type="date" value={drvForm.deadline} onChange={(e) => setDrvForm({ ...drvForm, deadline: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={drvForm.status} onValueChange={(v) => setDrvForm({ ...drvForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Announced','Open','Closed','Completed'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Input value={drvForm.description} onChange={(e) => setDrvForm({ ...drvForm, description: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Eligibility (optional, comma-separated skills)</Label>
                <Input placeholder="required skills" value={(drvForm.criteria.requiredSkills || []).join(', ')} onChange={(e) => setDrvForm({ ...drvForm, criteria: { ...drvForm.criteria, requiredSkills: e.target.value.split(',').map((x: string) => x.trim()).filter(Boolean) } })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDrvModalOpen(false)}>Cancel</Button>
              <Button onClick={createOrEditDrive} className={theme === 'neon' ? 'neon-glow' : ''}>{drvForm?.id ? 'Save' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Eligible Students Modal */}
        <Dialog open={!!drvView} onOpenChange={(o) => { if (!o) setDrvView(null); }}>
          <DialogContent className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
            <DialogHeader><DialogTitle>Eligible Students</DialogTitle></DialogHeader>
            {drvView && (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">{drvView.company} — {drvView.role}</div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Enrollment</TableHead>
                        <TableHead>Eligible</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eligibleForDrive.map((r, i) => (
                        <TableRow key={i}>
                          <TableCell>{r.name}</TableCell>
                          <TableCell>{r.enrollment}</TableCell>
                          <TableCell>{r.eligible}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => exportCsv(eligibleForDrive, 'eligible.csv')}>Download Eligible (CSV)</Button>
                  <Button onClick={() => toast.success('Invites sent (demo)')}>Send Invite</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentEvents;


