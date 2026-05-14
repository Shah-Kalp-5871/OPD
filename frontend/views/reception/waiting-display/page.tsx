'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  BellRing, 
  UserCheck, 
  Clock, 
  Volume2, 
  Activity,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const WaitingDisplay = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [currentCalling, setCurrentCalling] = useState<any>(null);
  const [lastCalled, setLastCalled] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Fast polling for display board
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await api.get('/queue/live');
      const data = response.data;
      
      // Find who is currently being called
      const calling = data.find((p: any) => p.status === 'CALLING');
      
      if (calling && (!currentCalling || currentCalling.id !== calling.id)) {
        // New patient being called!
        playNotification();
        speakPatient(calling);
      }
      
      setCurrentCalling(calling);
      
      // Get last 5 completed or in-session patients
      const processed = data
        .filter((p: any) => p.status === 'IN_SESSION' || p.status === 'COMPLETED')
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);
      
      setLastCalled(processed);
      
      // Get next 8 waiting patients
      const waiting = data
        .filter((p: any) => p.status === 'WAITING')
        .slice(0, 8);
        
      setQueue(waiting);
    } catch (error) {
      console.error('Failed to fetch display data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const playNotification = () => {
    const audio = new Audio('/sounds/ding.mp3');
    audio.play().catch(e => console.log('Audio playback blocked'));
  };

  const speakPatient = (patient: any) => {
    if ('speechSynthesis' in window) {
      const text = `Token number ${patient.tokenDisplay.split('-')[1]}, ${patient.patient.firstName} ${patient.patient.lastName}, please proceed to room ${patient.doctor?.roomNumber || 'one'}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col font-sans">
      
      {/* Top Banner */}
      <div className="h-24 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-12 shadow-2xl z-20">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-900/50">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">OPD Live Queue Display</h1>
            <p className="text-xs font-bold text-teal-500 uppercase tracking-[0.3em]">MedFlow Digital Health Systems</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-4xl font-black leading-none tabular-nums">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              {new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-6 h-6 text-emerald-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Board</span>
          </div>
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Current Calling (Huge) */}
        <div className="flex-[1.5] border-r border-slate-900 bg-slate-950/50 relative flex flex-col items-center justify-center p-20">
           {currentCalling ? (
             <div className="w-full space-y-12 animate-in fade-in zoom-in duration-700">
                <div className="flex flex-col items-center text-center space-y-4">
                   <div className="inline-flex items-center gap-3 px-6 py-2 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 mb-4 animate-bounce">
                      <BellRing className="w-5 h-5" />
                      <span className="text-sm font-black uppercase tracking-[0.3em]">Now Calling</span>
                   </div>
                   <h2 className="text-[14rem] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_50px_rgba(20,184,166,0.3)]">
                      {currentCalling.tokenDisplay.split('-')[1]}
                   </h2>
                   <div className="px-10 py-3 bg-teal-600 text-white rounded-3xl inline-block transform -rotate-1 shadow-2xl">
                      <span className="text-3xl font-black uppercase tracking-[0.1em]">{currentCalling.tokenDisplay.split('-')[0]} SERIES</span>
                   </div>
                </div>

                <div className="bg-slate-900/50 rounded-[4rem] p-12 border border-slate-800 text-center space-y-4 backdrop-blur-xl">
                   <p className="text-xl font-bold text-slate-500 uppercase tracking-[0.5em]">Patient Name</p>
                   <h3 className="text-7xl font-black uppercase tracking-tight text-teal-400">
                      {currentCalling.patient.firstName} {currentCalling.patient.lastName}
                   </h3>
                </div>

                <div className="flex items-center justify-center gap-10">
                   <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Proceed To</span>
                      <div className="px-12 py-6 bg-white text-slate-950 rounded-3xl shadow-2xl shadow-white/10">
                         <span className="text-6xl font-black">ROOM {currentCalling.doctor?.roomNumber || '01'}</span>
                      </div>
                   </div>
                   <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                      <ArrowRight className="w-8 h-8 text-white" />
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Consultant</span>
                      <div className="px-12 py-6 bg-slate-800 border border-slate-700 rounded-3xl">
                         <span className="text-4xl font-black text-white">DR. {currentCalling.doctor?.name.toUpperCase() || 'GENERAL'}</span>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center text-center space-y-8 opacity-20">
                <div className="w-40 h-40 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-800 animate-pulse">
                   <Volume2 className="w-20 h-20 text-slate-700" />
                </div>
                <div>
                   <h2 className="text-4xl font-black uppercase tracking-[0.2em]">Next Patient Coming</h2>
                   <p className="text-xl font-bold text-slate-600 mt-2 uppercase tracking-[0.5em]">Please wait for notification</p>
                </div>
             </div>
           )}
        </div>

        {/* Right Side: Processed & Next Queue */}
        <div className="flex-1 bg-slate-900/30 flex flex-col">
           
           {/* Last Called / In-Session */}
           <div className="p-10 border-b border-slate-900">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
                 <h4 className="text-xl font-black uppercase tracking-widest text-slate-400">Consulting Now</h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {lastCalled.length > 0 ? lastCalled.map((p, i) => (
                   <div key={p.id} className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl flex items-center justify-between group hover:border-teal-500/30 transition-all">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-white text-slate-950 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl font-black">{p.tokenDisplay.split('-')[1]}</span>
                         </div>
                         <div>
                            <p className="text-lg font-black text-white group-hover:text-teal-400 transition-colors uppercase leading-tight">{p.patient.firstName} {p.patient.lastName}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">DR. {p.doctor?.name || 'GENERAL'}</p>
                         </div>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            {p.status === 'IN_SESSION' ? 'IN ROOM' : 'COMPLETED'}
                         </span>
                      </div>
                   </div>
                 )) : (
                   <div className="py-10 text-center border-2 border-dashed border-slate-800 rounded-3xl opacity-30">
                      <span className="text-sm font-bold uppercase tracking-widest">No active sessions</span>
                   </div>
                 )}
              </div>
           </div>

           {/* Next in Line */}
           <div className="flex-1 p-10 overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                 <h4 className="text-xl font-black uppercase tracking-widest text-slate-400">Next In Line</h4>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
                 {queue.length > 0 ? queue.map((p, i) => (
                   <div key={p.id} className="flex items-center justify-between p-5 bg-slate-950/30 border border-slate-900 rounded-2xl opacity-60 hover:opacity-100 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center">
                            <span className="text-lg font-black">{p.tokenDisplay.split('-')[1]}</span>
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-300 uppercase leading-none">{p.patient.firstName} {p.patient.lastName}</p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Waiting List #{i+1}</p>
                         </div>
                      </div>
                      <Clock className="w-4 h-4 text-slate-700" />
                   </div>
                 )) : (
                   <div className="py-20 text-center opacity-20">
                      <span className="text-sm font-bold uppercase tracking-widest">Queue is clear</span>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </main>

      {/* Scrolling News Ticker / Footer */}
      <div className="h-16 bg-teal-600 flex items-center overflow-hidden whitespace-nowrap relative">
         <div className="absolute left-0 inset-y-0 w-40 bg-teal-600 z-10 flex items-center px-8 border-r border-teal-500 shadow-2xl">
            <span className="text-xs font-black text-white uppercase tracking-widest">Information</span>
         </div>
         <div className="animate-marquee flex gap-20 items-center">
            <span className="text-sm font-black text-teal-50 uppercase tracking-widest">WELCOME TO MEDFLOW CLINIC • PLEASE KEEP YOUR TOKEN READY • FOR EMERGENCIES CONTACT RECEPTION DESK IMMEDIATELY • DR. SHAH IS CURRENTLY IN SURGERY • DR. KHAN WILL BE AVAILABLE FROM 2:00 PM • WASH YOUR HANDS REGULARLY • WEAR A MASK FOR SAFETY • FEEDBACK IS VALUED</span>
            <span className="text-sm font-black text-teal-50 uppercase tracking-widest">WELCOME TO MEDFLOW CLINIC • PLEASE KEEP YOUR TOKEN READY • FOR EMERGENCIES CONTACT RECEPTION DESK IMMEDIATELY • DR. SHAH IS CURRENTLY IN SURGERY • DR. KHAN WILL BE AVAILABLE FROM 2:00 PM • WASH YOUR HANDS REGULARLY • WEAR A MASK FOR SAFETY • FEEDBACK IS VALUED</span>
         </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default WaitingDisplay;
