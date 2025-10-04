import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
import { LogOut, BookOpen, Calendar, Award, FileText } from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const stats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '6', color: 'text-primary' },
    { icon: FileText, label: 'Assignments', value: '12', color: 'text-secondary' },
    { icon: Award, label: 'GPA', value: '3.8', color: 'text-accent' },
    { icon: Calendar, label: 'Upcoming Events', value: '4', color: 'text-primary' },
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
              Student Portal
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.name}!
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
            <h2 className="text-2xl font-bold mb-4">My Courses</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Data Structures</h3>
                  <span className="text-sm text-primary">CS301</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Next class: Monday 10:00 AM</span>
                  <span className="text-accent">85%</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Algorithms</h3>
                  <span className="text-sm text-primary">CS302</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Next class: Tuesday 2:00 PM</span>
                  <span className="text-accent">92%</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Database Systems</h3>
                  <span className="text-sm text-primary">CS303</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Next class: Wednesday 11:00 AM</span>
                  <span className="text-accent">88%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className={`p-6 ${
            theme === 'neon' ? 'glass neon-border' : 'glass-luxe'
          }`}>
            <h2 className="text-2xl font-bold mb-4">Upcoming Assignments</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <h3 className="font-semibold mb-2">Algorithm Analysis</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Due: Tomorrow, 11:59 PM
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">60% Complete</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <h3 className="font-semibold mb-2">Database Design Project</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Due: Friday, 11:59 PM
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">30% Complete</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
