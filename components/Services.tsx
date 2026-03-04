'use client';

import { motion } from 'motion/react';
import { Code2, Layout, Smartphone, Database } from 'lucide-react';

const services = [
  {
    title: "Veb Dasturlash",
    description: "Zamonaviy, tezkor va moslashuvchan veb-saytlar va web-ilovalarni noldan yaratish.",
    icon: <Code2 className="w-8 h-8" />,
  },
  {
    title: "UI/UX Dizayn",
    description: "Foydalanuvchilar uchun qulay va jozibali interfeyslarni loyihalash.",
    icon: <Layout className="w-8 h-8" />,
  },
  {
    title: "Backend & API",
    description: "Xavfsiz va kengaytiriladigan server mantiqini va ma'lumotlar bazalarini qurish.",
    icon: <Database className="w-8 h-8" />,
  },
  {
    title: "Mobil Moslashuv",
    description: "Barcha qurilmalarda mukammal ishlaydigan responsiv dizaynlar.",
    icon: <Smartphone className="w-8 h-8" />,
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Xizmatlar</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Mijozlar va bizneslar uchun taqdim etadigan asosiy xizmatlarim.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-background border border-border hover:border-foreground/20 transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-foreground">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
