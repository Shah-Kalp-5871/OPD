'use client';

import React, { useState, useEffect } from 'react';
import NursingLayout from '@/views/layouts/NursingLayout';
import { 
  Activity, 
  History, 
  Save, 
  User, 
  Hash, 
  FileText, 
  Thermometer, 
  Heart, 
  Droplet, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Scale,
  Ruler
} from 'lucide-react';

const VitalsEntryView = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('0.0');
  const [temp, setTemp] = useState('');
  const [pulse, setPulse] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [spo2, setSpo2] = useState('');

  // Auto-calculate BMI
  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      if (heightInMeters > 0) {
        const calculatedBmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setBmi(calculatedBmi);
      }
    } else {
      setBmi('0.0');
    }
  }, [height, weight]);

  const vitalsHistory = [
    { date: '01/04/2026', height: '172cm', weight: '72kg', bmi: '24.3', temp: '98.6F', pulse: '76', bp: '122/80', spo2: '98%' },
    { date: '15/03/2026', height: '172cm', weight: '71kg', bmi: '24.0', temp: '98.4F', pulse: '74', bp: '118/78', spo2: '99%' },
    { date: '01/03/2026', height: '172cm', weight: '73kg', bmi: '24.7', temp: '99.0F', pulse: '80', bp: '124/82', spo2: '97%' },
    { date: '10/02/2026', height: '172cm', weight: '70kg', bmi: '23.8', temp: '98.2F', pulse: '72', bp: '120/80', spo2: '98%' },
  ];

  const vitalsFormGroups = [
    { label: 'Height (cm) *', value: height, setter: setHeight, icon: Ruler, placeholder: '170' },
    { label: 'Weight (kg) *', value: weight, setter: setWeight, icon: Scale, placeholder: '70' },
    { label: 'Temperature (°F) *', value: temp, setter: setTemp, icon: Thermometer, placeholder: '98.6' },
    { label: 'Pulse Rate (bpm) *', value: pulse, setter: setPulse, icon: Heart, placeholder: '72' },
    { label: 'Oxygen SpO2 (%) *', value: spo2, setter: setSpo2, icon: Droplet, placeholder: '98' },
  ];

  return (
    <NursingLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-32 animate-in fade-in duration-500">
        
        {/* 🔷 PAGE HEADER */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                 <User className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Vitals Entry – MAHESH K. KUMAR</h1>
                 <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <Hash className="w-3.5 h-3.5" /> MRD: P03-260003
                    </span>
                    <span className="text-slate-200">|</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                       <FileText className="w-3.5 h-3.5" /> Case: C003-001-130426
                    </span>
                 </div>
              </div>
           </div>
           <div className="px-6 py-3 bg-blue-50 border border-blue-100 rounded-2xl">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Pre-Consultation Workflow</span>
           </div>
        </div>

        {/* 🔷 VITALS ENTRY FORM */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-blue-400">
                 <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Enter Current Vitals</h2>
           </div>

           <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 
                 {vitalsFormGroups.map((group, idx) => (
                   <div key={idx} className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{group.label}</label>
                      <div className="relative group">
                         <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                            <group.icon className="w-4 h-4" />
                         </div>
                         <input 
                           type="number" 
                           value={group.value}
                           onChange={(e) => group.setter(e.target.value)}
                           placeholder={group.placeholder}
                           className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                         />
                      </div>
                   </div>
                 ))}

                 {/* BP Input Group */}
                 <div className="space-y-3 lg:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Pressure (S/D) *</label>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         placeholder="120"
                         value={bpSystolic}
                         onChange={(e) => setBpSystolic(e.target.value)}
                         className="w-1/2 px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner text-center"
                       />
                       <span className="text-slate-300 font-black">/</span>
                       <input 
                         type="number" 
                         placeholder="80"
                         value={bpDiastolic}
                         onChange={(e) => setBpDiastolic(e.target.value)}
                         className="w-1/2 px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner text-center"
                       />
                    </div>
                 </div>

                 {/* BMI Display (Read-only) */}
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">BMI (Auto-calculated)</label>
                    <div className="w-full px-6 py-4 bg-blue-50 border border-blue-100 rounded-2xl text-[13px] font-black text-blue-700 shadow-sm flex items-center justify-between">
                       <span>Index Score</span>
                       <span className="text-xl leading-none">{bmi}</span>
                    </div>
                 </div>

              </div>

              {/* ACTION SECTION */}
              <div className="pt-10 border-t border-slate-50 flex flex-col items-center gap-6">
                 <button className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center gap-4 group">
                    <Save className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    SAVE VITALS
                 </button>
                 
                 <div className="flex items-center gap-3 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                       Vitals saved against Case ID: <span className="text-slate-800">C003-001-130426</span>. Visible to Doctor in Tab 1.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* 🔷 VITALS HISTORY SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400">
                    <History className="w-5 h-5" />
                 </div>
                 <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Vitals History – Last 4 Records (Auto-tracked)</h2>
              </div>
              <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-all flex items-center gap-2">
                 View Full Timeline <ArrowRight className="w-3.5 h-3.5" />
              </button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ht (cm)</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Wt (kg)</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">BMI</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Temp</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pulse</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">BP</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">SpO2</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {vitalsHistory.map((row, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">{row.date}</td>
                         <td className="px-6 py-6 text-[13px] font-black text-slate-800">{row.height}</td>
                         <td className="px-6 py-6 text-[13px] font-black text-slate-800">{row.weight}</td>
                         <td className="px-6 py-6 text-[13px] font-black text-blue-600">{row.bmi}</td>
                         <td className="px-6 py-6 text-[13px] font-black text-slate-800">{row.temp}</td>
                         <td className="px-6 py-6 text-[13px] font-black text-slate-800">{row.pulse}</td>
                         <td className="px-6 py-6 text-[13px] font-black text-slate-800">{row.bp}</td>
                         <td className="px-8 py-6 text-right">
                            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black">
                               {row.spo2}
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </NursingLayout>
  );
};

export default VitalsEntryView;
