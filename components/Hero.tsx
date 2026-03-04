'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowDown, Code2, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden bg-background">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      {/* Subtle gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 relative"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-muted border border-border text-xs font-semibold tracking-widest uppercase text-foreground">
              <Sparkles className="w-3 h-3 text-accent" />
               2026
            </span>
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-semibold tracking-widest uppercase text-green-600 dark:text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Hozircha Bandman
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[130px] font-semibold tracking-tighter leading-[0.9] text-foreground relative">
            Sanjarbek <br />
            <span className="text-muted-foreground relative inline-block">
              Otabekov.
              <motion.div 
                className="absolute -right-12 -top-4 md:-right-20 md:-top-8 bg-background border border-border rounded-2xl p-3 md:p-4 rotate-12 shadow-xl hidden sm:block"
                animate={{ y: [0, -10, 0], rotate: [12, 15, 12] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Code2 className="w-6 h-6 md:w-8 md:h-8 text-foreground" />
              </motion.div>
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-3xl text-muted-foreground max-w-3xl mb-12 font-medium tracking-tight leading-snug"
        >
          Zamonaviy, tezkor va foydalanuvchiga qulay veb-ilovalarni yaratuvchi dasturchi. G&apos;oyalarni raqamli reallikka aylantiraman.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="#projects"
            className="group flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium hover:scale-105 transition-transform duration-300 shadow-lg shadow-foreground/20"
          >
            Loyihalarni ko&apos;rish
          </Link>
          <Link
            href="#contact"
            className="flex items-center gap-2 px-8 py-4 bg-background border border-border text-foreground rounded-full font-medium hover:bg-muted transition-colors duration-300"
          >
            Bog&apos;lanish
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Pastga</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
