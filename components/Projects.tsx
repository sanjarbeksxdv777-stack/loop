'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SectionHeading from './SectionHeading';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface Project {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  github: string;
  live: string;
}

const categories = ['Barchasi', 'Frontend', 'Backend', 'Fullstack'];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'projects'),
      (snapshot) => {
        const data: Project[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Project);
        });
        setProjects(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredProjects = projects.filter(project => 
    activeCategory === 'Barchasi' ? true : project.category === activeCategory
  );

  return (
    <section id="projects" className="py-32 md:py-48 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          title="Loyihalar."
          subtitle="Mening so&apos;nggi ishlarim va tajribam."
        />

        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-foreground text-background shadow-lg scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-muted border-t-foreground rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-lg">
            Hozircha loyihalar qo&apos;shilmagan.
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id || project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="group rounded-[40px] overflow-hidden bg-muted/30 border border-border/50 hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={project.image || 'https://picsum.photos/seed/placeholder/800/600'}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-[0.16,1,0.3,1]"
                      referrerPolicy="no-referrer"
                      unoptimized={project.image?.includes('imgbb.com') || project.image?.includes('i.ibb.co')}
                    />
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-6 backdrop-blur-sm">
                      {project.github && (
                        <Link
                          href={project.github}
                          target="_blank"
                          className="p-4 bg-background rounded-full text-foreground hover:scale-110 transition-transform"
                        >
                          <Github className="w-6 h-6" />
                        </Link>
                      )}
                      {project.live && (
                        <Link
                          href={project.live}
                          target="_blank"
                          className="p-4 bg-background rounded-full text-foreground hover:scale-110 transition-transform"
                        >
                          <ExternalLink className="w-6 h-6" />
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="p-10 space-y-6 flex-1 flex flex-col">
                    <h3 className="text-3xl font-semibold tracking-tight text-foreground">{project.title}</h3>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-4">
                      {project.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 text-sm font-medium bg-background border border-border/50 rounded-full text-muted-foreground shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
