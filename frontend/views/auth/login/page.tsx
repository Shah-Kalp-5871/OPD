'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Stethoscope, 
  User, 
  Lock, 
  ChevronRight, 
  ShieldCheck, 
  Users, 
  Activity, 
  Pill, 
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ROUTES, ROLE_REDIRECT_MAP } from '@/constants/routes';

// Helper to set cookies
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const StaticLoginView = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('admin@clinic.com');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // API interceptor already unwrapped this to { access_token, user }
      const { access_token, user } = response.data;
      
      // Strict Role Check: Selected role must match account role
      // Note: Frontend role labels (Admin) might need mapping to backend Role enum (ADMIN)
      const selectedRoleUpper = role.toUpperCase();
      if (user.role !== selectedRoleUpper) {
        const msg = `Unauthorized: This account does not have ${role} access.`;
        setErrorMsg(msg);
        setIsLoading(false);
        return;
      }

      // Store auth state
      setAuth(user, access_token);
      
      // Set cookies for middleware access (Next.js server-side)
      setCookie('token', access_token, 7);
      setCookie('user_role', user.role, 7);

      toast.success(`Welcome back, ${user.name}!`);

      // Redirect based on role
      router.push(ROLE_REDIRECT_MAP[user.role] || ROUTES.HOME);
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Connection error.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const QuickAccessCard = ({ title, roleName, icon: Icon, color }: any) => (
    <button 
      onClick={() => setRole(roleName)}
      suppressHydrationWarning
      className={`group p-4 bg-white border rounded-2xl transition-all duration-300 text-left relative overflow-hidden ${
        role === roleName ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-slate-100 hover:border-emerald-200 hover:shadow-xl'
      }`}
    >
       <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
       </div>
       <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">{title}</p>
       <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Enter Panel</span>
          <ChevronRight className="w-2.5 h-2.5 text-emerald-600" />
       </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 🔷 DECORATIVE BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30" />
         <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
         
         {/* 🔷 LEFT COLUMN: BRANDING & QUICK ACCESS */}
         <div className="space-y-12">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-200 animate-pulse">
                     <Stethoscope className="w-8 h-8" />
                  </div>
                  <div className="h-10 w-[2px] bg-slate-200 rounded-full" />
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">MedFlow</h1>
               </div>
               <div className="space-y-2">
                  <h2 className="text-5xl font-black text-slate-900 leading-none tracking-tight">
                     Modern <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">OPD Management</span> System
                  </h2>
                  <p className="text-lg font-bold text-slate-400 mt-4">Enterprise Healthcare ERP Platform for Clinic Efficiency</p>
               </div>
            </div>

            <div className="space-y-6 pt-6">
               <div className="flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Quick Panel Access</h3>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <QuickAccessCard title="Admin" roleName="Admin" icon={ShieldCheck} color="bg-slate-900" />
                  <QuickAccessCard title="Reception" roleName="Reception" icon={Users} color="bg-blue-600" />
                  <QuickAccessCard title="Doctor" roleName="Doctor" icon={Stethoscope} color="bg-emerald-600" />
                  <QuickAccessCard title="Nursing" roleName="Nursing" icon={Activity} color="bg-indigo-600" />
                  <QuickAccessCard title="Medical" roleName="Medical" icon={Pill} color="bg-teal-600" />
               </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-white p-6 rounded-3xl space-y-4 shadow-sm">
               <div className="flex items-center gap-3 text-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Demo Credentials (ALL: 123456)</span>
               </div>
               <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="text-[10px] font-bold text-slate-400">Admin: <span className="text-slate-800 font-black">admin@clinic.com</span></div>
                  <div className="text-[10px] font-bold text-slate-400">Reception: <span className="text-slate-800 font-black">reception@clinic.com</span></div>
                  <div className="text-[10px] font-bold text-slate-400">Doctor: <span className="text-slate-800 font-black">doctor@clinic.com</span></div>
               </div>
            </div>
         </div>

         {/* 🔷 RIGHT COLUMN: LOGIN FORM CARD */}
         <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 relative group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 rounded-t-[3rem]" />
            
            <div className="mb-10">
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">System Login</h3>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Enter credentials to access your department</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
               <div className="space-y-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                     <div className="relative">
                        <User className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                         <input 
                            type="email" 
                            placeholder="name@clinic.com" 
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            suppressHydrationWarning
                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" 
                         />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                     <div className="relative">
                        <Lock className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                         <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="••••••••" 
                            value={password}
                            required
                            minLength={6}
                            onChange={(e) => setPassword(e.target.value)}
                            suppressHydrationWarning
                            className="w-full pl-16 pr-14 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" 
                         />
                        <button 
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors"
                        >
                           {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-emerald-600">Select Role Panel</label>
                     <div className="relative">
                        <Building2 className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <select 
                           value={role}
                           onChange={(e) => setRole(e.target.value)}
                           suppressHydrationWarning
                           className="w-full pl-16 pr-8 py-5 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl text-[14px] font-black text-emerald-900 outline-none focus:border-emerald-600 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                           <option>Admin</option>
                           <option>Reception</option>
                           <option>Doctor</option>
                           <option>Nursing</option>
                           <option>Medical</option>
                        </select>
                        <ChevronDown className="w-5 h-5 absolute right-6 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                     </div>
                  </div>
               </div>
                {errorMsg && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center gap-3 animate-in fade-in slide-in-from-top-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    {errorMsg}
                  </div>
                )}

                <button 
                   disabled={isLoading}
                   className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-4 group disabled:opacity-70"
                >
                   {isLoading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : (
                     <>
                       LOGIN TO SYSTEM
                       <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                     </>
                   )}
                </button>

               <div className="text-center">
                  <button type="button" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">Forgot your password?</button>
               </div>
            </form>
         </div>

      </div>

      {/* 🔷 FOOTER */}
      <div className="mt-20 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-6 animate-pulse">
         <div className="w-12 h-[1px] bg-slate-200" />
         MedFlow ERP v1.0.4 • 2026
         <div className="w-12 h-[1px] bg-slate-200" />
      </div>

    </div>
  );
};

const ChevronDown = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
  </svg>
);

export default StaticLoginView;
