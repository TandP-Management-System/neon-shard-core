import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';

const DepartmentCourses = () => {
  const { theme } = useTheme();

  return (
    <DashboardLayout userRole="department">
      <div className="p-6 space-y-6">
        <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-6`}>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage department courses. (Coming soon)</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentCourses;


