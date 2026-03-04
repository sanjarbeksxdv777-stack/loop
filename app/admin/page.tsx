'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Users, Monitor, Smartphone, Globe } from 'lucide-react';

interface Visitor {
  id: string;
  ip: string;
  browser: string;
  os: string;
  device: string;
  lastVisit: any;
}

export default function AdminDashboard() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    desktop: 0,
    mobile: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const q = query(collection(db, 'visitors'), orderBy('lastVisit', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        
        const data: Visitor[] = [];
        let desktopCount = 0;
        let mobileCount = 0;

        querySnapshot.forEach((doc) => {
          const v = { id: doc.id, ...doc.data() } as Visitor;
          data.push(v);
          
          if (v.device === 'mobile' || v.device === 'tablet') {
            mobileCount++;
          } else {
            desktopCount++;
          }
        });

        setVisitors(data);
        setStats({
          total: data.length, // Since 1 IP = 1 doc, this is unique visitors
          desktop: desktopCount,
          mobile: mobileCount,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-lg">Sayt statistikasi va tashrif buyuruvchilar haqida ma&apos;lumot.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background p-8 rounded-[32px] border border-border shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Jami Unikal Tashriflar</p>
            <p className="text-4xl font-bold">{stats.total}</p>
          </div>
        </div>

        <div className="bg-background p-8 rounded-[32px] border border-border shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Monitor className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Kompyuterdan</p>
            <p className="text-4xl font-bold">{stats.desktop}</p>
          </div>
        </div>

        <div className="bg-background p-8 rounded-[32px] border border-border shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Smartphone className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Mobildan</p>
            <p className="text-4xl font-bold">{stats.mobile}</p>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-[32px] border border-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border">
          <h2 className="text-2xl font-semibold tracking-tight">So&apos;nggi tashrif buyuruvchilar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm uppercase tracking-wider">
                <th className="px-8 py-4 font-medium">IP Manzil</th>
                <th className="px-8 py-4 font-medium">Brauzer</th>
                <th className="px-8 py-4 font-medium">Operatsion Tizim</th>
                <th className="px-8 py-4 font-medium">Qurilma</th>
                <th className="px-8 py-4 font-medium">Vaqt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-8 py-5 font-mono text-sm">{visitor.ip}</td>
                  <td className="px-8 py-5">{visitor.browser}</td>
                  <td className="px-8 py-5">{visitor.os}</td>
                  <td className="px-8 py-5 capitalize">{visitor.device || 'Desktop'}</td>
                  <td className="px-8 py-5 text-sm text-muted-foreground">
                    {visitor.lastVisit?.toDate ? new Date(visitor.lastVisit.toDate()).toLocaleString('uz-UZ') : 'Noma\'lum'}
                  </td>
                </tr>
              ))}
              {visitors.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-muted-foreground">
                    Hozircha ma&apos;lumot yo&apos;q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
