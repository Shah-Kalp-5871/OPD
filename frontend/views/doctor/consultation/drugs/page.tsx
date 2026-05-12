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
  AlertTriangle,
  Info,
  Trash2,
  PlusCircle,
  Save,
  Package,
  AlertCircle,
  Tag,
  Stethoscope
} from 'lucide-react';

const DrugsView = () => {
  const [searchType, setSearchType] = useState<'Brand' | 'Generic'>('Brand');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  const tabs = [
    { id: 1, label: 'Complaints', icon: ClipboardList, completed: true, href: '/doctor/consultation/complaints' },
    { id: 2, label: 'Investigation', icon: FlaskConical, completed: true, href: '/doctor/consultation/investigation' },
    { id: 3, label: 'Drugs', icon: Pill, active: true, href: '/doctor/consultation/drugs' },
    { id: 4, label: 'Procedure', icon: Activity, href: '/doctor/consultation/procedure' },
    { id: 5, label: 'Images', icon: ImageIcon, href: '/doctor/consultation/images' },
    { id: 6, label: 'Diagnosis + F/U', icon: CheckCircle2, href: '/doctor/consultation/diagnosis' },
    { id: 7, label: 'Final Report', icon: FileText, href: '/doctor/consultation/final-report' },
  ];

  const initialPrescription = [
    { id: 1, name: 'Tab Dolo 650 mg', brand: 'Tab Dolo', dose: '1 Tab', freq: 'TDS', route: 'Oral', timing: 'After Food', days: '5', qty: '15' },
    { id: 2, name: 'Syp Albendazole', brand: 'Syp Zentel', dose: '5 ml', freq: 'OD', route: 'Oral', timing: 'Weekly x4', days: '4', qty: '1' },
    { id: 3, name: 'Cream Clotrimazole 1%', brand: 'Cream Monpic', dose: '1 Application', freq: 'BD', route: 'Topical', timing: 'Apply Twice', days: '14', qty: '1 Tube' },
    { id: 4, name: 'Tab Levocetrizine', brand: 'Zylivo', dose: '1 Tab', freq: 'OD', route: 'Oral', timing: 'After Food', days: '7', qty: '7', isSample: true },
  ];

  const [prescription, setPrescription] = useState(initialPrescription);

  const removeRow = (id: number) => {
    setPrescription(prescription.filter(row => row.id !== id));
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

        {/* 🔷 SECTION 1: DRUG SEARCH */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Add Medication</h3>
              <div className="flex bg-slate-200 p-1 rounded-xl">
                 {['Brand', 'Generic'].map((type) => (
                   <button 
                     key={type}
                     onClick={() => setSearchType(type as any)}
                     className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                       searchType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                     }`}
                   >
                      {type}
                   </button>
                 ))}
              </div>
           </div>
           <div className="p-8">
              <div className="relative group">
                 <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                 <input 
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder={`Search drug by ${searchType === 'Brand' ? 'Brand Name' : 'Generic Content Name'}...`}
                   className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                 />
                 <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Press [ENTER] to search</span>
                 </div>
              </div>
           </div>
        </div>

        {/* 🔷 DRUG ALERT PANEL */}
        {showAlert && (
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-rose-100 text-rose-500">
                   <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Inventory Stock Alert</h4>
                   <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest mt-1">
                      Tab Ciprofloxacin 500mg <span className="text-rose-600">Stock Unavailable</span>
                   </p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <button className="px-6 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                   Prescribe Alternative?
                </button>
                <button onClick={() => setShowAlert(false)} className="text-slate-400 hover:text-slate-600">
                   <Trash2 className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}

        {/* 🔷 SECTION 2: PRESCRIPTION TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Package className="w-4 h-4 text-slate-400" />
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Prescription Drugs</h3>
              </div>
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
                 <PlusCircle className="w-3.5 h-3.5" />
                 Add Drug Row
              </button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1200px]">
                 <thead>
                    <tr className="border-b border-slate-50">
                       <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-12">Rx</th>
                       <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-72">Drug Name / Content</th>
                       <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Dose</th>
                       <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Freq</th>
                       <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Route</th>
                       <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Timing</th>
                       <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-20">Days</th>
                       <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-20">Qty</th>
                       <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-12"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {prescription.map((drug, idx) => (
                      <tr key={drug.id} className="group hover:bg-slate-50/50 transition-all">
                         <td className="px-6 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">{idx + 1}</td>
                         <td className="px-6 py-6">
                            <div className="flex flex-col gap-1">
                               <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none">{drug.name}</span>
                                  {drug.isSample && (
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[8px] font-black uppercase tracking-tighter">
                                       (S) Sample
                                    </span>
                                  )}
                               </div>
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Brand: {drug.brand}</span>
                            </div>
                         </td>
                         <td className="px-6 py-6"><input type="text" defaultValue={drug.dose} className="bg-transparent text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none focus:text-blue-600 w-full" /></td>
                         <td className="px-6 py-6"><input type="text" defaultValue={drug.freq} className="bg-transparent text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none focus:text-blue-600 w-full" /></td>
                         <td className="px-6 py-6"><input type="text" defaultValue={drug.route} className="bg-transparent text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none focus:text-blue-600 w-full" /></td>
                         <td className="px-6 py-6"><input type="text" defaultValue={drug.timing} className="bg-transparent text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none focus:text-blue-600 w-full" /></td>
                         <td className="px-6 py-6"><input type="text" defaultValue={drug.days} className="bg-transparent text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none focus:text-blue-600 w-20" /></td>
                         <td className="px-6 py-6"><input type="text" defaultValue={drug.qty} className="bg-transparent text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none focus:text-blue-600 w-20" /></td>
                         <td className="px-6 py-6">
                            <button onClick={() => removeRow(drug.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-slate-300" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] italic">All fields auto-fill from master on drug selection. Editable.</p>
           </div>
        </div>

        {/* 🔷 SECTION 3: MANUAL DRUG ENTRY */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <PlusCircle className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Manual Drug Entry (Drug not in Master)</h3>
           </div>
           
           <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                 {[
                   { label: 'Drug Name / Content', placeholder: 'Enter generic content...' },
                   { label: 'Brand Name', placeholder: 'Enter brand name...' },
                   { label: 'Drug Form', placeholder: 'Tab, Syp, Inj, etc.' },
                   { label: 'Manufacturer', placeholder: 'Company name...' },
                   { label: 'Dose', placeholder: 'e.g., 500mg' },
                   { label: 'Frequency', placeholder: 'e.g., TDS' },
                   { label: 'Route', placeholder: 'Oral, IV, etc.' },
                   { label: 'Timing', placeholder: 'After Food, etc.' },
                   { label: 'Days', placeholder: 'Duration...' },
                   { label: 'Price / Unit', placeholder: '₹ 0.00' },
                   { label: 'Min Stock Alert', placeholder: 'e.g., 50' },
                 ].map((field, idx) => (
                   <div key={idx} className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                      <input type="text" placeholder={field.placeholder} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner placeholder:opacity-50" />
                   </div>
                 ))}
                 <div className="flex items-end gap-3 md:col-span-1">
                    <button className="flex-1 px-4 py-3.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                       <Plus className="w-4 h-4" /> Add to Rx
                    </button>
                    <button className="flex-1 px-4 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                       <Save className="w-4 h-4" /> Save Master
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* 🔷 MAIN WORKFLOW BUTTONS (STICKY BAR) */}
        <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 flex justify-between gap-4 z-40">
           <Link 
             href="/doctor/consultation/investigation"
             className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
           >
              <ChevronLeft className="w-4 h-4" />
              Back to Investigation
           </Link>
           
           <div className="flex gap-4">
              <button className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                 <Save className="w-4 h-4" />
                 Save Prescription
              </button>
              <button className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-2 group">
                 Next → Procedure
                 <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
           </div>
        </div>

      </div>
    </DoctorLayout>
  );
};

export default DrugsView;
