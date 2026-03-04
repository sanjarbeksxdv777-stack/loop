'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { UAParser } from 'ua-parser-js';
import { useToast } from '@/components/providers/toast-context';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure persistence is set to LOCAL (survives browser restarts)
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Record session
      try {
        const parser = new UAParser();
        const result = parser.getResult();
        
        let ip = 'Noma\'lum';
        try {
          const ipRes = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipRes.json();
          ip = ipData.ip;
        } catch (e) {
          console.error('Failed to get IP:', e);
        }

        const sessionId = crypto.randomUUID();
        localStorage.setItem('admin_session_id', sessionId);

        const docRef = await addDoc(collection(db, 'sessions'), {
          sessionId,
          userId: userCredential.user.uid,
          email: userCredential.user.email,
          browser: `${result.browser.name || 'Noma\'lum'} ${result.browser.version || ''}`,
          os: `${result.os.name || 'Noma\'lum'} ${result.os.version || ''}`,
          device: result.device.vendor ? `${result.device.vendor} ${result.device.model}` : 'Kompyuter',
          ip,
          loginTime: serverTimestamp(),
          lastActive: serverTimestamp(),
          userAgent: navigator.userAgent
        });
        
        localStorage.setItem('admin_session_doc_id', docRef.id);
      } catch (sessionError) {
        console.error('Failed to record session:', sessionError);
        // Continue login even if session recording fails
      }

      toast('Tizimga muvaffaqiyatli kirildi', 'success');
      router.push('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        toast('Email yoki parol noto\'g\'ri kiritildi', 'error');
      } else if (err.code === 'auth/too-many-requests') {
        toast('Juda ko\'p urinishlar. Iltimos, birozdan so\'ng qayta urinib ko\'ring', 'error');
      } else {
        toast('Tizimga kirishda xatolik yuz berdi. Qayta urinib ko\'ring', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6 relative overflow-hidden">
      {/* Dekorativ fon elementlari */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-foreground/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-foreground/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-background p-10 rounded-[40px] border border-border shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-foreground text-background rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-foreground/10">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-3 font-medium">Boshqaruv paneliga xush kelibsiz</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground ml-2">Email manzil</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-14 pr-6 py-4 rounded-[24px] bg-muted/30 border border-border focus:bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all font-medium text-foreground"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground ml-2">Maxfiy parol</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-14 pr-14 py-4 rounded-[24px] bg-muted/30 border border-border focus:bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all font-medium text-foreground"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-foreground text-background rounded-[24px] font-semibold text-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 mt-8 shadow-xl shadow-foreground/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              'Tizimga kirish'
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 py-3 px-4 rounded-2xl border border-border/50">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Firebase Auth orqali shifrlangan va himoyalangan</span>
        </div>
      </div>
    </div>
  );
}
