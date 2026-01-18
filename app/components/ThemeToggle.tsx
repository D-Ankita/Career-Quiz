'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('career-quiz-theme') as 'dark' | 'light';
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('career-quiz-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 p-3 rounded-full w-11 h-11 
        bg-white/5 backdrop-blur-md border border-white/10" />
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full 
        bg-white/10 backdrop-blur-md border border-white/20
        shadow-lg hover:shadow-xl transition-all duration-300
        dark:bg-white/5 dark:border-white/10"
      style={{
        background: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
        borderColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
