'use client';

import React, { useState } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  Search, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Activity, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  Edit3, 
  PlusCircle, 
  ClipboardList, 
  Droplet,
  Globe,
  MoreVertical,
  ExternalLink,
  Lock,
  Eye,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const PatientSearchView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockSearchResults = [
    { 
      mrd: 'P03-260001', 
      name: 'Rameshbhai M. Patel', 
      age: 35, 
      gender: 'Male', 
      address: '12, Sardar Nagar, Surat',
      blood: 'B+',
      language: 'Gujarati',
      allergies: 'None',
      lastVisit: '01/04/2026',
      totalVisits: 8
    },
    { 
      mrd: 'P03-260008', 
      name: 'Ramesh A. Patel', 
      age: 42, 
      gender: 'Male', 
      address: '45, Vesu, Surat',
      blood: 'O+',
      language: 'Hindi',
      allergies: 'Aspirin',
      lastVisit: '15/03/2026',
      totalVisits: 3
    }
  ];

  const visitHistory = [
    { id: 'C008-008-010426', date: '01/04/2026', purpose: 'Follow-Up', doctor: 'Dr. Valaki', billing: 450, status: 'Open' },
    { id: 'C005-007-150326', date: '15/03/2026', purpose: 'Consultation', doctor: 'Dr. Valaki', billing: 500, status: 'Closed' }
  ];

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* 🔷 SECTION 1: PATIENT SEARCH BAR */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Patient Search</h1>
          
          <div className="relative group max-w-4xl">
            <div className="flex gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                  <input 
                    type="text" 
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all shadow-inner"
                    placeholder="Search by Name / Mobile Number / MRD No. — autocomplete suggestions appear below"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                  />
                  
                  {/* Autocomplete Simulation */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl z-20 overflow-hidden divide-y divide-slate-50">
                       {mockSearchResults.map(p => (
                         <div 
                           key={p.mrd} 
                           className="p-4 hover:bg-teal-50 cursor-pointer flex items-center justify-between transition-colors group/item"
                           onClick={() => {
                             setSelectedPatient(p);
                             setShowSuggestions(false);
                           }}
                         >
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-black text-xs">
                                  {p.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{p.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 tracking-widest">{p.mrd}</p>
                               </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover/item:text-teal-500" />
                         </div>
                       ))}
                    </div>
                  )}
               </div>
               <button className="px-10 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-slate-200">
                  Search
               </button>
            </div>
          </div>
        </div>

        {/* 🔷 SECTION 2: SEARCH RESULTS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <UsersIcon className="w-5 h-5 text-slate-400" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Search Results (Mobile numbers hidden in list)</h3>
             </div>
             <div className="bg-amber-100/50 text-amber-700 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Mobile number only visible inside open patient record.
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">MRD No.</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Name</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Age</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Gender</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockSearchResults.map(p => (
                  <tr 
                    key={p.mrd} 
                    className={`hover:bg-slate-50 cursor-pointer transition-colors group ${selectedPatient?.mrd === p.mrd ? 'bg-teal-50/50' : ''}`}
                    onClick={() => setSelectedPatient(p)}
                  >
                    <td className="px-8 py-5 text-xs font-black text-teal-700 tracking-widest">{p.mrd}</td>
                    <td className="px-8 py-5 text-xs font-black text-slate-800 uppercase tracking-tight">{p.name}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500 text-center">{p.age}</td>
                    <td className="px-8 py-5 text-center">
                       <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase tracking-widest">{p.gender}</span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-400 max-w-xs truncate">{p.address}</td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-teal-600">
                          <Eye className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🔷 SECTION 3: PATIENT PROFILE VIEW (DETAIL PANEL) */}
        {selectedPatient && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl border-2 border-teal-600 shadow-xl overflow-hidden">
               <div className="p-8 bg-teal-600 text-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                           <User className="w-10 h-10 text-white" />
                        </div>
                        <div>
                           <h2 className="text-3xl font-black uppercase tracking-tight leading-none">{selectedPatient.name}</h2>
                           <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-teal-50/80 text-[11px] font-black uppercase tracking-widest">
                              <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> MRD: {selectedPatient.mrd}</span>
                              <span className="w-px h-3 bg-white/20 hidden md:block"></span>
                              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {selectedPatient.age} Yrs | {selectedPatient.gender}</span>
                              <span className="w-px h-3 bg-white/20 hidden md:block"></span>
                              <span className="flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5" /> Blood Group: {selectedPatient.blood}</span>
                              <span className="w-px h-3 bg-white/20 hidden md:block"></span>
                              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Language: {selectedPatient.language}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-6 px-8 py-4 bg-black/10 rounded-2xl backdrop-blur-md border border-white/10">
                        <div className="text-center">
                           <p className="text-[9px] font-black text-teal-100 uppercase tracking-[0.2em] mb-1 opacity-70">Total Visits</p>
                           <p className="text-xl font-black leading-none">{selectedPatient.totalVisits}</p>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center">
                           <p className="text-[9px] font-black text-teal-100 uppercase tracking-[0.2em] mb-1 opacity-70">Last Visit</p>
                           <p className="text-xl font-black leading-none">{selectedPatient.lastVisit}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-white/10">
                     <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-300" />
                        <span className="text-xs font-black uppercase tracking-widest">Allergies: <span className="text-rose-100 ml-2">{selectedPatient.allergies}</span></span>
                     </div>
                     <div className="flex items-center justify-end gap-3 text-emerald-300">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest text-white">Record Verified</span>
                     </div>
                  </div>
               </div>

               {/* 🔷 SECTION 4: QUICK ACTION BUTTONS */}
               <div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-slate-50">
                  <button className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-300 hover:shadow-lg transition-all group">
                     <PlusCircle className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" />
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Book Appt</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-300 hover:shadow-lg transition-all group">
                     <CheckCircle2 className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" />
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Check-In</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-300 hover:shadow-lg transition-all group">
                     <FileText className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" />
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Lab Report</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-300 hover:shadow-lg transition-all group">
                     <ClipboardList className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" />
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Consent</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-300 hover:shadow-lg transition-all group">
                     <History className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" />
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">History</span>
                  </button>
                  <div className="relative group/edit">
                     <button className="w-full flex flex-col items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl hover:border-amber-300 hover:shadow-lg transition-all group">
                        <Edit3 className="w-6 h-6 text-slate-400 group-hover:text-amber-600 transition-colors" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Edit Profile</span>
                     </button>
                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest opacity-0 group-hover/edit:opacity-100 transition-all pointer-events-none whitespace-nowrap z-30">
                        Requires OTP Verification
                     </div>
                  </div>
               </div>
            </div>

            {/* 🔷 SECTION 5: VISIT HISTORY TABLE */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <History className="w-5 h-5 text-slate-400" />
                     <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Visit History</h3>
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case ID</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Purpose</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Rx</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Billing</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {visitHistory.map(v => (
                           <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                              <td className="px-8 py-5 text-xs font-bold text-slate-500 tracking-tight">{v.id}</td>
                              <td className="px-8 py-5 text-xs font-black text-slate-800">{v.date}</td>
                              <td className="px-8 py-5">
                                 <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[9px] font-black uppercase tracking-widest">{v.purpose}</span>
                              </td>
                              <td className="px-8 py-5 text-xs font-black text-slate-800">{v.doctor}</td>
                              <td className="px-8 py-5 text-center">
                                 <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all">View Rx</button>
                              </td>
                              <td className="px-8 py-5 text-right font-mono text-sm font-black text-slate-800">₹{v.billing}</td>
                              <td className="px-8 py-5 text-right">
                                 <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
                                    [Open]
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}
      </div>
    </ReceptionLayout>
  );
};

// Custom Icons
const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Hash = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

export default PatientSearchView;
