import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import DashboardLayout from '@/components/DashboardLayout';
import Breadcrumb from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const Reports = () => {
  const { analytics, colleges, departmentDetails } = useData();
  const { theme } = useTheme();
  const [yearFilter, setYearFilter] = useState('2025');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const COLORS = ['#00f3ff', '#ff00ff', '#00ff88', '#ffaa00', '#ff3366'];

  const handleGeneratePDF = () => {
    // Simple client-side print to PDF using browser dialog
    toast.success('Opening print dialog for PDF...');
    setTimeout(() => window.print(), 300);
  };

  const handleDownloadCSV = () => {
    const rows = [
      ['Metric','Value'],
      ...placementData.map((r) => [`Placements - ${r.college}`, String(r.placed)]),
      ...departmentData.map((d) => [`Dept % - ${d.name}`, String(d.percentage)]),
      ...jobDrivesData.map((d) => [`Drives - ${d.month}`, String(d.drives)]),
      ...studentGrowthData.map((d) => [`Students - ${d.month}`, String(d.students)]),
    ];
    const csv = rows.map(r => r.map(v => `"${v.replace?.(/"/g, '""') || v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reports-${yearFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Prepare data for charts (reactive to filters)
  // Colleges filter
  const filteredColleges = collegeFilter === 'all' 
    ? colleges 
    : colleges.filter((c) => c.id === collegeFilter);

  // Departments filter (scoped by college if selected)
  const filteredDepartments = departmentDetails.filter((d) => {
    const matchesCollege = collegeFilter === 'all' || d.collegeId === collegeFilter;
    const matchesDept = deptFilter === 'all' || d.id === deptFilter;
    return matchesCollege && matchesDept;
  });

  // Bar: Placements by College (demo: use students as proxy for placed)
  const placementData = filteredColleges.map((c) => ({
    college: c.name,
    placed: c.students,
  }));

  // Pie: Top Departments (demo: use students per department to compute percentage)
  const totalDeptStudents = filteredDepartments.reduce((sum, d) => sum + d.students, 0) || 1;
  const departmentAgg = filteredDepartments.map((d) => ({ name: d.name, students: d.students }));
  const departmentData = departmentAgg
    .map((d) => ({ name: d.name, percentage: Math.round((d.students / totalDeptStudents) * 100) }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)
    .map((dept, index) => ({ ...dept, fill: COLORS[index % COLORS.length] }));

  // Line/Area: generate reactive demo series influenced by filters and year
  const seed = `${yearFilter}-${collegeFilter}-${deptFilter}`;
  function seededRandomSequence(length: number, base: number, variance: number) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) h = (h ^ seed.charCodeAt(i)) * 16777619;
    const rand = () => {
      // xorshift32
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      return ((h >>> 0) % 1000) / 1000;
    };
    return Array.from({ length }, (_, i) => Math.max(0, Math.round(base + (rand() - 0.5) * variance)));
  }

  const drivesSeries = seededRandomSequence(12, 12, 12);
  const studentsSeries = seededRandomSequence(12, 300, 200).map((v, i, arr) => i === 0 ? v : Math.max(v, arr[i-1]));

  const jobDrivesData = drivesSeries.map((count, index) => ({
    month: `Month ${index + 1}`,
    drives: count,
  }));

  const studentGrowthData = studentsSeries.map((count, index) => ({
    month: `Month ${index + 1}`,
    students: count,
  }));

  return (
    <DashboardLayout userRole="admin">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Breadcrumb />
        
        <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            System-wide performance metrics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Download CSV
          </Button>
          <Button onClick={handleGeneratePDF} className="gap-2">
            <FileText className="w-4 h-4" />
            Generate PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Filter by Year</label>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Filter by College</label>
            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colleges</SelectItem>
                {colleges.map((college) => (
                  <SelectItem key={college.id} value={college.id}>
                    {college.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Filter by Department</label>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departmentDetails.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placements by College */}
        <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <h3 className="text-xl font-semibold mb-6">Placements by College</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={placementData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="college" 
                tick={{ fill: 'currentColor' }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: 'currentColor' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'neon' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.9)',
                  border: theme === 'neon' ? '1px solid #00f3ff' : '1px solid #d4af37',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="placed" fill={theme === 'neon' ? '#00f3ff' : '#d4af37'} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Performing Departments */}
        <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <h3 className="text-xl font-semibold mb-6">Top Performing Departments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'neon' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.9)',
                  border: theme === 'neon' ? '1px solid #00f3ff' : '1px solid #d4af37',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Job Drives This Month */}
        <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <h3 className="text-xl font-semibold mb-6">Job Drives Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={jobDrivesData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" tick={{ fill: 'currentColor' }} />
              <YAxis tick={{ fill: 'currentColor' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'neon' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.9)',
                  border: theme === 'neon' ? '1px solid #00f3ff' : '1px solid #d4af37',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="drives" 
                stroke={theme === 'neon' ? '#ff00ff' : '#d4af37'} 
                strokeWidth={2}
                dot={{ fill: theme === 'neon' ? '#ff00ff' : '#d4af37' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Student Growth Trend */}
        <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <h3 className="text-xl font-semibold mb-6">Student Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={studentGrowthData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" tick={{ fill: 'currentColor' }} />
              <YAxis tick={{ fill: 'currentColor' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'neon' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.9)',
                  border: theme === 'neon' ? '1px solid #00f3ff' : '1px solid #d4af37',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="students" 
                stroke={theme === 'neon' ? '#00ff88' : '#d4af37'} 
                fill={theme === 'neon' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(212, 175, 55, 0.2)'} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
