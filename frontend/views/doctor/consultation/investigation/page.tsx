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
  Beaker, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle,
  Info,
  TrendingUp,
  Save
} from 'lucide-react';

const InvestigationView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const tabs = [
    { id: 1, label: 'Complaints', icon: ClipboardList, completed: true, href: '/doctor/consultation/complaints' },
    { id: 2, label: 'Investigation', icon: FlaskConical, active: true, href: '/doctor/consultation/investigation' },
    { id: 3, label: 'Drugs', icon: Pill, href: '/doctor/consultation/drugs' },
    { id: 4, label: 'Procedure', icon: Activity, href: '/doctor/consultation/procedure' },
    { id: 5, label: 'Images', icon: ImageIcon, href: '/doctor/consultation/images' },
    { id: 6, label: 'Diagnosis + F/U', icon: CheckCircle2, href: '/doctor/consultation/diagnosis' },
    { id: 7, label: 'Final Report', icon: FileText, href: '/doctor/consultation/final-report' },
  ];

  const quickTests = [
    'CBC (Full Panel)',
    'Blood Sugar – Fasting + HbA1c',
    'LFT Panel',
    'RFT Panel',
    'Thyroid – TSH, T3, T4',
    'ESR / CRP',
    'Lipid Profile',
    'Routine Urine Examination'
  ];

  const requestedTests = [
    { name: 'CBC Full Panel', status: 'Pending', note: '-' },
    { name: 'Blood Sugar', status: 'Pending', note: 'Fasting sample' },
    { name: 'TSH', status: 'Sample Collected', note: '-' },
  ];

  const labResults = [
    { parameter: 'WBC', range: '4–11', latest: '15', previous: '8', critical: true },
    { parameter: 'SGPT', range: '7–40', latest: '52', previous: '45', outOfRange: true },
    { parameter: 'TSH', range: '0.4–4.0', latest: '3.2', previous: '2.8' },
    { parameter: 'Fasting Glucose', range: '70–100', latest: '118', previous: '102', outOfRange: true },
    { parameter: 'HbA1c', range: '< 5.7', latest: '6.1', previous: '5.9', outOfRange: true },
  ];

  const toggleTest = (test: string) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

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
           
           {/* LEFT COLUMN: REQUESTING */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* REQUEST INVESTIGATION */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Request Investigation</h3>
                 </div>
                 <div className="p-6 space-y-6">
                    <div className="relative">
                       <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                         type="text"
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder="Search test name / group..."
                         className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 focus:bg-white transition-all"
                       />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                       {quickTests.map((test, idx) => (
                         <button 
                           key={idx}
                           onClick={() => toggleTest(test)}
                           className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-all ${
                             selectedTests.includes(test)
                             ? 'bg-blue-600 text-white shadow-md'
                             : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                           }`}
                         >
                            <span className="text-[11px] font-black uppercase tracking-wider">{test}</span>
                            <Plus className={`w-4 h-4 ${selectedTests.includes(test) ? 'rotate-45' : ''} transition-transform`} />
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              {/* REQUESTED INVESTIGATIONS */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Requested Investigations</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b border-slate-50">
                             <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Test</th>
                             <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {requestedTests.map((req, idx) => (
                            <tr key={idx} className="group hover:bg-slate-50 transition-all">
                               <td className="px-6 py-4">
                                  <div className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{req.name}</div>
                                  <div className="text-[9px] font-bold text-slate-400 mt-0.5 italic">{req.note}</div>
                               </td>
                               <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    req.status === 'Sample Collected' 
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                                    : 'bg-slate-50 text-slate-500 border border-slate-100'
                                  }`}>
                                     {req.status}
                                  </span>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>

           </div>

           {/* RIGHT COLUMN: PREVIOUS RESULTS */}
           <div className="lg:col-span-8 space-y-8">
              
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                       <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Previous Results (Comparison)</h3>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">PDF upload by Nursing/Reception appears here</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-rose-100 border border-rose-200 rounded"></div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Out of Range</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-rose-500 rounded"></div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-black">Critical Alert</span>
                       </div>
                    </div>
                 </div>

                 {/* TREND VISUALS */}
                 <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50 border-b border-slate-100">
                    {[
                      { label: 'WBC Trend', value: '15', trend: 'up', color: 'text-rose-600' },
                      { label: 'SGPT Trend', value: '52', trend: 'up', color: 'text-amber-600' },
                      { label: 'TSH Trend', value: '3.2', trend: 'up', color: 'text-blue-600' },
                      { label: 'Glucose', value: '118', trend: 'up', color: 'text-rose-600' },
                    ].map((card, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                         <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{card.label}</div>
                         <div className="flex items-center justify-between">
                            <span className={`text-xl font-black ${card.color}`}>{card.value}</span>
                            {card.trend === 'up' ? <ArrowUpRight className={`w-4 h-4 ${card.color}`} /> : <ArrowDownRight className="w-4 h-4 text-emerald-500" />}
                         </div>
                         <div className="mt-2 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className={`h-full ${card.color.replace('text', 'bg')} w-2/3 opacity-20`}></div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-slate-50/30 border-b border-slate-100">
                             <th className="px-8 py-5 text-[10px] font-black text-slate-800 uppercase tracking-widest">Parameter</th>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-800 uppercase tracking-widest">Range</th>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-800 uppercase tracking-widest bg-blue-50/30">Latest (15/03)</th>
                             <th className="px-8 py-5 text-[10px] font-black text-slate-800 uppercase tracking-widest">Prev (01/02)</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {labResults.map((res, idx) => (
                            <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-1.5 h-1.5 rounded-full ${res.critical ? 'bg-rose-600 animate-pulse' : res.outOfRange ? 'bg-amber-400' : 'bg-slate-200'}`}></div>
                                     <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{res.parameter}</span>
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{res.range}</td>
                               <td className={`px-8 py-6 bg-blue-50/10 group-hover:bg-blue-50/30`}>
                                  <div className={`text-sm font-black tracking-widest ${res.critical ? 'text-rose-600 font-black scale-110' : res.outOfRange ? 'text-rose-500' : 'text-slate-800'}`}>
                                     {res.latest}
                                     {res.critical && <AlertTriangle className="w-3.5 h-3.5 inline ml-2 mb-1" />}
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-sm font-bold text-slate-500 tracking-widest">{res.previous}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 
                 <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                       <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest font-black">= Out of range / Critical flag</span>
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                       Detailed Analysis Available in Final Report
                    </div>
                 </div>
              </div>

           </div>

        </div>

        {/* 🔷 ACTION BUTTONS (STICKY BAR) */}
        <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 flex justify-between gap-4 z-40">
           <Link 
             href="/doctor/consultation"
             className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
           >
              <ChevronLeft className="w-4 h-4" />
              Back to Complaints
           </Link>
           
           <div className="flex gap-4">
              <button className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                 <Save className="w-4 h-4" />
                 Save Investigations
              </button>
              <button className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-2 group">
                 Next → Drugs
                 <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
           </div>
        </div>

      </div>
    </DoctorLayout>
  );
};

export default InvestigationView;
