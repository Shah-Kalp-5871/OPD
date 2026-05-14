'use client';

import React, { useState, useEffect } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  ClipboardList, 
  FlaskConical, 
  Pill, 
  Activity, 
  Image as ImageIcon, 
  CheckCircle2, 
  FileText, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  Stethoscope,
  Info,
  ChevronDown,
  CheckCircle,
  CreditCard,
  PackageCheck,
  Home
} from 'lucide-react';

const FinalReportView = () => {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(14);
  const [pageSize, setPageSize] = useState('A4');
  const [activeCase, setActiveCase] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  
  const [visibility, setVisibility] = useState({
    vitals: true,
    diagnosis: true,
    investigation: true,
    advice: true,
    followup: true
  });

  useEffect(() => {
    fetchActiveSession();
  }, []);

  const fetchActiveSession = async () => {
    try {
      const response = await api.get('/queue/live');
      const inSession = response.data.find((q: any) => q.status === 'IN_SESSION');
      if (inSession) {
        setActiveCase(inSession);
      }
    } catch (error) {
      console.error('Failed to fetch session', error);
    }
  };

  const handleEndSession = async (nextStage: string) => {
    if (!activeCase) return;
    setIsSubmitting(true);
    try {
      await api.post('/queue/session/end', { 
        caseId: activeCase.caseId,
        nextStage 
      });
      toast.success(`Visit finalized. Patient moved to ${nextStage}.`);
      router.push('/doctor/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to finalize session');
    } finally {
      setIsSubmitting(false);
      setShowFinalizeModal(false);
    }
  };

  const tabs = [
    { id: 1, label: 'Complaints', icon: ClipboardList, completed: true, href: '/doctor/consultation/complaints' },
    { id: 2, label: 'Investigation', icon: FlaskConical, completed: true, href: '/doctor/consultation/investigation' },
    { id: 3, label: 'Drugs', icon: Pill, completed: true, href: '/doctor/consultation/drugs' },
    { id: 4, label: 'Procedure', icon: Activity, completed: true, href: '/doctor/consultation/procedure' },
    { id: 5, label: 'Images', icon: ImageIcon, completed: true, href: '/doctor/consultation/images' },
    { id: 6, label: 'Diagnosis + F/U', icon: CheckCircle2, completed: true, href: '/doctor/consultation/diagnosis' },
    { id: 7, label: 'Final Report', icon: FileText, active: true, href: '/doctor/consultation/final-report' },
  ];

  const toggleVisibility = (section: keyof typeof visibility) => {
    setVisibility(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-32 px-4">
        
        {/* 🔷 TOP CONSULTATION WORKFLOW TABS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1.5 flex overflow-x-auto scrollbar-hide gap-1 print:hidden">
           {tabs.map((tab) => (
             <Link 
               key={tab.id}
               href={tab.href || '#'}
               className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${
                 tab.active 
                 ? 'bg-slate-900 text-white shadow-xl' 
                 : 'text-slate-400 hover:bg-slate-50'
               }`}
             >
                <tab.icon className={`w-4 h-4 ${tab.active ? 'text-blue-400' : 'text-slate-300'}`} />
                {tab.id} {tab.label}
             </Link>
           ))}
        </div>

        {/* 🔷 TOP STICKY TOOLBAR */}
        <div className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm print:hidden">
           <div className="flex items-center gap-8 px-4">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Size</span>
                 <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                    <button onClick={() => setFontSize(Math.max(10, fontSize - 1))} className="px-4 py-1.5 text-[10px] font-black text-slate-700 hover:bg-slate-100 rounded-lg uppercase">A-</button>
                    <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className="px-4 py-1.5 text-[10px] font-black text-slate-700 hover:bg-slate-100 rounded-lg uppercase">A+</button>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Size</span>
                 <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 cursor-pointer hover:bg-slate-50 transition-all">
                    <span className="text-[10px] font-black text-slate-800 uppercase">{pageSize}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <button className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                 PREVIEW PDF
              </button>
              <button 
                onClick={() => setShowFinalizeModal(true)}
                className="px-12 py-4 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center gap-3"
              >
                 <CheckCircle className="w-5 h-5" />
                 FINALIZE CONSULTATION
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* 🔷 MAIN PRESCRIPTION PREVIEW (LEFT) */}
           <div className="lg:col-span-8">
              <div className="bg-white shadow-[0_30px_70px_rgba(0,0,0,0.1)] rounded-none border border-slate-100 min-h-[1000px] overflow-hidden flex flex-col" style={{ fontSize: `${fontSize}px` }}>
                 
                 {/* Clinical Header */}
                 <div className="bg-slate-900 text-white p-16 flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10 space-y-2">
                       <h1 className="text-3xl font-black tracking-tight uppercase leading-tight">Dr. Raj Valaki</h1>
                       <p className="text-sm font-bold text-blue-400 uppercase tracking-[0.3em]">MD Dermatology & Cosmetology</p>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                       <Stethoscope className="w-80 h-80" />
                    </div>

                    <div className="relative z-10 text-right space-y-1">
                       <div className="flex items-center justify-end gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-500/20">SV</div>
                          <span className="text-[11px] font-black tracking-[0.4em] uppercase">Skin & Laser Clinic</span>
                       </div>
                       <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">www.skinvilla.com | +91 98765-43210</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">123, Platinum Plaza, VIP Road, Surat</p>
                    </div>
                 </div>

                 <div className="p-16 space-y-10 flex-1">
                    
                    {/* Patient Banner */}
                    <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl relative">
                       <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1.5 bg-white border-2 border-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                          Clinical Record
                       </div>
                       <div className="flex justify-between items-start mb-6 border-b border-slate-200 pb-6">
                          <div className="space-y-2">
                             <h2 className="text-2xl font-black text-slate-900 uppercase leading-none">
                                {activeCase ? `${activeCase.patient.firstName} ${activeCase.patient.lastName}` : 'Mahesh K. Kumar'}
                             </h2>
                             <div className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mt-3">
                                <span>MRD: {activeCase?.patient.mrdNumber || 'P03-260003'}</span>
                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                                <span>{activeCase?.patient.gender || '45M'}</span>
                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                                <span>Blood: {activeCase?.patient.bloodGroup || 'B+'}</span>
                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                                <span>ID: {activeCase?.tokenDisplay || 'OPD-001'}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visit Date</p>
                             <p className="text-base font-black text-slate-900">{new Date().toLocaleDateString('en-GB')}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-slate-200">C/C:</span>
                          <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wide">Itching with redness, axillary area, 2 weeks, Moderate onset</span>
                       </div>
                    </div>

                    {/* Vitals */}
                    {visibility.vitals && (
                      <div className="grid grid-cols-7 gap-4 py-6 border-y border-slate-100 bg-slate-50/30 rounded-2xl px-6">
                         {[
                           { l: 'Ht', v: '172cm' }, { l: 'Wt', v: '72kg' }, { l: 'BMI', v: '24.3' },
                           { l: 'Temp', v: '98.6F' }, { l: 'Pulse', v: '76' }, { l: 'BP', v: '122/80' }, { l: 'SpO2', v: '98%' }
                         ].map((item, i) => (
                           <div key={i} className="flex flex-col gap-1">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.l}</span>
                              <span className="text-[11px] font-black text-slate-900">{item.v}</span>
                           </div>
                         ))}
                      </div>
                    )}

                    {/* Diagnosis */}
                    {visibility.diagnosis && (
                      <div className="space-y-3 pt-4">
                         <div className="flex items-center gap-4">
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Diagnosis:</span>
                            <span className="text-xl font-black text-slate-900 uppercase tracking-tight">Tinea Cruris (ICD-10: B35.6)</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Differential:</span>
                            <span className="text-xs font-bold text-slate-500 uppercase">Contact Dermatitis, Erythrasma</span>
                         </div>
                      </div>
                    )}

                    {/* Rx Section */}
                    <div className="pt-10 space-y-8">
                       <div className="flex items-center gap-6">
                          <span className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic opacity-20">Rx:</span>
                          <div className="h-[2px] flex-1 bg-slate-100"></div>
                       </div>
                       
                       <div className="space-y-8">
                          {[
                            { n: 'Tab Dolo 650mg', s: '1T-TDS | After Food | 5 Days', qty: '15 Tabs' },
                            { n: 'Syp Albendazole', s: '5ml-OD | Before Food | Weekly x4', qty: '20ml' },
                            { n: 'Cream Clotrimazole 1%', s: 'Apply-BD | Clean and dry area | 10 Days', qty: '1 Tube' },
                            { n: 'Tab Levocetrizine 5mg', s: '1T-HS | Night only | 7 Days', qty: '7 Tabs' }
                          ].map((med, idx) => (
                            <div key={idx} className="flex items-start gap-6 group">
                               <span className="text-base font-black text-slate-200 mt-0.5">{idx + 1}.</span>
                               <div className="flex-1">
                                  <div className="flex justify-between items-baseline mb-1">
                                     <h4 className="text-base font-black text-slate-900 uppercase tracking-wide">{med.n}</h4>
                                     <span className="text-[10px] font-black text-slate-400 uppercase">{med.qty}</span>
                                  </div>
                                  <p className="text-[12px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">{med.s}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Advice */}
                    {visibility.advice && (
                      <div className="pt-12 space-y-4 border-t border-slate-50">
                         <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                            <Info className="w-4 h-4" /> CLINICAL ADVICE & LIFESTYLE
                         </h4>
                         <ul className="grid grid-cols-2 gap-x-12 gap-y-3">
                            {[
                              'Avoid tight synthetic clothing',
                              'Use separate towel for affected area',
                              'Keep area dry using fungal powder',
                              'Review immediately if rash spreads'
                            ].map((advice, i) => (
                               <li key={i} className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                  {advice}
                               </li>
                            ))}
                         </ul>
                      </div>
                    )}

                 </div>

                 {/* Signature Area */}
                 <div className="p-16 pt-0 flex justify-between items-end mt-auto">
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                       Ref: OPD/{activeCase?.id.slice(0, 8).toUpperCase() || 'REF-8822'}
                    </div>
                    <div className="text-center space-y-4">
                       <div className="w-72 h-[1px] bg-slate-900/10"></div>
                       <div className="relative">
                          <p className="text-lg font-black text-slate-900 uppercase">Dr. Raj Valaki</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reg No: G-123456</p>
                       </div>
                    </div>
                 </div>

                 {/* Print Footer */}
                 <div className="bg-slate-900 p-8 text-center">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">
                       MedFlow Integrated Clinical Network • Digital Prescription • Verified Original
                    </p>
                 </div>
              </div>
           </div>

           {/* 🔷 SIDEBAR CONTROLS (RIGHT) */}
           <div className="lg:col-span-4 space-y-8 print:hidden">
              
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Workflow Controls</h3>
                 </div>
                 
                 <div className="p-8 space-y-8">
                    
                    {/* VISIBILITY TOGGLES */}
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Report Sections</label>
                       <div className="grid grid-cols-1 gap-2">
                          {(Object.keys(visibility) as Array<keyof typeof visibility>).map((key) => (
                             <button 
                               key={key}
                               onClick={() => toggleVisibility(key)}
                               className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all ${
                                 visibility[key] 
                                 ? 'bg-blue-50 border-blue-600 text-blue-700' 
                                 : 'bg-white border-slate-100 text-slate-400 opacity-50'
                               }`}
                             >
                                <span className="text-[11px] font-black uppercase tracking-widest">{key}</span>
                                {visibility[key] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                             </button>
                          ))}
                       </div>
                    </div>

                    {/* FINALIZE BUTTON */}
                    <div className="pt-8 border-t border-slate-100">
                       <button 
                         onClick={() => setShowFinalizeModal(true)}
                         className="w-full py-6 bg-emerald-600 text-white rounded-3xl text-xs font-black uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 flex items-center justify-center gap-4 group"
                       >
                          Finalize Visit
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                       </button>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-6 italic">
                          Patient will be moved from your live queue board.
                       </p>
                    </div>
                 </div>
              </div>

              {/* HELPER BOXES */}
              <div className="space-y-4">
                 <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                       <Stethoscope className="w-32 h-32" />
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 text-blue-200">Patient Routing</h4>
                    <p className="text-sm font-black leading-relaxed">
                       Finalizing this case will update the Reception and Billing boards instantly.
                    </p>
                 </div>
              </div>

           </div>
        </div>
      </div>

      {/* 🔷 FINALIZE CONSULTATION MODAL */}
      {showFinalizeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-4 border-white">
              <div className="p-12 text-center space-y-8">
                 <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Visit Completed</h2>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Where should the patient go next?</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Billing', icon: CreditCard, stage: 'BILLING', color: 'bg-blue-600 hover:bg-blue-700' },
                      { label: 'Pharmacy', icon: PackageCheck, stage: 'PHARMACY', color: 'bg-indigo-600 hover:bg-indigo-700' },
                      { label: 'Home/Done', icon: Home, stage: 'COMPLETED', color: 'bg-slate-900 hover:bg-black' },
                    ].map((btn) => (
                      <button 
                        key={btn.stage}
                        onClick={() => handleEndSession(btn.stage)}
                        disabled={isSubmitting}
                        className={`p-8 ${btn.color} rounded-[2rem] text-white transition-all flex flex-col items-center gap-4 group hover:scale-105 active:scale-95 shadow-xl shadow-slate-200`}
                      >
                         <btn.icon className="w-8 h-8 opacity-80 group-hover:scale-110 transition-transform" />
                         <span className="text-[11px] font-black uppercase tracking-[0.2em]">{btn.label}</span>
                      </button>
                    ))}
                 </div>

                 <button 
                   onClick={() => setShowFinalizeModal(false)}
                   className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                 >
                    [ Cancel and Resume Consultation ]
                 </button>
              </div>
           </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden, aside, nav, header { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; }
          .lg\\:col-span-8 { width: 100% !important; }
          .shadow-2xl, .shadow-sm { box-shadow: none !important; }
          .rounded-none { border: none !important; }
        }
      `}</style>
    </DoctorLayout>
  );
};

export default FinalReportView;
