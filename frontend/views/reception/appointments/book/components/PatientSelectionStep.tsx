'use client';

import React from 'react';
import { 
  Search, 
  User, 
  Users, 
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PatientSelectionStepProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  recentPatients: any[];
  isRecentLoading: boolean;
  isSearching: boolean;
  handleSearch: () => void;
  setSelectedPatient: (patient: any) => void;
  onNextStep: () => void;
}

export const PatientSelectionStep: React.FC<PatientSelectionStepProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  recentPatients,
  isRecentLoading,
  isSearching,
  handleSearch,
  setSelectedPatient,
  onNextStep
}) => {
  const router = useRouter();

  // Local filter for quick search
  const filteredRecentPatients = searchQuery.trim() === ''
    ? recentPatients
    : recentPatients.filter(p => 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mrdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mobile.includes(searchQuery)
      );

  const displayList = searchResults.length > 0 ? searchResults : filteredRecentPatients;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* 🔷 Search & Quick Registration Controls */}
      <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
          <input 
            type="text" 
            className="w-full pl-16 pr-6 py-4.5 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] font-black outline-none focus:border-teal-600 transition-all uppercase placeholder:text-slate-300 shadow-sm"
            placeholder="Type MRD, Name or Mobile to instantly filter bottom list, or press Enter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="px-8 bg-slate-900 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm"
          >
            {isSearching ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
            Search Registry
          </button>
          
          <button 
            onClick={() => router.push('/reception/patients/register')}
            className="px-6 bg-teal-550 border-2 border-teal-600 text-teal-700 hover:bg-teal-50 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            New Register
          </button>
        </div>
      </div>

      {/* 🔷 Patient Cards Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            {searchResults.length > 0 ? 'Search Results' : searchQuery.trim() !== '' ? 'Matching Directory Patients' : 'Quick Access Patient Directory'}
          </h4>
          <span className="text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
            {searchResults.length > 0 ? `${searchResults.length} found` : `${filteredRecentPatients.length} active`}
          </span>
        </div>

        {isRecentLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 animate-pulse h-[90px]"></div>
            ))}
          </div>
        ) : displayList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayList.map(p => (
              <div 
                key={p.id}
                onClick={() => {
                  setSelectedPatient(p);
                  onNextStep(); // Automatically transition to next step on select
                }}
                className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:border-teal-500 hover:bg-white hover:shadow-md hover:shadow-slate-100/50 cursor-pointer transition-all duration-300 group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 text-slate-500 font-black text-xs uppercase flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                    {p.firstName.charAt(0)}{p.lastName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight group-hover:text-teal-700">{p.firstName} {p.lastName}</h4>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{p.mrdNumber} | {p.mobile}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-teal-50 p-2 rounded-lg text-teal-600">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-slate-50 rounded-3xl border border-slate-250 border-dashed">
            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300 mx-auto mb-4">
              <User className="w-6 h-6" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching patients found</p>
            <p className="text-[9px] font-bold text-slate-300 mt-1.5 uppercase">Try searching the database or register a new patient first.</p>
          </div>
        )}
      </div>
    </div>
  );
};
