'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import SectionHeading from './SectionHeading';
import { Monitor, Server, Wrench, Code, Database, Palette, Terminal, Layout, Smartphone } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface SkillGroup {
  id?: string;
  category: string;
  iconName: string;
  items: string[];
  order: number;
}

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="w-6 h-6" />,
  Server: <Server className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
  Terminal: <Terminal className="w-6 h-6" />,
  Layout: <Layout className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
};

export default function Skills() {
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: SkillGroup[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as SkillGroup);
        });
        setSkills(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching skills:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section id="skills" className="py-32 md:py-48 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          title="Ko&apos;nikmalar."
          subtitle="Mening texnologik stekim va asboblarim."
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-muted border-t-foreground rounded-full animate-spin"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-lg">
            Hozircha ko&apos;nikmalar qo&apos;shilmagan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.id || skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-background p-10 rounded-[32px] shadow-sm border border-border/50 hover:shadow-xl transition-all duration-500 group"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-muted rounded-2xl text-foreground group-hover:scale-110 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                    {iconMap[skillGroup.iconName] || <Monitor className="w-6 h-6" />}
                  </div>
                  <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                    {skillGroup.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skillGroup.items.map((item) => (
                    <span 
                      key={item} 
                      className="px-4 py-2 bg-muted/50 border border-border rounded-full text-base font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
