'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import SectionHeading from './SectionHeading';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface ExperienceData {
  id?: string;
  role: string;
  company: string;
  period: string;
  description: string;
  order: number;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'experience'), orderBy('order', 'asc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: ExperienceData[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as ExperienceData);
        });
        setExperiences(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching experience:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section id="experience" className="py-32 md:py-48 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          title="Tajriba."
          subtitle="Mening professional bosib o&apos;tgan yo&apos;lim."
        />

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-muted border-t-foreground rounded-full animate-spin"></div>
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground text-lg">
              Hozircha tajriba ma&apos;lumotlari qo&apos;shilmagan.
            </div>
          ) : (
            experiences.map((exp, index) => (
              <motion.div
                key={exp.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="md:grid md:grid-cols-5 gap-8 py-10 border-b border-border/50 group">
                  <div className="md:col-span-1 mb-4 md:mb-0 pt-1">
                    <span className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                      {exp.period}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="text-2xl font-semibold text-foreground tracking-tight mb-2 group-hover:text-accent transition-colors duration-300">
                      {exp.role}
                    </h3>
                    <h4 className="text-lg font-medium text-muted-foreground mb-4">
                      {exp.company}
                    </h4>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
