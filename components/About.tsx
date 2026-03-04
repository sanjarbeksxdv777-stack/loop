'use client';

import { motion } from 'motion/react';
import SectionHeading from './SectionHeading';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface AboutData {
  title: string;
  description1: string;
  description2: string;
  experienceYears: number;
  completedProjects: number;
  image: string;
}

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'about');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setAboutData(docSnap.data() as AboutData);
      } else {
        // Default data if not found
        setAboutData({
          title: 'Salom! Men Sanjarbek Otabekov, O\'zbekistonlik dasturchiman.',
          description1: 'Men raqamli mahsulotlarni yaratishga ishtiyoqmandman va har doim yangi texnologiyalarni o\'rganishga intilaman.',
          description2: 'Mening asosiy maqsadim - foydalanuvchilar uchun qulay, chiroyli va tezkor veb-ilovalarni ishlab chiqish. Men muammolarni hal qilishni va murakkab tizimlarni soddalashtirishni yaxshi ko\'raman.',
          experienceYears: 3,
          completedProjects: 20,
          image: '',
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching about data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-32 md:py-48 relative bg-background min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-muted border-t-foreground rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section id="about" className="py-32 md:py-48 relative bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          title="Haqimda."
          subtitle="Men haqimda qisqacha ma'lumot va tajribam."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 text-2xl text-foreground leading-snug font-medium tracking-tight"
          >
            <p>
              {aboutData?.title}
            </p>
            <p className="text-muted-foreground">
              {aboutData?.description1}
            </p>
            <p className="text-muted-foreground">
              {aboutData?.description2}
            </p>
            
            <div className="pt-12 grid grid-cols-2 gap-12">
              <div>
                <h4 className="text-6xl font-semibold text-foreground mb-3 tracking-tighter">{aboutData?.experienceYears}+</h4>
                <p className="text-lg font-medium text-muted-foreground">Yillik tajriba</p>
              </div>
              <div>
                <h4 className="text-6xl font-semibold text-foreground mb-3 tracking-tighter">{aboutData?.completedProjects}+</h4>
                <p className="text-lg font-medium text-muted-foreground">Tugallangan loyihalar</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square md:aspect-[4/5] rounded-[40px] overflow-hidden bg-muted shadow-2xl"
          >
            <Image
              src={aboutData?.image || ""}
              alt="Profile Picture"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              unoptimized={aboutData?.image?.includes('imgbb.com') || aboutData?.image?.includes('i.ibb.co')}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
