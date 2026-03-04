'use client';

import { motion } from 'motion/react';
import SectionHeading from './SectionHeading';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    // Oddiy validatsiya
    if (name.length < 2) {
      setError('Ism juda qisqa.');
      setIsSubmitting(false);
      return;
    }
    if (message.length < 10) {
      setError('Xabar kamida 10 ta belgidan iborat bo\'lishi kerak.');
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        name,
        email,
        message,
        createdAt: serverTimestamp()
      });
      
      setIsSuccess(true);
      form.reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Xatolik yuz berdi. Iltimos keyinroq qayta urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 md:py-48 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          title="Aloqa."
          subtitle="Yangi loyihalar yoki hamkorlik uchun men bilan bog'laning."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <h3 className="text-5xl font-semibold tracking-tighter text-foreground">Keling, birga ishlaymiz.</h3>
            <p className="text-2xl text-muted-foreground font-medium leading-snug">
              Men doimo yangi imkoniyatlar va qiziqarli loyihalar uchun ochiqman. 
              Agar sizda g&apos;oya bo&apos;lsa yoki shunchaki salomlashmoqchi bo&apos;lsangiz, bemalol yozing!
            </p>

            <div className="space-y-10 pt-10">
              <div className="flex items-center gap-8 group">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground shadow-sm group-hover:scale-110 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  <Mail className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-base font-medium text-muted-foreground mb-1">Email</p>
                  <a href="mailto:                    sanjarbekotabekov74@gmail.com" className="text-2xl font-semibold text-foreground hover:text-accent transition-colors">
                    sanjarbekotabekov74@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-8 group">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground shadow-sm group-hover:scale-110 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-base font-medium text-muted-foreground mb-1">Telefon</p>
                  <a href="tel:+998918601155" className="text-2xl font-semibold text-foreground hover:text-accent transition-colors">
                    +998 91 860 11 55 
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-8 group">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground shadow-sm group-hover:scale-110 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-base font-medium text-muted-foreground mb-1">Manzil</p>
                  <p className="text-2xl font-semibold text-foreground">Toshkent, O&apos;zbekiston</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-background p-10 md:p-12 rounded-[40px] border border-border shadow-xl relative overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-foreground/5 rounded-full blur-3xl pointer-events-none" />
            
            {error && (
              <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {isSuccess && (
              <div className="p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5" />
                Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog&apos;lanamiz.
              </div>
            )}

            <div className="relative group">
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-6 py-5 rounded-[24px] bg-muted/30 border border-border focus:bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all font-medium text-lg text-foreground peer placeholder-transparent"
                placeholder="Ismingizni kiriting"
              />
              <label htmlFor="name" className="absolute left-6 -top-2.5 bg-background px-2 text-sm font-medium text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-foreground">Ism</label>
            </div>
            <div className="relative group">
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-6 py-5 rounded-[24px] bg-muted/30 border border-border focus:bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all font-medium text-lg text-foreground peer placeholder-transparent"
                placeholder="Email manzilingiz"
              />
              <label htmlFor="email" className="absolute left-6 -top-2.5 bg-background px-2 text-sm font-medium text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-foreground">Email</label>
            </div>
            <div className="relative group">
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-6 py-5 rounded-[24px] bg-muted/30 border border-border focus:bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all resize-none font-medium text-lg text-foreground peer placeholder-transparent"
                placeholder="Xabaringizni yozing..."
              />
              <label htmlFor="message" className="absolute left-6 -top-2.5 bg-background px-2 text-sm font-medium text-muted-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-5 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-foreground">Xabar</label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full py-5 rounded-[24px] font-semibold text-xl transition-all duration-300 flex justify-center items-center gap-2 mt-8 shadow-lg ${
                isSuccess 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                  : 'bg-foreground text-background hover:scale-[1.02] shadow-foreground/20 disabled:opacity-70 disabled:hover:scale-100'
              }`}
            >
              {isSubmitting ? (
                <span className="w-6 h-6 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : isSuccess ? (
                <>Yuborildi <CheckCircle2 className="w-5 h-5" /></>
              ) : (
                <>Yuborish <Send className="w-5 h-5" /></>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
