'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Stethoscope, 
  BellRing, 
  Timer,
  Volume2,
  ArrowRight,
  Clock,
  Languages
} from 'lucide-react';

const WaitingScreenView = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeLanguage, setActiveLanguage] = useState<'EN' | 'GJ' | 'HI'>('EN');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const langTimer = setInterval(() => {
      setActiveLanguage(prev => {
        if (prev === 'EN') return 'GJ';
        if (prev === 'GJ') return 'HI';
        return 'EN';
      });
    }, 5000); // Rotate language every 5 seconds
    
    return () => {
      clearInterval(timer);
      clearInterval(langTimer);
    };
  }, []);

  const queueData = [
    { token: '01', name: { EN: 'Rameshbhai M. Patel', GJ: 'રમેશભાઈ એમ. પટેલ', HI: 'रमेशभाई एम. पटेल' }, doctor: 'Dr. Valaki', status: 'In Progress', room: 'Room 01', caseNo: 'C001-001-130326' },
    { token: '02', name: { EN: 'Sneha R. Shah', GJ: 'સ્નેહા આર. શાહ', HI: 'સ્નેહા આર. શાહ' }, doctor: 'Dr. Valaki', status: 'Waiting', room: 'Waiting Area', caseNo: 'C002-001-130326' },
    { token: '03', name: { EN: 'Mahesh K. Kumar', GJ: 'મહેશ કે. કુમાર', HI: 'મહેશ કે. કુમાર' }, doctor: 'Dr. Valaki', status: 'Next', room: 'Waiting Area', caseNo: 'C003-001-130326' },
    { token: '04', name: { EN: 'Priya N. Desai', GJ: 'પ્રિયા એન. દેસાઈ', HI: 'પ્રિયા એન. દેસાઈ' }, doctor: 'Dr. Valaki', status: 'Waiting', room: 'Waiting Area', caseNo: 'C004-001-130326' },
    { token: '05', name: { EN: 'Kishore P. Joshi', GJ: 'કિશોર પી. જોશી', HI: 'કિશોર પી. જોશી' }, doctor: 'Dr. Valaki', status: 'Waiting', room: 'Waiting Area', caseNo: 'C005-001-130326' },
  ];

  const currentPatient = queueData[0];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 font-sans overflow-hidden flex flex-col gap-6">
      
      {/* 🔷 TOP HEADER BAR */}
      <div className="flex items-center justify-between bg-slate-900/40 p-5 rounded-[2rem] border border-slate-800/50 backdrop-blur-md">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
              MEDFLOW CLINIC
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 font-black uppercase tracking-widest">Live Queue</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[9px]">Hospital Management System Display</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <h2 className="text-3xl font-black tracking-tighter text-blue-50 flex items-center justify-end gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              {currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6">
        
        {/* 🔷 LEFT PANEL: NOW CONSULTING (DOMINANT) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-gradient-to-b from-blue-600 to-blue-700 rounded-[3rem] p-10 flex flex-col items-center justify-between text-center shadow-2xl border-4 border-blue-400/30 relative overflow-hidden">
            {/* Background Calligraphy/Icons */}
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
              <BellRing className="w-96 h-96 text-white" />
            </div>
            
            <div className="w-full flex justify-between items-start relative z-10">
              <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-blue-50 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                Now Consulting
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/10">
                <Languages className="w-3.5 h-3.5 text-blue-200" />
                <span className="text-[10px] font-black tracking-widest">{activeLanguage === 'EN' ? 'ENGLISH' : activeLanguage === 'GJ' ? 'GUJARATI' : 'HINDI'}</span>
              </div>
            </div>

            <div className="relative z-10 space-y-8 py-10">
              <div className="space-y-2">
                <p className="text-blue-200 font-black uppercase tracking-[0.5em] text-xs">Patient Name</p>
                <h3 className="text-8xl font-black tracking-tighter text-white uppercase drop-shadow-2xl patient-name-blinking min-h-[120px] flex items-center justify-center">
                  {currentPatient.name[activeLanguage as keyof typeof currentPatient.name]}
                </h3>
              </div>

              <div className="flex items-center justify-center gap-8">
                <div className="bg-white/10 px-10 py-6 rounded-[2rem] border border-white/20 backdrop-blur-sm min-w-[180px]">
                  <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.3em] mb-2">Token No.</p>
                  <p className="text-6xl font-black leading-none">{currentPatient.token}</p>
                </div>
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-xl">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
                <div className="bg-white px-10 py-6 rounded-[2rem] shadow-2xl min-w-[180px]">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Room No.</p>
                  <p className="text-6xl font-black text-slate-900 leading-none">{currentPatient.room.split(' ')[1]}</p>
                </div>
              </div>
            </div>

            <div className="w-full bg-black/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex items-center justify-center gap-8 relative z-10">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-blue-200" />
                 </div>
                 <div className="text-left">
                    <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Consulting Doctor</p>
                    <p className="text-lg font-black text-white uppercase tracking-tight">{currentPatient.doctor}</p>
                 </div>
               </div>
               <div className="h-10 w-[1px] bg-white/10"></div>
               <div className="text-left">
                  <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Case ID</p>
                  <p className="text-lg font-black text-blue-50 tracking-widest">{currentPatient.caseNo}</p>
               </div>
            </div>
          </div>

          {/* 🔷 TICKER / INFO AREA */}
          <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800/50 flex items-center gap-6 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-500"></div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
               <Timer className="w-6 h-6" />
            </div>
            <div className="flex-1 whitespace-nowrap overflow-hidden">
               <div className="animate-marquee inline-block">
                 <p className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-10">
                   <span>Please keep your token number ready for consultation</span>
                   <span className="w-2 h-2 bg-slate-700 rounded-full"></span>
                   <span>Approximate wait time for Token 04 is 20 minutes</span>
                   <span className="w-2 h-2 bg-slate-700 rounded-full"></span>
                   <span>Emergency cases may be prioritized by the medical staff</span>
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* 🔷 RIGHT PANEL: QUEUE LIST */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900/20 rounded-[3rem] border border-slate-800/50 p-8 flex flex-col gap-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
             <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-black tracking-tight uppercase">Waiting List</h2>
             </div>
             <div className="px-4 py-1.5 bg-blue-500/10 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest border border-blue-500/20">
                {queueData.length} Patients
             </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
             {queueData.slice(1).map((patient, idx) => (
               <div 
                 key={idx} 
                 className={`p-6 rounded-[2rem] border transition-all ${
                   patient.status === 'Next' 
                   ? 'bg-amber-500 border-amber-400 shadow-xl shadow-amber-900/20 scale-[1.02]' 
                   : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                 }`}
               >
                 <div className="flex justify-between items-start mb-4">
                    <span className={`text-4xl font-black tracking-tighter ${patient.status === 'Next' ? 'text-slate-900' : 'text-slate-500'}`}>
                       {patient.token}
                    </span>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      patient.status === 'Next' ? 'bg-slate-900 text-amber-500 animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}>
                       {patient.status}
                    </div>
                 </div>
                 <div>
                    <h4 className={`text-xl font-black uppercase tracking-tight truncate ${
                      patient.status === 'Next' ? 'text-slate-900' : 'text-slate-100'
                    }`}>
                       {patient.name[activeLanguage as keyof typeof patient.name]}
                    </h4>
                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${
                      patient.status === 'Next' ? 'text-slate-800/70' : 'text-slate-500'
                    }`}>
                       Dr. Rahul Valaki
                    </p>
                 </div>
               </div>
             ))}
          </div>

          <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-500/20 flex flex-col items-center gap-2 text-center">
             <Volume2 className="w-5 h-5 text-blue-400" />
             <p className="text-[10px] font-bold text-blue-300 leading-relaxed uppercase tracking-wider">
                Audio announcement will be made when it is your turn.
             </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes patient-blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.98); }
        }
        .patient-name-blinking {
          animation: patient-blink 2s infinite ease-in-out;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default WaitingScreenView;
