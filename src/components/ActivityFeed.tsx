import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { formatDistanceToNow } from 'date-fns';
import { Building2, Users, Briefcase, CalendarDays, Bell } from 'lucide-react';

const ActivityFeed = () => {
  const { theme } = useTheme();
  const { notifications } = useData();

  const getIcon = (type: string) => {
    switch (type) {
      case 'college': return Building2;
      case 'job': return Briefcase;
      case 'meeting': return CalendarDays;
      case 'enrollment': return Users;
      default: return Bell;
    }
  };

  return (
    <Card className={`p-6 ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
      <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {notifications.slice(0, 8).map((notification) => {
          const Icon = getIcon(notification.type);
          return (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-3 rounded-lg transition-all duration-300 ${
                theme === 'neon' 
                  ? 'hover:bg-primary/5 hover:border-l-2 hover:border-primary' 
                  : 'hover:bg-primary/5 hover:border-l-2 hover:border-primary'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                theme === 'neon' ? 'bg-primary/20' : 'bg-primary/10'
              }`}>
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ActivityFeed;
