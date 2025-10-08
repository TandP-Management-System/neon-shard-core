import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  color?: string;
}

const StatsCard = ({ icon: Icon, label, value, change, color = 'text-primary' }: StatsCardProps) => {
  const { theme } = useTheme();

  return (
    <Card
      className={`p-6 ${
        theme === 'neon' 
          ? 'glass neon-border hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:scale-105' 
          : 'glass-luxe hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:scale-105'
      } transition-all duration-300 cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
          theme === 'neon' ? 'bg-primary/20 neon-border' : 'bg-primary/10 border border-primary/30'
        }`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
        {change && (
          <div className={`text-sm font-medium ${
            change.startsWith('+') ? 'text-green-500' : 'text-red-500'
          }`}>
            {change}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-4xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
};

export default StatsCard;
