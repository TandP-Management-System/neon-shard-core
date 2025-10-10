import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
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
        <div className="text-center max-w-4xl mx-auto animate-fade-up will-change-transform">
          <div className="inline-block mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              theme === 'neon' 
                ? 'glass neon-border text-primary' 
                : 'glass-luxe text-primary'
            }`}>
              ✨ Next-Generation Platform
            </span>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight`}>
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">Transform</span> Your
            <br />
            <span className={theme === 'neon' ? 'neon-glow' : ''}>Digital Experience</span>
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

          {/* Trust logos / social proof */}
          <div className="mt-12 opacity-90">
            <div className="text-sm text-muted-foreground mb-4">Trusted by teams at</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
              {['NeonLabs','LuxeCorp','AJS-Tech','CyberWave','EduGrid','NovaWorks'].map((brand) => (
                <div key={brand} className={`h-10 flex items-center justify-center rounded-md ${theme === 'neon' ? 'glass' : 'glass-luxe'}`}>
                  <span className="text-xs md:text-sm font-medium">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with tabs */}
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

        <Tabs defaultValue="analytics" className="w-full mb-10">
          <TabsList className="grid grid-cols-3 max-w-xl mx-auto">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.slice(0, 3).map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-6 transition-all duration-300 hover:scale-[1.02] animate-fade-up`} style={{ animationDelay: `${index * 80}ms` }}>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${theme === 'neon' ? 'bg-primary/20' : 'bg-primary/20'}`}>
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="automation">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.slice(3, 6).map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-6 transition-all duration-300 hover:scale-[1.02] animate-fade-up`} style={{ animationDelay: `${index * 80}ms` }}>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${theme === 'neon' ? 'bg-primary/20' : 'bg-primary/20'}`}>
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[features[1], features[5], features[2]].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-6 transition-all duration-300 hover:scale-[1.02] animate-fade-up`} style={{ animationDelay: `${index * 80}ms` }}>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${theme === 'neon' ? 'bg-primary/20' : 'bg-primary/20'}`}>
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { k: 'Colleges', v: '120+' },
            { k: 'Departments', v: '450+' },
            { k: 'Students', v: '25k+' },
            { k: 'Placements', v: '9.2k' },
          ].map((s) => (
            <Card key={s.k} className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-4 text-center animate-fade-up`}>
              <div className="text-2xl font-bold text-primary">{s.v}</div>
              <div className="text-sm text-muted-foreground">{s.k}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'neon' ? 'neon-glow' : ''}`}>What our customers say</h2>
          <p className="text-muted-foreground">Real stories from teams using AJS-Hub</p>
        </div>
        <Carousel className="max-w-4xl mx-auto animate-fade-up-slow">
          <CarouselContent>
            {[
              { n: 'Priya S.', r: '“We onboarded 6 colleges in a week. The analytics are gold.”' },
              { n: 'Ravi K.', r: '“Best T&P ops dashboard I’ve used. Students love the flow.”' },
              { n: 'Aisha M.', r: '“Scheduling and placements tracking became effortless.”' },
            ].map((t, i) => (
              <CarouselItem key={i} className="basis-full">
                <Card className={`${theme === 'neon' ? 'glass neon-border' : 'glass-luxe'} p-8 text-center`}>
                  <p className="text-xl mb-4">{t.r}</p>
                  <div className="text-sm text-muted-foreground">{t.n}</div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* FAQ */}
      <section className="relative z-10 container mx-auto px-4 py-20 animate-fade-up">
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'neon' ? 'neon-glow' : ''}`}>Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>How fast can we get started?</AccordionTrigger>
            <AccordionContent>Instantly. Use the demo data today, connect your backend later.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is our data secure?</AccordionTrigger>
            <AccordionContent>Yes. Role-based access, encrypted storage, and audit logs (demo now).</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can we customize branding?</AccordionTrigger>
            <AccordionContent>Absolutely. Set platform name, logo, and theme in Settings.</AccordionContent>
          </AccordionItem>
        </Accordion>
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
