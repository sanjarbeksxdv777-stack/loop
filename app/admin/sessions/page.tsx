'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, getDocs, where } from 'firebase/firestore';
import { MonitorSmartphone, Trash2, Loader2, Globe, Clock, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/providers/toast-context';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface SessionData {
  id: string;
  sessionId: string;
  userId: string;
  email: string;
  browser: string;
  os: string;
  device: string;
  ip: string;
  loginTime: any;
  lastActive: any;
  userAgent: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_session_id');
    }
    return null;
  });
  const [sessionToDelete, setSessionToDelete] = useState<{ id: string, isCurrent: boolean } | null>(null);
  const [confirmEndAll, setConfirmEndAll] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'sessions'), orderBy('loginTime', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: SessionData[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as SessionData);
        });
        setSessions(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching sessions:', error);
        toast('Seanslarni yuklashda xatolik yuz berdi', 'error');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const handleEndSession = async () => {
    if (!sessionToDelete) return;

    try {
      await deleteDoc(doc(db, 'sessions', sessionToDelete.id));
      
      if (sessionToDelete.isCurrent) {
        localStorage.removeItem('admin_session_id');
        localStorage.removeItem('admin_session_doc_id');
        await auth.signOut();
        router.push('/admin/login');
        toast('Tizimdan muvaffaqiyatli chiqildi', 'success');
      } else {
        toast('Seans muvaffaqiyatli yakunlandi', 'success');
      }
    } catch (error) {
      console.error('Error ending session:', error);
      toast('Seansni yakunlashda xatolik yuz berdi', 'error');
    } finally {
      setSessionToDelete(null);
    }
  };

  const handleEndAllOtherSessions = async () => {
    try {
      const q = query(collection(db, 'sessions'), where('sessionId', '!=', currentSessionId));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(document => deleteDoc(doc(db, 'sessions', document.id)));
      await Promise.all(deletePromises);
      
      toast('Boshqa barcha seanslar muvaffaqiyatli yakunlandi', 'success');
    } catch (error) {
      console.error('Error ending other sessions:', error);
      toast('Seanslarni yakunlashda xatolik yuz berdi', 'error');
    } finally {
      setConfirmEndAll(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Noma\'lum';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('uz-UZ', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faol Seanslar</h1>
          <p className="text-muted-foreground mt-1">Admin panelga kirilgan barcha qurilmalar ro&apos;yxati</p>
        </div>
        
        {sessions.length > 1 && (
          <button
            onClick={() => setConfirmEndAll(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-medium transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            Boshqa barchasini yakunlash
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sessions.length === 0 ? (
          <div className="bg-background p-10 rounded-[32px] border border-border/60 text-center text-muted-foreground">
            Hozircha faol seanslar yo&apos;q.
          </div>
        ) : (
          sessions.map((session) => {
            const isCurrentSession = session.sessionId === currentSessionId;
            
            return (
              <div 
                key={session.id} 
                className={`bg-background p-6 rounded-[24px] border ${isCurrentSession ? 'border-emerald-500/50 shadow-emerald-500/10' : 'border-border/60'} shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-2xl ${isCurrentSession ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                    <MonitorSmartphone className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-semibold text-foreground">
                        {session.device}
                      </h3>
                      {isCurrentSession && (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-xs font-semibold rounded-full border border-emerald-500/20">
                          Joriy qurilma
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4" />
                        <span>{session.browser} • {session.os}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono bg-muted px-2 py-0.5 rounded-md text-xs">{session.ip}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>Kirish: {formatDate(session.loginTime)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSessionToDelete({ id: session.id, isCurrent: isCurrentSession })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors shrink-0 ${
                    isCurrentSession 
                      ? 'bg-muted text-foreground hover:bg-red-500/10 hover:text-red-500' 
                      : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  {isCurrentSession ? 'Chiqish' : 'Yakunlash'}
                </button>
              </div>
            );
          })
        )}
      </div>

      <ConfirmDialog
        isOpen={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleEndSession}
        title={sessionToDelete?.isCurrent ? "Tizimdan chiqish" : "Seansni yakunlash"}
        description={sessionToDelete?.isCurrent 
          ? "Haqiqatan ham tizimdan chiqmoqchimisiz?" 
          : "Haqiqatan ham bu seansni yakunlamoqchimisiz? Foydalanuvchi tizimdan chiqarib yuboriladi."}
        confirmText={sessionToDelete?.isCurrent ? "Chiqish" : "Yakunlash"}
        variant="danger"
      />

      <ConfirmDialog
        isOpen={confirmEndAll}
        onClose={() => setConfirmEndAll(false)}
        onConfirm={handleEndAllOtherSessions}
        title="Barcha seanslarni yakunlash"
        description="Boshqa barcha seanslarni yakunlamoqchimisiz? Bu boshqa barcha qurilmalardan tizimdan chiqishga olib keladi."
        confirmText="Barchasini yakunlash"
        variant="danger"
      />
    </div>
  );
}
