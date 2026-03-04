'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Edit2, X, Loader2, CheckCircle2, Briefcase } from 'lucide-react';
import { useToast } from '@/components/providers/toast-context';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface Experience {
  id?: string;
  role: string;
  company: string;
  period: string;
  description: string;
  order: number;
}

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Experience>({
    role: '',
    company: '',
    period: '',
    description: '',
    order: 0,
  });

  const fetchExperiences = useCallback(async () => {
    try {
      const q = query(collection(db, 'experience'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const data: Experience[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Experience);
      });
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experience:', error);
      toast('Ma\'lumotlarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'experience', editingId), { ...formData, order: Number(formData.order) });
        toast('Tajriba muvaffaqiyatli yangilandi', 'success');
      } else {
        await addDoc(collection(db, 'experience'), { ...formData, order: Number(formData.order) });
        toast('Yangi tajriba muvaffaqiyatli qo\'shildi', 'success');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ role: '', company: '', period: '', description: '', order: 0 });
      fetchExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast('Saqlashda xatolik yuz berdi', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, 'experience', deleteId));
      toast('Tajriba muvaffaqiyatli o\'chirildi', 'success');
      fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast('O\'chirishda xatolik yuz berdi', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const openEditModal = (exp: Experience) => {
    setFormData(exp);
    setEditingId(exp.id!);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tajriba</h1>
          <p className="text-muted-foreground mt-1">Ish tajribasini boshqarish va yangilash</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ role: '', company: '', period: '', description: '', order: experiences.length });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:scale-105 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Yangi qo&apos;shish
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="group bg-background p-6 rounded-[24px] border border-border/60 shadow-sm hover:shadow-md hover:border-border transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center shrink-0 group-hover:bg-foreground group-hover:text-background transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold group-hover:text-blue-500 transition-colors">{exp.role} <span className="text-muted-foreground font-normal">@ {exp.company}</span></h3>
                <p className="text-sm text-muted-foreground mb-2 font-medium">{exp.period}</p>
                <p className="text-sm line-clamp-2 text-muted-foreground leading-relaxed">{exp.description}</p>
              </div>
            </div>
            <div className="flex gap-2 sm:ml-4 self-end sm:self-center">
              <button onClick={() => openEditModal(exp)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Tahrirlash">
                <Edit2 className="w-5 h-5" />
              </button>
              <button onClick={() => setDeleteId(exp.id!)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="O'chirish">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-muted/30 rounded-[32px] border border-border border-dashed">
            <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Briefcase className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hozircha tajriba yo&apos;q</h3>
            <p className="text-muted-foreground max-w-sm">
              Yangi tajriba qo&apos;shish tugmasini bosib, ma&apos;lumotlarni to&apos;ldirishni boshlang.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-background w-full max-w-2xl rounded-[32px] border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
              <h2 className="text-2xl font-semibold tracking-tight">{editingId ? 'Tajribani tahrirlash' : 'Yangi tajriba yaratish'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="exp-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Lavozim (Role)</label>
                    <input required type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" placeholder="Frontend Dasturchi" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Kompaniya</label>
                    <input required type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" placeholder="Tech Company LLC" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Davr</label>
                    <input required type="text" value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" placeholder="Yanvar 2022 - Hozirgacha" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Tavsif</label>
                    <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none resize-none transition-colors" placeholder="Kompaniyadagi vazifalaringiz va yutuqlaringiz haqida..." />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Tartib raqami <span className="text-muted-foreground font-normal">(Kichik raqam oldin chiqadi)</span></label>
                    <input required type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-3 rounded-xl font-medium hover:bg-muted border border-transparent hover:border-border transition-all"
              >
                Bekor qilish
              </button>
              <button 
                type="submit" 
                form="exp-form" 
                className="flex items-center gap-2 px-8 py-3 bg-foreground text-background rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
              >
                {editingId ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingId ? 'Yangilash' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Tajribani o'chirish"
        description="Rostdan ham ushbu tajribani o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
        confirmText="O'chirish"
        variant="danger"
      />
    </div>
  );
}
