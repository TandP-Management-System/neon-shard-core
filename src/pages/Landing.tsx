import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import logo from '../assets/logo.png'; 
import { 
  Zap, 
  Shield, 
  Rocket, 
  Users, 
  BarChart3, 
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Landing = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience blazing speed with our optimized infrastructure',
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Enterprise-grade security to protect your data',
    },
    {
      icon: Users,
      title: 'Role Management',
      description: 'Flexible role-based access control for teams',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Real-time insights and comprehensive reporting',
    },
    {
      icon: Rocket,
      title: 'Scalable',
      description: 'Grows with your organization seamlessly',
    },
    {
      icon: Lock,
      title: 'Private',
      description: 'Your data stays yours, always encrypted',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
          theme === 'neon' ? 'bg-primary' : 'bg-primary'
        }`} />
        <div className={`absolute bottom-1/4 -right-48 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse delay-1000 ${
          theme === 'neon' ? 'bg-secondary' : 'bg-primary'
        }`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse delay-500 ${
          theme === 'neon' ? 'bg-accent' : 'bg-primary'
        }`} />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              theme === 'neon' ? 'bg-primary/20 neon-border' : 'bg-primary/20 luxe-glow'
            }`}>
              {/*<Sparkles className="w-6 h-6 text-primary" />*/}
              <img
          src={logo}
          alt="Logo"
          className="w-6 h-6 object-contain"
        />

            </div>
            <span className={`text-2xl font-bold ${theme === 'neon' ? 'neon-glow' : ''}`}>
              AJS-Hub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" className={theme === 'neon' ? 'neon-border' : 'luxe-glow'}>
                Sign In
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              theme === 'neon' 
                ? 'glass neon-border text-primary' 
                : 'glass-luxe text-primary'
            }`}>
              ✨ Next-Generation Platform
            </span>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
            theme === 'neon' ? 'neon-glow' : ''
          }`}>
            Transform Your
            <br />
            Digital Experience
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Empower your organization with cutting-edge technology and seamless collaboration
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button 
                size="lg" 
                className={`group text-lg px-8 ${
                  theme === 'neon' 
                    ? 'bg-primary hover:bg-primary/90 neon-border animate-glow' 
                    : 'bg-primary hover:bg-primary/90 luxe-glow'
                }`}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className={`text-lg px-8 ${
                theme === 'neon' ? 'neon-border' : 'luxe-glow'
              }`}
              onClick={() => {
                const featuresSection = document.getElementById('features-section');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features-section" className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'neon' ? 'neon-glow' : ''
          }`}>
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to succeed in the digital age
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={`p-6 transition-all duration-300 hover:scale-105 ${
                  theme === 'neon' 
                    ? 'glass neon-border hover:shadow-[0_0_30px_rgba(0,243,255,0.3)]' 
                    : 'glass-luxe hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  theme === 'neon' ? 'bg-primary/20' : 'bg-primary/20'
                }`}>
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 mb-20">
        <Card className={`p-12 text-center ${
          theme === 'neon' 
            ? 'glass neon-border' 
            : 'glass-luxe'
        }`}>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            theme === 'neon' ? 'neon-glow' : ''
          }`}>
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of organizations already using AJS-Hub to transform their operations
          </p>
          <Link to="/login">
            <Button 
              size="lg"
              className={`text-lg px-12 ${
                theme === 'neon' 
                  ? 'bg-primary hover:bg-primary/90 neon-border animate-glow' 
                  : 'bg-primary hover:bg-primary/90 luxe-glow'
              }`}
            >
              Start Your Journey
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 AJS-Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
