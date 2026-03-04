'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Trash2, Mail, Clock, User, ShieldCheck, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/providers/toast-context';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    
    // onSnapshot orqali real-time (jonli) o'zgarishlarni eshitamiz
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: Message[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching messages:', error);
      toast('Xabarlarni yuklashda xatolik yuz berdi', 'error');
      setLoading(false);
    });

    // Komponent o'chganda listenerni to'xtatamiz
    return () => unsubscribe();
  }, [toast]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, 'messages', deleteId));
      toast('Xabar muvaffaqiyatli o\'chirildi', 'success');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast('O\'chirishda xatolik yuz berdi', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Xabarlar</h1>
          <p className="text-muted-foreground mt-1">Saytdan kelgan xabarlarni real-time o&apos;qish</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/20 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          Shifrlangan va xavfsiz
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {messages.map((msg) => (
          <div key={msg.id} className="group bg-background p-6 md:p-8 rounded-[24px] border border-border/60 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md hover:border-border transition-all duration-300">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <User className="w-4 h-4 text-blue-500" />
                  {msg.name}
                </div>
                <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/50 hover:bg-muted transition-colors">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <a href={`mailto:${msg.email}`} className="hover:text-foreground transition-colors">{msg.email}</a>
                </div>
                <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/50">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleString('uz-UZ') : 'Noma\'lum'}
                </div>
              </div>
              <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 relative group-hover:bg-muted/50 transition-colors">
                <div className="absolute top-0 left-6 -translate-y-1/2 w-4 h-4 bg-muted/30 border-t border-l border-border/50 rotate-45 group-hover:bg-muted/50 transition-colors"></div>
                <p className="whitespace-pre-wrap text-foreground leading-relaxed">{msg.message}</p>
              </div>
            </div>
            <div className="flex items-start justify-end">
              <button 
                onClick={() => setDeleteId(msg.id)} 
                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                title="Xabarni o'chirish"
              >
                <Trash2 className="w-5 h-5" />
                <span className="md:hidden font-medium">O&apos;chirish</span>
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-muted/30 rounded-[32px] border border-border border-dashed">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm">
              <MessageSquare className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hozircha xabarlar yo&apos;q</h3>
            <p className="text-muted-foreground max-w-sm">
              Yangi xabarlar kelganda bu yerda avtomatik paydo bo&apos;ladi.
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xabarni o'chirish"
        description="Rostdan ham bu xabarni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
        confirmText="O'chirish"
        variant="danger"
      />
    </div>
  );
}
