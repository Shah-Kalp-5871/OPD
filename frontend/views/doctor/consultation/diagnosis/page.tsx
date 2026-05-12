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
  Search, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  X, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Star, 
  Info, 
  Save,
  Stethoscope,
  Clock,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

const DiagnosisView = () => {
  const [icdSearch, setIcdSearch] = useState('');
  const [showIcdDropdown, setShowIcdDropdown] = useState(false);
  const [instructions, setInstructions] = useState([
    'Avoid tight clothing in affected area',
    'Keep area dry and clean',
    'Complete full course of medication',
    'Return immediately if rash spreads'
  ]);

  const tabs = [
    { id: 1, label: 'Complaints', icon: ClipboardList, completed: true, href: '/doctor/consultation/complaints' },
    { id: 2, label: 'Investigation', icon: FlaskConical, completed: true, href: '/doctor/consultation/investigation' },
    { id: 3, label: 'Drugs', icon: Pill, completed: true, href: '/doctor/consultation/drugs' },
    { id: 4, label: 'Procedure', icon: Activity, completed: true, href: '/doctor/consultation/procedure' },
    { id: 5, label: 'Images', icon: ImageIcon, completed: true, href: '/doctor/consultation/images' },
    { id: 6, label: 'Diagnosis + F/U', icon: CheckCircle2, active: true, href: '/doctor/consultation/diagnosis' },
    { id: 7, label: 'Final Report', icon: FileText, href: '/doctor/consultation/final-report' },
  ];

  const icdResults = [
    { code: 'B35.6', name: 'Tinea Cruris' },
    { code: 'B35.4', name: 'Tinea Corporis' },
  ];

  const diagnosisList = [
    { code: 'B35.6', name: 'Tinea Cruris', hidden: false, status: 'Confirmed' },
    { code: 'B35.4', name: 'Tinea Corporis', hidden: true, status: 'Provisional' },
  ];

  const followupSchedule = [
    { session: '1/4', date: '14/04/2026', day: 'Tuesday', status: 'Scheduled' },
    { session: '2/4', date: '04/05/2026', day: 'Monday', status: 'Scheduled' },
    { session: '3/4', date: '24/05/2026', day: 'Sunday', status: 'Blocked', warning: 'Sunday blocked. Suggested alternative date.' },
    { session: '4/4', date: '13/06/2026', day: 'Saturday', status: 'Scheduled' },
  ];

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-32">
        
        {/* 🔷 TOP CONSULTATION WORKFLOW TABS */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2 flex overflow-x-auto scrollbar-hide gap-1">
           {tabs.map((tab) => (
             <Link 
               key={tab.id}
               href={tab.href || '#'}
               className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${
                 tab.active 
                 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                 : tab.completed 
                 ? 'text-emerald-600 bg-emerald-50' 
                 : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
               }`}
             >
                <div className="relative">
                  <tab.icon className={`w-4 h-4 ${tab.active ? 'text-blue-400' : tab.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                  {tab.completed && <CheckCircle2 className="w-2.5 h-2.5 absolute -top-1 -right-1 bg-white rounded-full text-emerald-600" />}
                </div>
                {tab.id} {tab.label}
             </Link>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* 🔷 LEFT: DIAGNOSIS SECTION */}
           <div className="lg:col-span-7 space-y-8">
              
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-blue-400">
                          <Stethoscope className="w-5 h-5" />
                       </div>
                       <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Diagnosis (ICD-10)</h3>
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                       <Info className="w-3 h-3 text-blue-400" />
                       Eye icon hides from prescription print
                    </div>
                 </div>

                 <div className="p-8 space-y-6">
                    {/* ICD SEARCH */}
                    <div className="relative group">
                       <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                       <input 
                         type="text"
                         value={icdSearch}
                         onChange={(e) => {
                           setIcdSearch(e.target.value);
                           setShowIcdDropdown(e.target.value.length > 0);
                         }}
                         placeholder="Search ICD-10 code or free text (e.g. Tinea, Eczema)"
                         className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                       />
                       
                       {showIcdDropdown && (
                         <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {icdResults.map((result) => (
                              <button 
                                key={result.code}
                                onClick={() => setShowIcdDropdown(false)}
                                className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0"
                              >
                                 <span className="text-sm font-black text-slate-800 uppercase tracking-widest">{result.name}</span>
                                 <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">{result.code}</span>
                              </button>
                            ))}
                         </div>
                       )}
                    </div>

                    {/* DIAGNOSIS LIST */}
                    <div className="space-y-3">
                       {diagnosisList.map((diag, idx) => (
                         <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-4">
                               <button className={`p-2 rounded-xl transition-all ${diag.hidden ? 'text-slate-300 hover:text-slate-500' : 'text-blue-600 bg-blue-50'}`}>
                                  {diag.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                               </button>
                               <div>
                                  <div className="flex items-center gap-3">
                                     <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{diag.name}</h4>
                                     <span className="text-[10px] font-black text-slate-400">({diag.code})</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                     <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                                       diag.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                     }`}>
                                        {diag.status}
                                     </span>
                                  </div>
                               </div>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                               <X className="w-4 h-4" />
                            </button>
                         </div>
                       ))}
                    </div>

                    {/* DIFFERENTIAL & NOTES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Differential Diagnosis (E/D)</label>
                          <textarea 
                            rows={3}
                            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Diagnostic Notes</label>
                          <textarea 
                            rows={3}
                            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              {/* PATIENT INSTRUCTIONS */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400">
                          <CheckCircle className="w-5 h-5" />
                       </div>
                       <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Patient Instructions / Advice</h3>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                       <Plus className="w-3 h-3" />
                       Add New
                    </button>
                 </div>
                 <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {instructions.map((ins, idx) => (
                         <div key={idx} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50 flex items-center justify-between group">
                            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest leading-relaxed">
                               {ins}
                            </span>
                            <button className="p-1.5 text-emerald-300 hover:text-rose-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                               <X className="w-3 h-3" />
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

           </div>

           {/* 🔷 RIGHT: FOLLOW-UP & REVIEW */}
           <div className="lg:col-span-5 space-y-8">
              
              {/* FOLLOW-UP SCHEDULING */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400">
                       <Calendar className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Follow-Up Scheduling</h3>
                 </div>
                 
                 <div className="p-8 space-y-8">
                    {/* MINI CALENDAR PLACEHOLDER */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col items-center">
                       <div className="flex items-center justify-between w-full mb-6 px-2">
                          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">March 2026</h4>
                          <div className="flex gap-2">
                             <button className="p-2 bg-white rounded-lg border border-slate-200"><ChevronLeft className="w-3 h-3" /></button>
                             <button className="p-2 bg-white rounded-lg border border-slate-200"><ChevronRight className="w-3 h-3" /></button>
                          </div>
                       </div>
                       <div className="grid grid-cols-7 gap-3 w-full text-center">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                            <span key={idx} className="text-[9px] font-black text-slate-300 uppercase">{day}</span>
                          ))}
                          {Array.from({ length: 31 }, (_, i) => (
                            <div 
                              key={i} 
                              className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-black transition-all ${
                                (i + 1) % 7 === 0 
                                ? 'bg-rose-50 text-rose-300 cursor-not-allowed opacity-50' 
                                : i + 1 === 14 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'hover:bg-blue-50 hover:text-blue-600 cursor-pointer text-slate-600'
                              }`}
                            >
                               {i + 1}
                            </div>
                          ))}
                       </div>
                       <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                          <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Sundays auto-blocked. Next available date suggested.</p>
                       </div>
                    </div>

                    {/* F/U SCHEDULE LIST */}
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">F/U Schedule</h4>
                       <div className="space-y-3">
                          {followupSchedule.map((fu, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between ${
                              fu.status === 'Blocked' ? 'bg-rose-50/50 border-rose-100 animate-pulse' : 'bg-slate-50 border-slate-100'
                            }`}>
                               <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center ${
                                    fu.status === 'Blocked' ? 'bg-rose-500 text-white' : 'bg-white text-slate-800'
                                  }`}>
                                     <span className="text-[8px] font-black uppercase">Sess</span>
                                     <span className="text-[11px] font-black">{fu.session}</span>
                                  </div>
                                  <div>
                                     <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-black text-slate-800 tracking-widest">{fu.date}</span>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${fu.status === 'Blocked' ? 'text-rose-500' : 'text-slate-400'}`}>
                                           ({fu.day})
                                        </span>
                                     </div>
                                     {fu.warning && <p className="text-[8px] font-black text-rose-500 uppercase tracking-tighter mt-0.5">{fu.warning}</p>}
                                  </div>
                               </div>
                               <button className="p-2 text-slate-300 hover:text-rose-500 rounded-lg transition-all">
                                  <X className="w-3.5 h-3.5" />
                               </button>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* GOOGLE REVIEW SECTION */}
              <div className="bg-slate-900 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl transition-all group-hover:bg-blue-600/20" />
                 
                 <div className="relative space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl shadow-slate-950">
                          <Star className="w-6 h-6 fill-blue-600" />
                       </div>
                       <div>
                          <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Google Review Link</h4>
                          <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-1">Enhance Practice Reputation</p>
                       </div>
                    </div>
                    
                    <label className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                       <input type="checkbox" className="w-5 h-5 rounded-lg border-white/20 bg-transparent text-blue-600 focus:ring-blue-600" />
                       <span className="text-[11px] font-black text-white uppercase tracking-widest">Send Google Review link to this patient</span>
                    </label>

                    <div className="bg-white/5 p-4 rounded-xl flex items-start gap-3">
                       <Info className="w-4 h-4 text-blue-400 shrink-0" />
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                          Google review link only sent when doctor explicitly ticks box. Link expires in 24 hours.
                       </p>
                    </div>

                    <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3">
                       <MessageSquare className="w-4 h-4" />
                       SEND REQUEST
                    </button>
                 </div>
              </div>

           </div>
        </div>

        {/* 🔷 ACTION BUTTONS (STICKY BAR) */}
        <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 flex justify-between gap-4 z-40">
           <Link 
             href="/doctor/consultation/images"
             className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
           >
              <ChevronLeft className="w-4 h-4" />
              Back to Images
           </Link>
           
           <div className="flex gap-4">
              <button className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                 <Save className="w-4 h-4" />
                 Save Progress
              </button>
              <button className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-2 group">
                 Next → Final Report
                 <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
           </div>
        </div>

      </div>
    </DoctorLayout>
  );
};

export default DiagnosisView;
