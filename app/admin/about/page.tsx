'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UploadCloud, Loader2, Image as ImageIcon, CheckCircle2, Save } from 'lucide-react';
import { useToast } from '@/components/providers/toast-context';

interface AboutData {
  title: string;
  description1: string;
  description2: string;
  experienceYears: number;
  completedProjects: number;
  image: string;
}

export default function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<AboutData>({
    title: 'Salom! Men Sanjarbek Otabekov, O\'zbekistonlik dasturchiman.',
    description1: 'Men raqamli mahsulotlarni yaratishga ishtiyoqmandman va har doim yangi texnologiyalarni o\'rganishga intilaman.',
    description2: 'Mening asosiy maqsadim - foydalanuvchilar uchun qulay, chiroyli va tezkor veb-ilovalarni ishlab chiqish. Men muammolarni hal qilishni va murakkab tizimlarni soddalashtirishni yaxshi ko\'raman.',
    experienceYears: 3,
    completedProjects: 20,
    image: 'https://picsum.photos/seed/developer/800/1000',
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'settings', 'about');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setFormData(docSnap.data() as AboutData);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
        toast('Ma\'lumotlarni yuklashda xatolik yuz berdi', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [toast]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '6d207e02198a847aa98d0a2a901485a5';
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: uploadData,
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
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'about'), formData);
      toast('Ma\'lumotlar muvaffaqiyatli saqlandi!', 'success');
    } catch (error) {
      console.error('Error saving about data:', error);
      toast('Saqlashda xatolik yuz berdi', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Haqimda</h1>
          <p className="text-muted-foreground mt-1">Asosiy sahifadagi &quot;Haqimda&quot; bo&apos;limini tahrirlash</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || uploadingImage}
          className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:scale-105 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Saqlash
        </button>
      </div>

      <div className="bg-background p-6 md:p-8 rounded-[32px] border border-border/60 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Profil rasmi</label>
            <div 
              className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300 max-w-sm ${
                formData.image ? 'border-border bg-muted/10' : 'border-border hover:border-foreground/50 bg-muted/30 hover:bg-muted/50'
              }`}
            >
              {formData.image ? (
                <div className="relative aspect-[4/5] w-full group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
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
                  className="aspect-[4/5] w-full flex flex-col items-center justify-center cursor-pointer p-8 text-center"
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
            <div className="flex items-center gap-2 mt-2 max-w-sm">
              <div className="h-px bg-border flex-1"></div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Yoki URL kiriting</span>
              <div className="h-px bg-border flex-1"></div>
            </div>
            <input 
              type="url" 
              value={formData.image} 
              onChange={(e) => setFormData({...formData, image: e.target.value})} 
              className="w-full max-w-sm px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none text-sm" 
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Asosiy sarlavha</label>
              <input 
                required 
                type="text" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" 
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Birinchi xatboshi (Qisqacha tanishuv)</label>
              <textarea 
                required 
                rows={3} 
                value={formData.description1} 
                onChange={(e) => setFormData({...formData, description1: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none resize-none transition-colors" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Ikkinchi xatboshi (Maqsad va qiziqishlar)</label>
              <textarea 
                required 
                rows={3} 
                value={formData.description2} 
                onChange={(e) => setFormData({...formData, description2: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none resize-none transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Yillik tajriba</label>
              <input 
                required 
                type="number" 
                value={formData.experienceYears} 
                onChange={(e) => setFormData({...formData, experienceYears: Number(e.target.value)})} 
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Tugallangan loyihalar soni</label>
              <input 
                required 
                type="number" 
                value={formData.completedProjects} 
                onChange={(e) => setFormData({...formData, completedProjects: Number(e.target.value)})} 
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-foreground outline-none transition-colors" 
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
