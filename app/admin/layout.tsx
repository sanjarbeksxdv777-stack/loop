'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { LayoutDashboard, LogOut, FolderGit2, Briefcase, Wrench, MessageSquare, UserCircle, Home, MonitorSmartphone } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let sessionUnsubscribe: () => void;

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (user && pathname !== '/admin/login') {
        // Check if session is still valid
        const sessionDocId = localStorage.getItem('admin_session_doc_id');
        if (sessionDocId) {
          sessionUnsubscribe = onSnapshot(doc(db, 'sessions', sessionDocId), (snapshot) => {
            if (!snapshot.exists()) {
              // Session was deleted remotely
              auth.signOut().then(() => {
                localStorage.removeItem('admin_session_id');
                localStorage.removeItem('admin_session_doc_id');
                router.push('/admin/login');
              });
            }
          });
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (sessionUnsubscribe) sessionUnsubscribe();
    };
  }, [router, pathname]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const sessionDocId = localStorage.getItem('admin_session_doc_id');
    if (sessionDocId) {
      try {
        // Try to delete session from Firestore, but don't block logout if it fails
        const { deleteDoc, doc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'sessions', sessionDocId));
      } catch (e) {
        console.error('Failed to delete session doc:', e);
      }
    }
    await auth.signOut();
    localStorage.removeItem('admin_session_id');
    localStorage.removeItem('admin_session_doc_id');
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Haqimda', href: '/admin/about', icon: <UserCircle className="w-5 h-5" /> },
    { name: 'Loyihalar', href: '/admin/projects', icon: <FolderGit2 className="w-5 h-5" /> },
    { name: 'Tajriba', href: '/admin/experience', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Ko\'nikmalar', href: '/admin/skills', icon: <Wrench className="w-5 h-5" /> },
    { name: 'Xabarlar', href: '/admin/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Seanslar', href: '/admin/sessions', icon: <MonitorSmartphone className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-background border-r border-border p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-foreground text-background shadow-md' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 pt-8">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home className="w-5 h-5" />
            Bosh sahifa
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Tizimdan chiqish
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
