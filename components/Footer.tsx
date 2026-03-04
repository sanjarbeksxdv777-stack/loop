'use client';

import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start">
          <Link href="#home" className="text-2xl font-semibold tracking-tight mb-2">
            Sanjarbek.
          </Link>
          <p className="text-sm font-medium text-muted-foreground text-center md:text-left">
            &copy; {currentYear} Sanjarbek Otabekov. Barcha huquqlar himoyalangan.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link href="https://github.com/OtabekovsProject" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="w-6 h-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://www.linkedin.com/in/sanjarbek-otabekov-6b27a8394/" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin className="w-6 h-6" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="https://x.com/sanjarbek444" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
            <Twitter className="w-6 h-6" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
