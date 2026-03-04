'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Edit2, X, Monitor, Server, Wrench, Code, Database, Palette, Terminal, Layout, Smartphone, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/providers/toast-context';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface SkillGroup {
  id?: string;
  category: string;
  iconName: string;
  items: string[];
  order: number;
}

const availableIcons = [
  { name: 'Monitor', icon: <Monitor className="w-5 h-5" /> },
  { name: 'Server', icon: <Server className="w-5 h-5" /> },
  { name: 'Wrench', icon: <Wrench className="w-5 h-5" /> },
  { name: 'Code', icon: <Code className="w-5 h-5" /> },
  { name: 'Database', icon: <Database className="w-5 h-5" /> },
  { name: 'Palette', icon: <Palette className="w-5 h-5" /> },
  { name: 'Terminal', icon: <Terminal className="w-5 h-5" /> },
  { name: 'Layout', icon: <Layout className="w-5 h-5" /> },
  { name: 'Smartphone', icon: <Smartphone className="w-5 h-5" /> },
];

export default function AdminSkills() {
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<SkillGroup>({
    category: '',
    iconName: 'Monitor',
    items: [],
    order: 0,
  });

  const fetchSkills = useCallback(async () => {
    try {
      const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const data: SkillGroup[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as SkillGroup);
      });
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast('Ko\'nikmalarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'skills', editingId), { ...formData, order: Number(formData.order) });
        toast('Ko\'nikma muvaffaqiyatli yangilandi', 'success');
      } else {
        await addDoc(collection(db, 'skills'), { ...formData, order: Number(formData.order) });
        toast('Yangi ko\'nikma muvaffaqiyatli qo\'shildi', 'success');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ category: '', iconName: 'Monitor', items: [], order: 0 });
      fetchSkills();
    } catch (error) {
      console.error('Error saving skill:', error);
      toast('Saqlashda xatolik yuz berdi', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, 'skills', deleteId));
      toast('Ko\'nikma muvaffaqiyatli o\'chirildi', 'success');
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast('O\'chirishda xatolik yuz berdi', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const openEditModal = (skill: SkillGroup) => {
    setFormData(skill);
    setEditingId(skill.id!);
    setIsModalOpen(true);
  };

  const getIconComponent = (name: string) => {
    const iconObj = availableIcons.find(i => i.name === name);
    return iconObj ? iconObj.icon : <Monitor className="w-5 h-5" />;
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
          <h1 className="text-3xl font-bold tracking-tight">Ko&apos;nikmalar</h1>
          <p className="text-muted-foreground mt-1">Texnologik stek va asboblarni boshqarish</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ category: '', iconName: 'Monitor', items: [], order: skills.length });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:scale-105 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Yangi qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="group bg-background p-6 rounded-[24px] border border-border/60 shadow-sm hover:shadow-xl hover:border-border transition-all duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-xl text-foreground group-hover:bg-foreground group-hover:text-background transition-colors duration-300 shadow-sm">
                  {getIconComponent(skill.iconName)}
                </div>
                <h3 className="text-xl font-semibold group-hover:text-blue-500 transition-colors">{skill.category}</h3>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(skill)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Tahrirlash">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(skill.id!)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="O'chirish">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              {skill.items.map((item, i) => (
                <span key={i} className="px-3 py-1.5 bg-muted/50 hover:bg-muted border border-border/50 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-muted/30 rounded-[32px] border border-border border-dashed">
            <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Code className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hozircha ko&apos;nikmalar yo&apos;q</h3>
            <p className="text-muted-foreground max-w-sm">
              Yangi ko&apos;nikma qo&apos;shish tugmasini bosib, texnologik stekingizni kiriting.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-background w-full max-w-2xl rounded-[32px] border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
              <h2 className="text-2xl font-semibold tracking-tight">{editingId ? 'Ko&apos;nikmani tahrirlash' : 'Yangi ko&apos;nikma yaratish'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="skill-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Kategoriya nomi</label>
                  <input required type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" placeholder="Masalan: Frontend, Backend, Tools..." />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold">Ikonka tanlang</label>
                  <div className="grid grid-cols-5 sm:grid-cols-9 gap-3">
                    {availableIcons.map((icon) => (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => setFormData({...formData, iconName: icon.name})}
                        className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                          formData.iconName === icon.name 
                            ? 'bg-foreground text-background shadow-md scale-110' 
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border hover:scale-105'
                        }`}
                        title={icon.name}
                      >
                        {icon.icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Texnologiyalar <span className="text-muted-foreground font-normal">(vergul bilan ajrating)</span></label>
                  <input required type="text" value={formData.items.join(', ')} onChange={(e) => setFormData({...formData, items: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" placeholder="React, Next.js, Tailwind, TypeScript" />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.items.map((item, i) => item && (
                      <span key={i} className="px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Tartib raqami <span className="text-muted-foreground font-normal">(Kichik raqam oldin chiqadi)</span></label>
                  <input required type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" />
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
                form="skill-form" 
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
        title="Ko'nikmani o'chirish"
        description="Rostdan ham ushbu ko'nikmani o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
        confirmText="O'chirish"
        variant="danger"
      />
    </div>
  );
}
