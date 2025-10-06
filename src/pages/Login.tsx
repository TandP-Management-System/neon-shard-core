import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import { Sparkles, LogIn, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success('Login successful!', {
          description: 'Redirecting to your dashboard...',
        });
      } else {
        toast.error('Invalid credentials', {
          description: 'Please check your email and password',
        });
      }
    } catch (error) {
      toast.error('Login failed', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@saas.com', role: 'Admin' },
    { email: 'dept1@saas.com', role: 'Department' },
    { email: 'student1@saas.com', role: 'Student' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
          theme === 'neon' ? 'bg-primary' : 'bg-primary'
        }`} />
        <div className={`absolute bottom-1/4 -right-48 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse delay-1000 ${
          theme === 'neon' ? 'bg-secondary' : 'bg-primary'
        }`} />
      </div>

      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <Card className={`relative z-10 w-full max-w-md p-8 ${
        theme === 'neon' ? 'glass neon-border' : 'glass-luxe'
      }`}>
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
            theme === 'neon' ? 'bg-primary/20 neon-border' : 'bg-primary/20 luxe-glow'
          }`}>
            {/*<Sparkles className="w-8 h-8 text-primary" />*/}
            <img
          src={logo}
          alt="Logo"
          className="w-6 h-6 object-contain"
        />

          </div>
          <h1 className={`text-3xl font-bold ${theme === 'neon' ? 'neon-glow' : ''}`}>
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={theme === 'neon' ? 'neon-border focus:neon-border' : 'luxe-glow'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={theme === 'neon' ? 'neon-border focus:neon-border' : 'luxe-glow'}
            />
          </div>

          <Button
            type="submit"
            className={`w-full ${
              theme === 'neon' 
                ? 'bg-primary hover:bg-primary/90 neon-border animate-glow' 
                : 'bg-primary hover:bg-primary/90 luxe-glow'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              'Signing in...'
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Demo Accounts Info */}
        <div className={`mt-8 p-4 rounded-lg ${
          theme === 'neon' ? 'bg-primary/10 border border-primary/20' : 'bg-primary/10 border border-primary/20'
        }`}>
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Demo Accounts</p>
              <p className="text-xs text-muted-foreground mt-1">
                Password: password123 for all accounts
              </p>
            </div>
          </div>
          <div className="space-y-1 text-xs">
            {demoAccounts.map((account) => (
              <div key={account.email} className="flex justify-between">
                <span className="text-muted-foreground">{account.role}:</span>
                <button
                  type="button"
                  onClick={() => setEmail(account.email)}
                  className="text-primary hover:underline"
                >
                  {account.email}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-primary hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Login;
