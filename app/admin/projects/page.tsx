'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, Edit2, X, UploadCloud, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/providers/toast-context';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

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

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    image: '',
    tags: [],
    category: 'Frontend',
    github: '',
    live: '',
  });

  const fetchProjects = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const data: Project[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast('Loyihalarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // ImgBB API - Replace with your own key in production or use env variable
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '6d207e02198a847aa98d0a2a901485a5';
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }));
        toast('Rasm muvaffaqiyatli yuklandi', 'success');
      } else {
        toast('Rasm yuklashda xatolik yuz berdi', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast('Rasm yuklashda xatolik yuz berdi', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), { ...formData });
        toast('Loyiha muvaffaqiyatli yangilandi', 'success');
      } else {
        await addDoc(collection(db, 'projects'), formData);
        toast('Yangi loyiha muvaffaqiyatli qo\'shildi', 'success');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: '', description: '', image: '', tags: [], category: 'Frontend', github: '', live: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast('Saqlashda xatolik yuz berdi', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, 'projects', deleteId));
      toast('Loyiha muvaffaqiyatli o\'chirildi', 'success');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast('O\'chirishda xatolik yuz berdi', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const openEditModal = (project: Project) => {
    setFormData(project);
    setEditingId(project.id!);
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
          <h1 className="text-3xl font-bold tracking-tight">Loyihalar</h1>
          <p className="text-muted-foreground mt-1">Portfolio loyihalarini boshqarish va yangilash</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', description: '', image: '', tags: [], category: 'Frontend', github: '', live: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:scale-105 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Yangi qo&apos;shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group bg-background p-5 rounded-[24px] border border-border/60 shadow-sm hover:shadow-xl hover:border-border transition-all duration-300 flex flex-col">
            <div className="aspect-video bg-muted rounded-xl mb-5 overflow-hidden relative">
              {project.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-10 h-10 opacity-20" />
                </div>
              )}
              <div className="absolute top-3 left-3 px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-xs font-medium border border-border/50">
                {project.category}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-500 transition-colors">{project.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-5 flex-1 leading-relaxed">{project.description}</p>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
              <div className="flex gap-1 overflow-hidden">
                {project.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-1 bg-muted rounded-md font-medium truncate max-w-[80px]">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 2 && (
                  <span className="text-[10px] px-2 py-1 bg-muted rounded-md font-medium">
                    +{project.tags.length - 2}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEditModal(project)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Tahrirlash">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(project.id!)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="O'chirish">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-muted/30 rounded-[32px] border border-border border-dashed">
            <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hozircha loyihalar yo&apos;q</h3>
            <p className="text-muted-foreground max-w-sm">
              Yangi loyiha qo&apos;shish tugmasini bosib, portfoliongizni to&apos;ldirishni boshlang.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-background w-full max-w-3xl rounded-[32px] border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
              <h2 className="text-2xl font-semibold tracking-tight">{editingId ? 'Loyihani tahrirlash' : 'Yangi loyiha yaratish'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="project-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Image Upload Section */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold">Loyiha rasmi</label>
                  <div 
                    className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300 ${
                      formData.image ? 'border-border bg-muted/10' : 'border-border hover:border-foreground/50 bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    {formData.image ? (
                      <div className="relative aspect-video w-full group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:scale-105 transition-transform"
                          >
                            Boshqa rasm tanlash
                          </button>
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, image: ''})}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-sm hover:scale-105 transition-transform"
                          >
                            O&apos;chirish
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video w-full flex flex-col items-center justify-center cursor-pointer p-8 text-center"
                      >
                        {uploadingImage ? (
                          <div className="flex flex-col items-center gap-3 text-blue-500">
                            <Loader2 className="w-10 h-10 animate-spin" />
                            <p className="font-medium">Rasm yuklanmoqda...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-sm mb-2">
                              <UploadCloud className="w-8 h-8" />
                            </div>
                            <p className="font-medium text-foreground">Rasmni yuklash uchun bosing</p>
                            <p className="text-xs">PNG, JPG, WEBP (Max 5MB)</p>
                          </div>
                        )}
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  {/* Fallback URL input if upload fails */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-px bg-border flex-1"></div>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Yoki URL kiriting</span>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                  <input 
                    type="url" 
                    value={formData.image} 
                    onChange={(e) => setFormData({...formData, image: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none text-sm" 
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Sarlavha</label>
                    <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" placeholder="Loyiha nomi" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Kategoriya</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors appearance-none">
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Fullstack">Fullstack</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Tavsif</label>
                    <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none resize-none transition-colors" placeholder="Loyiha haqida qisqacha ma&apos;lumot..." />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold">Texnologiyalar <span className="text-muted-foreground font-normal">(vergul bilan ajrating)</span></label>
                    <input required type="text" value={formData.tags.join(', ')} onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" placeholder="React, Next.js, Tailwind, Firebase" />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag, i) => tag && (
                        <span key={i} className="px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Github Link (ixtiyoriy)</label>
                    <input type="url" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" placeholder="https://github.com/..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Live Link (ixtiyoriy)</label>
                    <input type="url" value={formData.live} onChange={(e) => setFormData({...formData, live: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" placeholder="https://..." />
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
                form="project-form" 
                disabled={uploadingImage}
                className="flex items-center gap-2 px-8 py-3 bg-foreground text-background rounded-xl font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
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
        title="Loyihani o'chirish"
        description="Rostdan ham ushbu loyihani o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
        confirmText="O'chirish"
        variant="danger"
      />
    </div>
  );
}
