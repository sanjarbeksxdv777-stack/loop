'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { name: 'Bosh sahifa', href: '#home' },
  { name: 'Haqimda', href: '#about' },
  { name: 'Tajriba', href: '#experience' },
  { name: 'Ko\'nikmalar', href: '#skills' },
  { name: 'Loyihalar', href: '#projects' },
  { name: 'Aloqa', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <div
        className={`pointer-events-auto transition-all duration-500 rounded-full ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-2xl border border-border/50 shadow-sm py-3 px-6'
            : 'bg-transparent py-3 px-6'
        }`}
      >
        <div className="flex items-center justify-between gap-8 md:gap-12">
          <Link href="#home" className="text-xl font-semibold tracking-tight text-foreground">
            Sanjarbek.
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* Mobile Toggle */}
            <button
              className="md:hidden text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="absolute top-24 left-4 right-4 bg-background/95 backdrop-blur-3xl border border-border/50 rounded-3xl p-6 shadow-2xl md:hidden pointer-events-auto"
        >
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 text-2xl font-semibold tracking-tight text-foreground border-b border-border/30 last:border-0"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
