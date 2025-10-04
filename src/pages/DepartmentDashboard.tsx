import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
import { LogOut, GraduationCap, FileText, Calendar, Users } from 'lucide-react';

const DepartmentDashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const stats = [
    { icon: GraduationCap, label: 'Total Students', value: '156', color: 'text-primary' },
    { icon: Users, label: 'Faculty Members', value: '24', color: 'text-secondary' },
    { icon: FileText, label: 'Courses', value: '32', color: 'text-accent' },
    { icon: Calendar, label: 'Events', value: '8', color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse ${
          theme === 'neon' ? 'bg-primary' : 'bg-primary'
        }`} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${theme === 'neon' ? 'neon-glow' : ''}`}>
              Department Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome, {user?.name}!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              onClick={logout}
              variant="outline"
              className={theme === 'neon' ? 'neon-border' : 'luxe-glow'}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`p-6 ${
                  theme === 'neon' 
                    ? 'glass neon-border hover:shadow-[0_0_30px_rgba(0,243,255,0.3)]' 
                    : 'glass-luxe hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]'
                } transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    theme === 'neon' ? 'bg-primary/20' : 'bg-primary/20'
                  }`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`p-6 ${
            theme === 'neon' ? 'glass neon-border' : 'glass-luxe'
          }`}>
            <h2 className="text-2xl font-bold mb-4">Recent Announcements</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <h3 className="font-semibold mb-2">Mid-term Examinations</h3>
                <p className="text-sm text-muted-foreground">
                  Scheduled for next week. Please ensure all students are prepared.
                </p>
                <p className="text-xs text-muted-foreground mt-2">Posted 2 days ago</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <h3 className="font-semibold mb-2">Faculty Meeting</h3>
                <p className="text-sm text-muted-foreground">
                  Department meeting scheduled for Friday at 2 PM.
                </p>
                <p className="text-xs text-muted-foreground mt-2">Posted 4 days ago</p>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${
            theme === 'neon' ? 'glass neon-border' : 'glass-luxe'
          }`}>
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <GraduationCap className="mr-2 h-4 w-4" />
                Manage Students
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Manage Courses
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Events
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View Faculty
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
