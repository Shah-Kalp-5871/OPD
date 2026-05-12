'use client';

import React, { useState } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import Link from 'next/link';
import { 
  ClipboardList, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Activity, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  Thermometer,
  Weight,
  Heart,
  Droplets,
  ChevronDown,
  Save,
  MessageSquare,
  History,
  ShieldAlert,
  Info,
  ChevronLeft
} from 'lucide-react';

const ConsultationView = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [isEditingVitals, setIsEditingVitals] = useState(false);
  const [vitals, setVitals] = useState({
    height: '172',
    weight: '72',
    bmi: '24.3',
    temp: '98.6',
    pulse: '76',
    bp: '122/80',
    spo2: '98'
  });

  const tabs = [
    { id: 1, label: 'Complaints', icon: ClipboardList, active: true, href: '/doctor/consultation/complaints' },
    { id: 2, label: 'Investigation', icon: FlaskConical, href: '/doctor/consultation/investigation' },
    { id: 3, label: 'Drugs', icon: Pill, href: '/doctor/consultation/drugs' },
    { id: 4, label: 'Procedure', icon: Activity, href: '/doctor/consultation/procedure' },
    { id: 5, label: 'Images', icon: ImageIcon, href: '/doctor/consultation/images' },
    { id: 6, label: 'Diagnosis + F/U', icon: CheckCircle2, href: '/doctor/consultation/diagnosis' },
    { id: 7, label: 'Final Report', icon: FileText, href: '/doctor/consultation/final-report' },
  ];

  const handleVitalChange = (field: string, value: string) => {
    setVitals({ ...vitals, [field]: value });
  };

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-32">
        
        {/* 🔷 TOP CONSULTATION TABS (STEPPER) */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2 flex overflow-x-auto scrollbar-hide gap-1">
           {tabs.map((tab) => (
             <Link 
               key={tab.id}
               href={tab.href}
               className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${
                 tab.active 
                 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                 : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
               }`}
             >
                <tab.icon className={`w-4 h-4 ${tab.active ? 'text-blue-400' : 'text-slate-300'}`} />
                {tab.id} {tab.label}
             </Link>
           ))}
        </div>

        {/* 🔷 SPECIAL NOTE ALERT */}
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-start gap-4 shadow-sm relative overflow-hidden group">
           <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
           <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
           <div className="flex-1">
              <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2">Special Clinical Notes</h4>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                 <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                    (S) Tab Levocip – Not Taken (01/04/2026)
                 </span>
                 <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                    F/U Missed – 08/04 (Call not answered)
                 </span>
                 <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                    Advised Procedure: Chemical Peel – not yet taken
                 </span>
              </div>
           </div>
           <Info className="w-4 h-4 text-amber-300 cursor-help" />
        </div>

        {/* 🔷 SECTION 1: VITALS PANEL */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Patient Vitals</h3>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Entered by Nursing/Reception — Click field to Edit</p>
              </div>
              <div className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">
                 Live Health Metrics
              </div>
           </div>
           
           <div className="p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
              {[
                { label: 'Height', value: vitals.height, unit: 'cm', field: 'height', icon: Activity },
                { label: 'Weight', value: vitals.weight, unit: 'kg', field: 'weight', icon: Weight },
                { label: 'BMI (Auto)', value: vitals.bmi, unit: '', field: 'bmi', icon: Info, isReadOnly: true },
                { label: 'Temp', value: vitals.temp, unit: '°F', field: 'temp', icon: Thermometer },
                { label: 'Pulse', value: vitals.pulse, unit: 'bpm', field: 'pulse', icon: Heart },
                { label: 'BP', value: vitals.bp, unit: 'mmHg', field: 'bp', icon: Droplets },
                { label: 'SpO2', value: vitals.spo2, unit: '%', field: 'spo2', icon: Activity },
              ].map((vital, idx) => (
                <div 
                  key={idx} 
                  className={`group cursor-pointer transition-all ${vital.isReadOnly ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                  onClick={() => !vital.isReadOnly && setIsEditingVitals(true)}
                >
                   <div className="flex items-center gap-2 mb-2">
                      <vital.icon className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{vital.label}</span>
                   </div>
                   <div className="flex items-baseline gap-1">
                      <input 
                        type="text"
                        disabled={vital.isReadOnly}
                        value={vital.value}
                        onChange={(e) => handleVitalChange(vital.field, e.target.value)}
                        className={`w-full bg-transparent text-xl font-black text-slate-800 outline-none ${vital.isReadOnly ? '' : 'focus:text-blue-600'}`}
                      />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{vital.unit}</span>
                   </div>
                   <div className="h-0.5 w-full bg-slate-50 mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-100 group-hover:bg-blue-400 transition-all w-3/4"></div>
                   </div>
                </div>
              ))}
           </div>
           <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
              <Info className="w-3 h-3 text-slate-300" />
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">All field labels configurable by Admin (Enable/Disable and Rename).</p>
           </div>
        </div>

        {/* 🔷 SECTION 2: DOCTOR CLINICAL ENTRY */}
        <div className="grid grid-cols-1 gap-8">
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                 <Stethoscope className="w-4 h-4 text-slate-400" />
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Doctor’s Clinical Entry</h3>
              </div>
              
              <div className="p-10 space-y-10">
                 
                 {/* COMPLAINT & DURATION */}
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          Present Complaint <span className="text-rose-500">*</span>
                       </label>
                       <textarea 
                         rows={3}
                         className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                         placeholder="Describe the patient's main concern..."
                       />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                       <div className="md:col-span-3 grid grid-cols-3 gap-3">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Days</label>
                             <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-blue-600 transition-all" placeholder="0" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Months</label>
                             <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-blue-600 transition-all" placeholder="0" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Years</label>
                             <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-blue-600 transition-all" placeholder="0" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Severity</label>
                          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer">
                             <option>Select</option>
                             <option>Mild</option>
                             <option>Moderate</option>
                             <option>Severe</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Onset</label>
                          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer">
                             <option>Select</option>
                             <option>Sudden</option>
                             <option>Gradual</option>
                          </select>
                       </div>
                    </div>
                 </div>

                 {/* MULTI-FIELD GRID */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                      { label: 'Aggravating Factors', placeholder: 'e.g., Stress, certain foods...' },
                      { label: 'Relieving Factors', placeholder: 'e.g., Rest, medication...' },
                      { label: 'Past Medical History', placeholder: 'Previous illnesses or chronic conditions...' },
                      { label: 'Personal History', placeholder: 'Diet, sleep, exercise, smoking...' },
                      { label: 'Surgical History', placeholder: 'Previous surgeries and dates...' },
                      { label: 'Current Medications', placeholder: 'Ongoing drug prescriptions...' },
                      { label: 'Allergy History', placeholder: 'Drug, food, or seasonal allergies...' },
                      { label: 'Obstetric / Gynaecological History (E/D)', placeholder: 'Relevant clinical history...' },
                    ].map((field, idx) => (
                      <div key={idx} className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            {field.label}
                         </label>
                         <textarea 
                           rows={2}
                           className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                           placeholder={field.placeholder}
                         />
                      </div>
                    ))}
                 </div>

                 {/* 🔷 NURSING NOTES SECTION */}
                 <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 shrink-0">
                       <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-2">Nursing Notes (Read-only)</h4>
                       <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider italic">
                          “Patient reports itching in axillary area for 2 weeks. Mild redness noted.”
                       </p>
                    </div>
                 </div>

              </div>
           </div>
        </div>

        <div className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 flex justify-end gap-4 z-40">
           <button className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Draft
           </button>
           <Link 
             href="/doctor/consultation/investigation"
             className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-2 group"
           >
              Next → Investigation
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
           </Link>
        </div>

      </div>
    </DoctorLayout>
  );
};

export default ConsultationView;
