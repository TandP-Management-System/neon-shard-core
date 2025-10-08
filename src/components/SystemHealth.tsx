import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { Server, Database, Users, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SystemHealth = () => {
  const { theme } = useTheme();
  const { colleges } = useData();

  const activeColleges = colleges.filter(c => c.status === 'Active').length;
  const lastBackup = new Date().toLocaleDateString();
  const activeUsers = Math.floor(Math.random() * 150) + 50; // Mock data

  const healthMetrics = [
    { icon: Server, label: 'Active Colleges', value: activeColleges, color: 'text-green-500' },
    { icon: Database, label: 'Last Backup', value: lastBackup, color: 'text-blue-500' },
    { icon: Users, label: 'Active Users', value: activeUsers, color: 'text-purple-500' },
  ];

  return (
    <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">System Health</h2>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          All Systems Operational
        </Badge>
      </div>
      <div className="space-y-4">
        {healthMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  theme === 'neon' ? 'bg-primary/20' : 'bg-primary/10'
                }`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <span className="text-sm font-medium">{metric.label}</span>
              </div>
              <span className="text-sm font-bold">{metric.value}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SystemHealth;
