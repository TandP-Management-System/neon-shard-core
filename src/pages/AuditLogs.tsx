import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Breadcrumb from '@/components/Breadcrumb';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const AuditLogs = () => {
  const { theme } = useTheme();
  const { notifications } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Convert notifications to audit logs format
  const auditLogs = notifications.map((notif, index) => ({
    id: notif.id,
    description: notif.message,
    performedBy: 'System Admin',
    role: notif.type === 'college' ? 'Admin' : notif.type === 'department' ? 'College TPO' : 'System',
    type: notif.type,
    timestamp: notif.timestamp,
  }));

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearLogs = () => {
    toast.success('Logs cleared successfully', {
      description: 'All audit logs have been cleared from the system',
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      college: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      department: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      job: 'bg-green-500/10 text-green-500 border-green-500/30',
      meeting: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      announcement: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
      enrollment: 'bg-pink-500/10 text-pink-500 border-pink-500/30',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500 border-gray-500/30';
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6 space-y-6">
        <Breadcrumb />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">System Activity Logs</h1>
            <p className="text-muted-foreground">
              Monitor all system activities and user actions
            </p>
          </div>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleClearLogs}
          >
            <Trash2 className="w-4 h-4" />
            Clear Logs
          </Button>
        </div>

        {/* Filters */}
        <Card className={`p-4 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by description or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="job">Job</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="enrollment">Enrollment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Logs Table */}
        <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Activity Logs</h2>
            <Badge variant="outline">{filteredLogs.length} Total Logs</Badge>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm">#{log.id}</TableCell>
                      <TableCell className="font-medium max-w-md">{log.description}</TableCell>
                      <TableCell>{log.performedBy}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getTypeColor(log.type)}>
                          {log.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;
