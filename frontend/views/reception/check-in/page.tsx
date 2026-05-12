'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  Search, 
  User, 
  Clock, 
  Activity, 
  Thermometer, 
  Heart, 
  ActivitySquare, 
  Scale, 
  Ruler, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Calendar,
  PhoneOff,
  UserX,
  RefreshCcw,
  Info
} from 'lucide-react';

const CheckInView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patientFound, setPatientFound] = useState(false);
  const [vitals, setVitals] = useState({
    height: '',
    weight: '',
    bmi: '0.0',
    temp: '',
    pulse: '',
    bp: '',
    spo2: ''
  });
  const [noShowOption, setNoShowOption] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [note, setNote] = useState('');

  // Update note automatically when 'no-answer' is selected
  useEffect(() => {
    if (noShowOption === 'no-answer') {
      setNote('F/U Missed – Not Answered');
    }
  }, [noShowOption]);

  // Auto-calculate BMI
  useEffect(() => {
    if (vitals.height && vitals.weight) {
      const heightInMeters = parseFloat(vitals.height) / 100;
      const weightInKg = parseFloat(vitals.weight);
      if (heightInMeters > 0) {
        const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setVitals(prev => ({ ...prev, bmi: bmiValue }));
      }
    }
  }, [vitals.height, vitals.weight]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setPatientFound(true);
    }
  };

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Header */}
        <div>
           <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Patient Check-In</h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-teal-500" />
              Live OPD Arrival Management System
           </p>
        </div>

        {/* 🔷 SECTION 1: PATIENT SEARCH */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
           <div className="flex gap-4">
              <div className="relative flex-1 group">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                 <input 
                   type="text" 
                   className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all shadow-inner"
                   placeholder="Search arriving patient by Name or Mobile Number"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                 />
              </div>
              <button 
                onClick={handleSearch}
                className="px-12 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-slate-200"
              >
                 Search
              </button>
           </div>
        </div>

        {patientFound && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 🔷 SECTION 2: APPOINTMENT DETAILS CARD */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                     <User className="w-4 h-4 text-slate-400" />
                     Patient Found — Appointment Details
                  </h3>
                  <div className="bg-amber-100/50 text-amber-700 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                     <Info className="w-3.5 h-3.5" />
                     Check-in auto-stamps date+time. Status changes to In-Progress.
                  </div>
               </div>
               
               <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-10">
                     <div className="flex-1 space-y-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                              <User className="w-16 h-16" />
                           </div>
                           <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">MAHESH K. KUMAR</h2>
                           <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                              <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> MRD: P03-260003</span>
                              <span className="w-px h-3 bg-slate-200"></span>
                              <span>45Y | Male</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Case ID</p>
                              <p className="text-xs font-black text-slate-800 tracking-widest">C003-001-130426</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Appointment</p>
                              <p className="text-xs font-black text-teal-600">09:20 AM</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Doctor</p>
                              <p className="text-xs font-black text-slate-800">Dr. Valaki</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Purpose</p>
                              <p className="text-xs font-black text-slate-800">New Consultation</p>
                           </div>
                        </div>
                     </div>

                     <div className="md:w-64 space-y-4">
                        <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl">
                           <p className="text-[9px] font-black text-teal-600 uppercase tracking-widest mb-2">Billing Context</p>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</span>
                              <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">PAYMENT</span>
                           </div>
                           <div className="flex justify-between items-center mt-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">PENDING</span>
                           </div>
                        </div>
                        
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl relative group">
                           <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <AlertCircle className="w-3 h-3" /> Special Note
                           </p>
                           <p className="text-[10px] font-bold text-slate-600 leading-relaxed italic">
                              "No special notes found."
                           </p>
                           <div className="absolute -top-10 right-0 bg-slate-900 text-white text-[8px] font-black px-3 py-1.5 rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                              'No Answer' auto-creates 'F/U Missed' note
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 🔷 SECTION 3: VITALS ENTRY */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                  <ActivitySquare className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Vitals Entry (Nursing/Reception enter before Doctor)</h3>
               </div>
               <div className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Ruler className="w-3 h-3" /> Height (cm)</label>
                        <input 
                          type="number" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-teal-600 focus:bg-white transition-all" 
                          placeholder="000"
                          value={vitals.height}
                          onChange={(e) => setVitals(prev => ({ ...prev, height: e.target.value }))}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Scale className="w-3 h-3" /> Weight (kg)</label>
                        <input 
                          type="number" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-teal-600 focus:bg-white transition-all" 
                          placeholder="00.0"
                          value={vitals.weight}
                          onChange={(e) => setVitals(prev => ({ ...prev, weight: e.target.value }))}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2">BMI (Auto)</label>
                        <div className="w-full px-4 py-3 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl text-sm font-black text-center">
                           {vitals.bmi}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Thermometer className="w-3 h-3" /> Temp (°F)</label>
                        <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-teal-600" placeholder="98.6" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Heart className="w-3 h-3" /> Pulse (bpm)</label>
                        <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-teal-600" placeholder="72" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">BP (mmHg)</label>
                        <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-teal-600" placeholder="120/80" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">SpO2 (%)</label>
                        <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-teal-600" placeholder="98" />
                     </div>
                  </div>
               </div>
            </div>

            {/* 🔷 MAIN ACTION BUTTON */}
            <div className="flex flex-col items-center gap-4 py-6">
               <button className="px-16 py-5 bg-teal-600 text-white rounded-3xl text-sm font-black uppercase tracking-[0.2em] hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  Confirm Check-In
               </button>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-teal-500" />
                  Check-in time auto-stamped. Status → In-Progress. Patient name starts blinking on Doctor panel & Waiting Display Screen.
               </p>
            </div>

            {/* 🔷 SECTION 4: MISSED / NO-SHOW MANAGEMENT */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                  <UserX className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Missed / No-Show Management</h3>
               </div>
               <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <button 
                       onClick={() => setNoShowOption('rescheduled')}
                       className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${noShowOption === 'rescheduled' ? 'bg-teal-50 border-teal-500 shadow-md' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                     >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${noShowOption === 'rescheduled' ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                           <RefreshCcw className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Called</p>
                           <p className="text-xs font-bold text-slate-600">Rescheduled (enter new date)</p>
                        </div>
                     </button>

                     <button 
                       onClick={() => setNoShowOption('no-answer')}
                       className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${noShowOption === 'no-answer' ? 'bg-rose-50 border-rose-500 shadow-md' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                     >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${noShowOption === 'no-answer' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                           <PhoneOff className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Called</p>
                           <p className="text-xs font-bold text-slate-600">No Answer (auto F/U Missed note)</p>
                        </div>
                     </button>

                     <button 
                       onClick={() => setNoShowOption('not-called')}
                       className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${noShowOption === 'not-called' ? 'bg-slate-900 border-slate-900 shadow-md' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                     >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${noShowOption === 'not-called' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
                           <UserX className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Status</p>
                           <p className={`text-xs font-bold ${noShowOption === 'not-called' ? 'text-white' : 'text-slate-600'}`}>Not Called</p>
                        </div>
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {noShowOption === 'rescheduled' && (
                       <div className="space-y-2 animate-in slide-in-from-left-4 duration-300">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-teal-500" /> New Follow-Up Date</label>
                          <input 
                            type="date" 
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-teal-600 focus:bg-white transition-all" 
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                          />
                       </div>
                     )}
                     <div className={`space-y-2 transition-all duration-300 ${noShowOption === 'rescheduled' ? 'md:col-span-1' : 'md:col-span-2'}`}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-teal-500" /> Note</label>
                        <textarea 
                          rows={2} 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all resize-none" 
                          placeholder="Add any specific details regarding no-show or rescheduling..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          readOnly={noShowOption === 'no-answer'}
                        ></textarea>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        )}
      </div>
    </ReceptionLayout>
  );
};

export default CheckInView;
