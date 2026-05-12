'use client';

import React, { useState } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import Link from 'next/link';
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
  Printer, 
  ChevronRight, 
  Stethoscope,
  Info,
  ChevronDown
} from 'lucide-react';

const FinalReportView = () => {
  const [fontSize, setFontSize] = useState(14);
  const [pageSize, setPageSize] = useState('A4');
  const [visibility, setVisibility] = useState({
    vitals: true,
    diagnosis: true,
    investigation: true,
    advice: true,
    followup: true
  });

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
      <div className="max-w-7xl mx-auto space-y-6 pb-32">
        
        {/* 🔷 TOP CONSULTATION WORKFLOW TABS */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1 flex overflow-x-auto scrollbar-hide gap-1 print:hidden">
           {tabs.map((tab) => (
             <Link 
               key={tab.id}
               href={tab.href || '#'}
               className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 rounded-lg transition-all font-bold text-[11px] uppercase tracking-wider ${
                 tab.active 
                 ? 'bg-slate-900 text-white shadow-md' 
                 : 'text-slate-500 hover:bg-slate-50'
               }`}
             >
                <tab.icon className={`w-3.5 h-3.5 ${tab.active ? 'text-blue-400' : 'text-slate-400'}`} />
                {tab.id} {tab.label}
             </Link>
           ))}
        </div>

        {/* 🔷 TOP STICKY TOOLBAR */}
        <div className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-4 shadow-sm print:hidden">
           <div className="flex items-center gap-6 px-4">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Size:</span>
                 <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                    <button onClick={() => setFontSize(Math.max(10, fontSize - 1))} className="px-3 py-1 text-xs font-black text-slate-600 hover:bg-slate-100 rounded-md transition-all">[ A- ]</button>
                    <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className="px-3 py-1 text-xs font-black text-slate-600 hover:bg-slate-100 rounded-md transition-all">[ A+ ]</button>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Size:</span>
                 <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-50 transition-all">
                    <span className="text-[10px] font-black text-slate-700 uppercase">[ {pageSize} ]</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Print Section Visibility:</span>
                 <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-700 uppercase hover:bg-slate-50 transition-all">[ Manage ]</button>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <button className="px-8 py-3.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center gap-2">
                 PRINT / SAVE PDF
              </button>
              <button className="px-8 py-3.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center gap-2">
                 NEXT PATIENT →
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* 🔷 MAIN PRESCRIPTION PREVIEW (LEFT) */}
           <div className="lg:col-span-8">
              <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-none border border-slate-100 min-h-[1000px] overflow-hidden flex flex-col" style={{ fontSize: `${fontSize}px` }}>
                 
                 {/* Clinical Header */}
                 <div className="bg-slate-900 text-white p-12 flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10 space-y-1">
                       <h1 className="text-2xl font-black tracking-tight uppercase leading-tight">Dr. Raj Valaki</h1>
                       <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">MD Dermatology</p>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                       <Stethoscope className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 text-right space-y-1">
                       <div className="flex items-center justify-end gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-black text-white text-xs">SV</div>
                          <span className="text-[10px] font-black tracking-[0.3em] uppercase">Skin & Laser Clinic</span>
                       </div>
                       <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">www.clinic.com | 98765-43210</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">123, Main Rd, Surat – 395001</p>
                    </div>
                 </div>

                 <div className="p-12 space-y-8 flex-1">
                    
                    {/* Patient Banner */}
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                       <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-4">
                          <div className="space-y-1">
                             <h2 className="text-lg font-black text-slate-800 uppercase leading-none">Mahesh K. Kumar</h2>
                             <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                                <span>MRD: P03-260003</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>45M</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>B+</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>Case: C003-001-130426</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                             <p className="text-sm font-black text-slate-800">13/04/2026</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">C/C:</span>
                          <span className="text-[11px] font-bold text-slate-600 uppercase">Itching with redness, axillary area, 2 weeks, Moderate</span>
                       </div>
                    </div>

                    {/* Vitals */}
                    {visibility.vitals && (
                      <div className="flex flex-wrap gap-x-8 gap-y-2 py-4 border-b border-slate-100">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Vitals:</span>
                         {[
                           { l: 'Ht', v: '172cm' }, { l: 'Wt', v: '72kg' }, { l: 'BMI', v: '24.3' },
                           { l: 'Temp', v: '98.6F' }, { l: 'Pulse', v: '76' }, { l: 'BP', v: '122/80' }, { l: 'SpO2', v: '98%' }
                         ].map((item, i) => (
                           <div key={i} className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-slate-800">{item.l}</span>
                              <span className="text-[10px] font-bold text-slate-600">{item.v}</span>
                           </div>
                         ))}
                      </div>
                    )}

                    {/* Diagnosis */}
                    {visibility.diagnosis && (
                      <div className="space-y-2">
                         <div className="flex items-baseline gap-3">
                            <span className="text-sm font-black text-slate-900">Dx:</span>
                            <span className="text-base font-black text-slate-800 uppercase tracking-tight">Tinea Cruris (B35.6)</span>
                         </div>
                         <div className="flex items-baseline gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diff Dx:</span>
                            <span className="text-xs font-bold text-slate-600 uppercase">Eczema</span>
                         </div>
                      </div>
                    )}

                    {/* Rx Section */}
                    <div className="pt-6 space-y-6">
                       <div className="flex items-center gap-4">
                          <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Rx:</span>
                          <div className="h-px flex-1 bg-slate-100"></div>
                       </div>
                       
                       <div className="space-y-6">
                          {[
                            { n: 'Tab Dolo 650mg', s: '1T-TDS | After Food | 5 Days' },
                            { n: 'Syp Albendazole', s: '5ml-OD | Before Food | Weekly x4' },
                            { n: 'Cream Clotrimazole', s: 'Apply-BD | Keep dry | 10 Days' },
                            { n: '(S) Tab Levocetrizine', s: '1T-OD | After Food | 7 Days' }
                          ].map((med, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                               <span className="text-sm font-black text-slate-300">{idx + 1}.</span>
                               <div>
                                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">{med.n}</h4>
                                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">{med.s}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Investigations */}
                    {visibility.investigation && (
                      <div className="pt-8 space-y-3">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investigations Requested:</h4>
                         <p className="text-xs font-black text-slate-700 uppercase tracking-widest">CBC, Blood Sugar (Fasting), TSH</p>
                      </div>
                    )}

                    {/* Advice */}
                    {visibility.advice && (
                      <div className="pt-8 space-y-3">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Advice:</h4>
                         <p className="text-xs font-black text-slate-700 uppercase tracking-widest leading-relaxed">
                            Avoid tight clothing | Keep area dry | Complete medication course
                         </p>
                      </div>
                    )}

                    {/* Follow-up */}
                    {visibility.followup && (
                      <div className="pt-8 space-y-3">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next F/U:</h4>
                         <div className="flex flex-wrap gap-8">
                            {[
                               '1/4 – 14/04/2026 (Tue)',
                               '2/4 – 04/05/2026 (Mon)',
                               '3/4 – 24/05/2026'
                            ].map((fu, idx) => (
                               <span key={idx} className="text-xs font-black text-slate-700 uppercase tracking-widest">{fu}</span>
                            ))}
                         </div>
                      </div>
                    )}

                 </div>

                 {/* Signature Area */}
                 <div className="p-12 pt-0 flex justify-between items-end mt-auto">
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                       13/04/2026
                    </div>
                    <div className="text-center space-y-3">
                       <div className="w-64 h-px bg-slate-900/10"></div>
                       <div>
                          <p className="text-sm font-black text-slate-800 uppercase">Dr. Raj Valaki</p>
                          <div className="w-48 h-[1px] bg-slate-900 mx-auto mt-2"></div>
                       </div>
                    </div>
                 </div>

                 {/* Print Footer */}
                 <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">
                       MedFlow EMR • Digitally Signed Clinical Report • Powered by Skin & Laser Clinic
                    </p>
                 </div>
              </div>
           </div>

           {/* 🔷 SIDEBAR CONTROLS (RIGHT) */}
           <div className="lg:col-span-4 space-y-6 print:hidden">
              
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Print Controls</h3>
                 </div>
                 
                 <div className="p-6 space-y-4">
                    
                    {/* Font Size */}
                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Size A-/A+</label>
                       </div>
                       <div className="flex bg-slate-100 p-1 rounded-xl">
                          <button onClick={() => setFontSize(Math.max(10, fontSize - 1))} className="flex-1 py-2 text-[10px] font-black text-slate-600 hover:bg-white hover:text-blue-600 rounded-lg transition-all uppercase">A-</button>
                          <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className="flex-1 py-2 text-[10px] font-black text-slate-600 hover:bg-white hover:text-blue-600 rounded-lg transition-all uppercase">A+</button>
                       </div>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Adjust if Rx {'>'} 1 page</p>
                    </div>

                    {/* Page Size */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page Size: A4/A3/4-side</label>
                       <div className="flex bg-slate-100 p-1 rounded-xl">
                          {['A4', 'A3', '4-side'].map(size => (
                            <button 
                              key={size}
                              onClick={() => setPageSize(size)}
                              className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all uppercase ${
                                pageSize === size ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                               {size}
                            </button>
                          ))}
                       </div>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Select before print</p>
                    </div>

                    {/* Section Visibility */}
                    <div className="space-y-3 pt-4 border-t border-slate-50">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          Section Visibility <div className="w-2 h-2 bg-slate-900"></div>
                       </label>
                       <div className="grid grid-cols-1 gap-2">
                          {(Object.keys(visibility) as Array<keyof typeof visibility>).map((key) => (
                             <button 
                               key={key}
                               onClick={() => toggleVisibility(key)}
                               className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                                 visibility[key] 
                                 ? 'bg-blue-50 border-blue-100 text-blue-600' 
                                 : 'bg-white border-slate-200 text-slate-400'
                               }`}
                             >
                                <span className="text-[10px] font-black uppercase tracking-widest">{key}</span>
                                {visibility[key] ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                             </button>
                          ))}
                       </div>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Eye icon hides sections</p>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                       <div className="space-y-2">
                          <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-blue-300 transition-all">
                             Brand/Generic Toggle
                          </button>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Set globally from Admin</p>
                       </div>
                       
                       <div className="space-y-2">
                          <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-blue-300 transition-all group">
                             Next Patient →
                             <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 italic">Go to next without saving</p>
                       </div>
                    </div>

                 </div>
              </div>

              {/* Helper Notes */}
              <div className="space-y-4">
                 <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                    <div className="flex gap-3">
                       <Info className="w-4 h-4 text-amber-500 shrink-0" />
                       <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-widest">
                          Admin controls all formatting. Doctors only change font size.
                       </p>
                    </div>
                 </div>
                 <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                    <div className="flex gap-3">
                       <Info className="w-4 h-4 text-amber-500 shrink-0" />
                       <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-widest">
                          Eye icon per section per patient. Admin sets global defaults.
                       </p>
                    </div>
                 </div>
              </div>

           </div>

        </div>

      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden, aside, nav, header { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; }
          .lg\\:col-span-8 { width: 100% !important; }
          .shadow-2xl, .shadow-sm { shadow: none !important; }
          .rounded-none { border: none !important; }
        }
        @page {
           margin: 0;
           size: auto;
        }
      `}</style>
    </DoctorLayout>
  );
};

export default FinalReportView;
