import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="relative overflow-hidden group"
    >
      {theme === 'neon' ? (
        <Sparkles className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
      ) : (
        <Crown className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
