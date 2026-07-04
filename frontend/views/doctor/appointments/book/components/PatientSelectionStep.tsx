'use client';

import React from 'react';
import { Search, User, Users, ArrowRight, UserPlus, ScanLine } from 'lucide-react';
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
  onNextStep,
}) => {
  const router = useRouter();

  const filteredRecent = searchQuery.trim() === ''
    ? recentPatients
    : recentPatients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mrdNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mobile?.includes(searchQuery)
      );

  const displayList = searchResults.length > 0 ? searchResults : filteredRecent;

  const handleSelect = (p: any) => {
    setSelectedPatient(p);
    onNextStep();
  };

  const avatarColor = (name: string) => {
    const colors = [
      'bg-sky-100 text-sky-700',
      'bg-violet-100 text-violet-700',
      'bg-amber-100 text-amber-700',
      'bg-sky-100 text-sky-700',
      'bg-rose-100 text-rose-700',
      'bg-emerald-100 text-emerald-700',
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-0">

      {/* ─── INTEGRATED SEARCH BAR ─── */}
      <div className="bg-white border border-slate-200 rounded-t-3xl overflow-hidden shadow-sm">
        <div className="flex items-center divide-x divide-slate-100">
          {/* Search input */}
          <div className="flex-1 flex items-center gap-3 px-5 py-4">
            <Search className="w-4 h-4 text-slate-300 shrink-0" />
            <input
              type="text"
              className="flex-1 bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none"
              placeholder="Search by name, MRD, or mobile number…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[9px] font-black text-slate-300 hover:text-slate-500 uppercase tracking-widest transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Registry button */}
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="flex items-center gap-2 px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] hover:bg-slate-50 hover:text-[#0d6282] transition-colors disabled:opacity-40"
          >
            {isSearching
              ? <div className="w-3.5 h-3.5 border-2 border-sky-500/30 border-t-orange-500 rounded-full animate-spin" />
              : <ScanLine className="w-3.5 h-3.5" />
            }
            Search DB
          </button>

          {/* New Register button */}
          <button
            onClick={() => router.push('/doctor/register')}
            className="flex items-center gap-2 px-5 py-4 text-[10px] font-black text-[#0d6282] uppercase tracking-[0.15em] hover:bg-sky-50 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            New Patient
          </button>
        </div>
      </div>

      {/* ─── PATIENT DIRECTORY ─── */}
      <div className="bg-white border border-t-0 border-slate-200 rounded-b-3xl overflow-hidden shadow-sm">

        {/* Section label row */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">
              {searchResults.length > 0
                ? 'Search Results'
                : searchQuery.trim()
                  ? 'Filtered Directory'
                  : 'Patient Directory'}
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
            {displayList.length} {displayList.length === 1 ? 'patient' : 'patients'}
          </span>
        </div>

        {/* Grid of patients */}
        <div className="p-4">
          {isRecentLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[72px] bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : displayList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {displayList.map((p) => {
                const initials = `${p.firstName?.charAt(0) ?? ''}${p.lastName?.charAt(0) ?? ''}`;
                const colorClass = avatarColor(p.firstName ?? 'A');
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className="group flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-sky-300 hover:bg-white hover:shadow-sm transition-all duration-200 text-left w-full"
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-[11px] font-black uppercase ${colorClass}`}>
                      {initials}
                    </div>
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-black text-slate-800 uppercase leading-tight truncate group-hover:text-sky-700 transition-colors">
                        {p.firstName} {p.lastName}
                      </p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5 truncate">
                        {p.mrdNumber}
                      </p>
                    </div>
                    {/* Arrow */}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-200 group-hover:text-sky-500 shrink-0 transition-colors" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <User className="w-6 h-6 text-slate-300" />
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No patients found</p>
                <p className="text-[10px] font-medium text-slate-300 mt-1">
                  Try a different search or{' '}
                  <button
                    onClick={() => router.push('/doctor/register')}
                    className="text-sky-500 hover:underline font-bold"
                  >
                    register a new patient
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
