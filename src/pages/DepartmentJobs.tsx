import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';

const DepartmentJobs = () => {
  const { theme } = useTheme();

  return (
    <DashboardLayout userRole="department">
      <div className="p-6 space-y-6">
        <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-6`}>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground">Create and manage department job postings.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentJobs;


