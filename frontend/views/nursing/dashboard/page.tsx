'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NursingLayout from '@/views/layouts/NursingLayout';
import { 
  Users, 
  Activity, 
  PhoneCall, 
  Upload, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileUp, 
  Search, 
  Filter, 
  MoreHorizontal,
  Plus,
  PlusCircle,
  ArrowRight,
  PhoneForwarded,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { useQueueSSE } from '@/hooks/useQueueSSE';
import api from '@/lib/api';
import Link from 'next/link';

const NursingDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const { entries: liveQueue, stats: liveStats } = useQueueSSE();
  
  const [todayPatients, setTodayPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const summaryCards = [
    { label: "Today's Patients", value: liveStats?.total || '0', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: "Vitals Pending", value: liveQueue.filter(e => e.case?.stage === 'NURSING').length.toString(), icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: "Reports to Upload", value: '0', icon: FileUp, color: 'text-emerald-600', bg: 'bg-emerald-50' }
  ];

  useEffect(() => {
    const mapped = liveQueue.map(entry => ({
      id: entry.case?.caseNumber || 'N/A',
      caseId: entry.caseId,
      mrdNumber: entry.patient?.mrdNumber,
      name: `${entry.patient?.firstName} ${entry.patient?.lastName}`,
      time: new Date(entry.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vitals: entry.case?.stage === 'NURSING' ? 'Pending' : 'Entered',
      fu: '—',
      status: entry.status,
      type: entry.case?.visitType || 'Consultation'
    }));
    setTodayPatients(mapped);
  }, [liveQueue]);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await api.get(`/patients/search?query=${encodeURIComponent(searchTerm)}&limit=5`);
          setSearchResults(res.data?.items || res.data || []);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePatientSelect = (patient: any) => {
    setSearchResults([]);
    setSearchTerm('');
    router.push(`/nursing/patients/${patient.id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Entered':
      case 'Completed': 
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending': 
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'In Progress': 
        return 'bg-green-50 text-green-600 border-green-100';
      case 'Waiting': 
        return 'bg-slate-50 text-slate-500 border-slate-200';
      case 'High Alert':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default: 
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <NursingLayout>
      <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500">
        
        {/* 🔷 TOP SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           {summaryCards.map((card, idx) => (
             <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm group hover:shadow-md hover:border-green-200 transition-all cursor-default">
                <div className="flex items-center justify-between mb-6">
                   <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <card.icon className="w-6 h-6" />
                   </div>
                   <div className="flex items-center gap-1 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      Live <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   </div>
                </div>
                <div className="space-y-1">
                   <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{card.value}</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{card.label}</p>
                </div>
             </div>
           ))}
        </div>

        {/* 🔷 TODAY'S PATIENT LIST SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                 <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
                       <Users className="w-4 h-4" />
                    </div>
                    Today's Patient List (Nursing View)
                 </h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-1">Live Coordination with Doctor Workflow</p>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="relative group z-50" ref={searchContainerRef}>
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search Patient / Case ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-green-600 focus:bg-white transition-all w-72 shadow-inner"
                    />
                    
                    {/* SEARCH RESULTS DROPDOWN */}
                    {(searchResults.length > 0 || isSearching) && (
                      <div className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        {isSearching ? (
                          <div className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            <span className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
                            Searching...
                          </div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto">
                            {searchResults.map((p, idx) => (
                              <button
                                key={idx}
                                onClick={() => handlePatientSelect(p)}
                                className="w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex flex-col"
                              >
                                <span className="text-[11px] font-black text-slate-800">{p.firstName} {p.lastName}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                  MRD: {p.mrdNumber} {p.phone && `• ${p.phone}`}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                 </div>
                 <button className="p-3.5 bg-slate-50 border border-slate-200 text-slate-400 rounded-2xl hover:bg-white hover:text-green-600 transition-all shadow-inner">
                    <Filter className="w-5 h-5" />
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case ID</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vitals</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {todayPatients.map((patient, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                         <td className="px-8 py-6">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{patient.id}</span>
                         </td>
                         <td className="px-6 py-6">
                            <div className="flex flex-col">
                               <span className="text-[13px] font-black text-slate-800 tracking-tight">{patient.name}</span>
                               <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{patient.type}</span>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                               <Clock className="w-3.5 h-3.5 text-slate-300" />
                               <span className="text-[11px] font-black text-slate-600">{patient.time}</span>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(patient.vitals)}`}>
                               {patient.vitals}
                            </span>
                         </td>
                         <td className="px-6 py-6">
                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(patient.status)}`}>
                               {patient.status}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                               {patient.vitals === 'Pending' || patient.vitals === 'Waiting' ? (
                                 <Link 
                                   href={`/nursing/vitals?mrd=${patient.mrdNumber}&caseId=${patient.caseId}`}
                                   className="px-4 py-2 bg-green-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md shadow-green-100 flex items-center gap-2"
                                 >
                                    <Activity className="w-3.5 h-3.5" />
                                    Enter Vitals
                                 </Link>
                               ) : (
                                 <Link 
                                   href={`/nursing/lab-reports?caseId=${patient.caseId}`}
                                   className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all flex items-center gap-2"
                                 >
                                    <FileUp className="w-3.5 h-3.5" />
                                    Upload
                                 </Link>
                               )}
                               <button className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-green-400 transition-all group/btn">
                                  <MoreHorizontal className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions / Stats Panel */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                          <Activity className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">Coordination Hub</h3>
                          <p className="text-xl font-black tracking-tight">Active Shift Statistics</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vitals Done</p>
                          <p className="text-2xl font-black text-emerald-400">26</p>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reports Up</p>
                          <p className="text-2xl font-black text-green-400">12</p>
                       </div>
                    </div>

                    <button className="w-full py-5 bg-white text-slate-900 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-green-400 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 group/btn">
                       <PlusCircle className="w-4 h-4" />
                       Add Direct Note
                    </button>
                 </div>
                 <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <CheckCircle2 className="w-40 h-40" />
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Next Doctor Appointment</h3>
                 <div className="flex items-center gap-4 p-5 bg-green-50 border border-green-100 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-white border border-green-200 flex items-center justify-center text-green-600">
                       <Clock className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-[13px] font-black text-slate-800 tracking-tight">11:30 AM</p>
                       <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-0.5">Procedure Prep Due</p>
                    </div>
                    <div className="flex-1 flex justify-end">
                       <ArrowRight className="w-5 h-5 text-green-400" />
                    </div>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </NursingLayout>
  );
};

export default NursingDashboard;
