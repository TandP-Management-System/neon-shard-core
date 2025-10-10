import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Download } from 'lucide-react';

const DepartmentReports = () => {
  const { theme } = useTheme();

  return (
    <DashboardLayout userRole="department">
      <div className="p-6 space-y-6">
        <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Reports</h1>
              <p className="text-muted-foreground">Generate placement and activity reports.</p>
            </div>
            <Button className={theme === 'neon' ? 'neon-glow' : ''}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentReports;


