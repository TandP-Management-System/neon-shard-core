import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationCenter from '@/components/NotificationCenter';
import logo from '../assets/logo.png';
import { 
  LogOut, 
  LayoutDashboard,
  Users,
  Building2,
  GraduationCap,
  FileText,
  Calendar,
  Briefcase,
  Bell,
  Settings,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'department' | 'student';
}

const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getNavItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
          { icon: Building2, label: 'Colleges', path: '/admin/colleges' },
          { icon: Users, label: 'Departments', path: '/admin/departments' },
          { icon: Briefcase, label: 'Reports', path: '/admin/reports' },
          { icon: FileText, label: 'Audit Logs', path: '/admin/logs' },
          { icon: Settings, label: 'Settings', path: '/admin/settings' },
        ];
      case 'department':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/department/dashboard' },
          { icon: GraduationCap, label: 'Students', path: '/department/students' },
          { icon: Briefcase, label: 'Job Postings', path: '/department/jobs' },
          { icon: Calendar, label: 'Events & Drives', path: '/department/events' },
          { icon: FileText, label: 'Reports', path: '/department/reports' },
          { icon: Bell, label: 'Announcements', path: '/department/announcements' },
          { icon: Settings, label: 'Settings', path: '/department/settings' },
        ];
      case 'student':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
          { icon: BookOpen, label: 'My Courses', path: '/student/courses' },
          { icon: Briefcase, label: 'Jobs', path: '/student/jobs' },
          { icon: FileText, label: 'Assignments', path: '/student/assignments' },
          { icon: Award, label: 'Grades', path: '/student/grades' },
          { icon: Bell, label: 'Notices', path: '/student/notices' },
          { icon: Settings, label: 'Settings', path: '/student/settings' },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          theme === 'neon' ? 'glass neon-border' : 'glass-luxe'
        } border-r transition-all duration-300 flex flex-col relative shrink-0`}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-border">
          {!sidebarCollapsed && (
            <h2 className={`text-2xl font-bold ${theme === 'neon' ? 'neon-glow' : ''}`}>
              AJS-Hub
            </h2>
          )}
          {/*{sidebarCollapsed && (
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
              theme === 'neon' ? 'bg-primary/20 neon-border' : 'bg-primary/20 luxe-glow'
            }`}>
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
          )}*/}

          {sidebarCollapsed && (
  <div
    className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto ${
      theme === 'neon' ? 'bg-primary/20 neon-border' : 'bg-primary/20 luxe-glow'
    }`}
  >
    <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
  </div>
)}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? theme === 'neon'
                      ? 'bg-primary/20 text-primary neon-border'
                      : 'bg-primary/20 text-primary luxe-glow'
                    : 'hover:bg-accent/10'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center ${
            theme === 'neon' 
              ? 'bg-primary/20 neon-border hover:bg-primary/30' 
              : 'bg-primary/20 luxe-glow hover:bg-primary/30'
          } transition-all`}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-primary" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-primary" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Topbar */}
        <header className={`h-16 ${
          theme === 'neon' ? 'glass neon-border' : 'glass-luxe'
        } border-b flex items-center justify-between px-4 md:px-6`}>
          <div>
            <h1 className="text-xl font-semibold">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-muted-foreground">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Portal
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-3 px-2 py-1 rounded-lg ${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={''} alt={user?.name} />
                    <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('').slice(0,2) || 'DP'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
                <DropdownMenuLabel>Department</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/department/settings')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/department/settings')}>Change Password</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 min-w-0 overflow-auto relative">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse ${
              theme === 'neon' ? 'bg-primary' : 'bg-primary'
            }`} />
            <div className={`absolute bottom-1/4 -right-48 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse delay-1000 ${
              theme === 'neon' ? 'bg-secondary' : 'bg-primary'
            }`} />
          </div>
          
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
