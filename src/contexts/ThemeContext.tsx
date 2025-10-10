import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'neon' | 'luxe';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'neon';
  });

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'luxe';
    root.classList.toggle('theme-luxe', isDark);
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'neon' ? 'luxe' : 'neon');
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'luxe', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
