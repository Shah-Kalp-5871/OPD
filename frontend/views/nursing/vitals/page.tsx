'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NursingLayout from '@/views/layouts/NursingLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
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
  CheckCircle2,
  Scale,
  Ruler,
  Loader2
} from 'lucide-react';

const VitalsEntryContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mrd = searchParams.get('mrd');
  const caseId = searchParams.get('caseId');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Form states
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
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      if (h > 0) {
        setBmi((w / (h * h)).toFixed(1));
      }
    } else {
      setBmi('0.0');
    }
  }, [height, weight]);

  useEffect(() => {
    if (mrd) {
      fetchPatientData();
    }
  }, [mrd]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/patients/mrd/${mrd}`);
      const data = res.data || res; // handle both raw and unwrapped
      setPatient(data);
      setHistory(data.vitals || []);
      
      // Pre-fill latest height if available
      if (data.vitals?.length > 0) {
        setHeight(data.vitals[0].height?.toString() || '');
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast.error('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVitals = async () => {
    if (!patient) return;
    if (!temp || !pulse || !bpSystolic || !bpDiastolic || !spo2) {
      toast.warning('Please fill all mandatory fields (*)');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        temperature: parseFloat(temp),
        pulse: parseInt(pulse),
        bloodPressure: `${bpSystolic}/${bpDiastolic}`,
        spo2: parseInt(spo2),
        caseId: caseId || undefined,
        bmi: parseFloat(bmi)
      };

      await api.post(`/patients/${patient.id}/vitals`, payload);
      toast.success('Vitals saved successfully');
      
      // Clear form (except height usually)
      setWeight('');
      setTemp('');
      setPulse('');
      setBpSystolic('');
      setBpDiastolic('');
      setSpo2('');
      
      // Refresh history
      fetchPatientData();
    } catch (error) {
      console.error('Error saving vitals:', error);
      toast.error('Failed to save vitals');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fetching Clinical Record...</p>
      </div>
    );
  }

  if (!mrd) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
           <User className="w-10 h-10" />
        </div>
        <div>
           <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">No Patient Selected</h2>
           <p className="text-slate-500 mt-2">Please select a patient from the queue to enter vitals.</p>
        </div>
        <button 
          onClick={() => router.push('/nursing/queue')}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          Back to Queue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 animate-in fade-in duration-500">
      
      {/* 🔷 PAGE HEADER */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 uppercase font-black text-2xl">
               {patient?.firstName?.[0] || <User className="w-8 h-8" />}
            </div>
            <div>
               <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                 Vitals Entry – {patient?.firstName} {patient?.lastName}
               </h1>
               <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <Hash className="w-3.5 h-3.5" /> MRD: {patient?.mrdNumber}
                  </span>
                  {caseId && (
                    <>
                      <span className="text-slate-200">|</span>
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                         <FileText className="w-3.5 h-3.5" /> Case: {caseId.split('-').pop()}
                      </span>
                    </>
                  )}
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
               
               {/* Inputs */}
               {[
                 { label: 'Height (cm)', value: height, setter: setHeight, icon: Ruler, placeholder: '170' },
                 { label: 'Weight (kg)', value: weight, setter: setWeight, icon: Scale, placeholder: '70' },
                 { label: 'Temperature (°F) *', value: temp, setter: setTemp, icon: Thermometer, placeholder: '98.6' },
                 { label: 'Pulse Rate (bpm) *', value: pulse, setter: setPulse, icon: Heart, placeholder: '72' },
                 { label: 'Oxygen SpO2 (%) *', value: spo2, setter: setSpo2, icon: Droplet, placeholder: '98' },
               ].map((group, idx) => (
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
               <button 
                onClick={handleSaveVitals}
                disabled={saving}
                className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center gap-4 group disabled:opacity-50"
               >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  ) : (
                    <Save className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  )}
                  {saving ? 'SAVING...' : 'SAVE VITALS'}
               </button>
               
               {caseId && (
                 <div className="flex items-center gap-3 text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                       Vitals will be saved against Case ID: <span className="text-slate-800">{caseId}</span>
                    </p>
                 </div>
               )}
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
               <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Vitals History – Last 10 Records</h2>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
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
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-8 py-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        No previous records found
                      </td>
                    </tr>
                  ) : history.map((row, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                         {new Date(row.takenAt).toLocaleString()}
                       </td>
                       <td className="px-6 py-6 text-[13px] font-black text-slate-800">{row.height || '-'}</td>
                       <td className="px-6 py-6 text-[13px] font-black text-slate-800">{row.weight || '-'}</td>
                       <td className="px-6 py-6 text-[13px] font-black text-blue-600">{row.bmi || '-'}</td>
                       <td className="px-6 py-6 text-[13px] font-black text-slate-800">{row.temperature}°F</td>
                       <td className="px-6 py-6 text-[13px] font-black text-slate-800">{row.pulse}</td>
                       <td className="px-6 py-6 text-[13px] font-black text-slate-800">{row.bloodPressure}</td>
                       <td className="px-8 py-6 text-right">
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black">
                             {row.spo2}%
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
};

const VitalsEntryView = () => {
  return (
    <NursingLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <VitalsEntryContent />
      </Suspense>
    </NursingLayout>
  );
};

export default VitalsEntryView;

