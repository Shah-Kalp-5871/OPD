'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useQueueSSE } from '@/hooks/useQueueSSE';

import Link from 'next/link';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Search,
  PhoneCall,
  UserX,
  FileSignature,
  Upload,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  Eye
} from 'lucide-react';

const OpdQueueView = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, checkedIn: 0, waiting: 0, completed: 0, cancelled: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  
  // New Filters
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  const [purposeFilter, setPurposeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [ageRangeFilter, setAgeRangeFilter] = useState<string>('All');
  
  // Legend Selection
  const [selectedLegends, setSelectedLegends] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { entries: sseEntries, stats: sseStats, lastEvent } = useQueueSSE({
    doctorId: selectedDoctor === 'all' ? undefined : selectedDoctor
  });

  useEffect(() => {
    if (sseEntries.length > 0) {
      setQueue(sseEntries);
    }
  }, [sseEntries]);

  useEffect(() => {
    if (sseStats) {
      setStats(sseStats);
    }
  }, [sseStats]);

  useEffect(() => {
    fetchQueue();
    fetchStats();
    fetchDoctors();
  }, [selectedDoctor, dateFilter]); // Refresh if date changes

  const fetchQueue = async () => {
    try {
      setIsLoading(true);
      const url = selectedDoctor === 'all' ? '/queue/live' : `/queue/live?doctorId=${selectedDoctor}`;
      const response = await api.get(url);
      setQueue(response.data);
    } catch (error) {
      toast.error('Failed to refresh queue');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/queue/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    }
  };

  const toggleLegend = (legend: string) => {
    if (selectedLegends.includes(legend)) {
      setSelectedLegends(selectedLegends.filter(l => l !== legend));
    } else {
      setSelectedLegends([...selectedLegends, legend]);
    }
    setCurrentPage(1);
  };

  const getVisitType = (entry: any) => {
    return entry.case?.visitType || 'Consultation';
  };

  const getAgeSex = (entry: any) => {
    const age = entry.patient?.profile?.age || '--';
    const sex = entry.patient?.gender ? entry.patient.gender.charAt(0).toUpperCase() : 'U';
    return `${age}/${sex}`;
  };

  const getBillingStatus = (entry: any) => {
    if (entry.patient?.isFoc) return 'FOC';
    return entry.case?.bill?.paymentStatus || 'PENDING';
  };

  const isNewPatient = (entry: any) => {
    // Assuming if they have no ID or just created today, we can logic it.
    // For now, simple mock based on FOC status or random logic if needed, but we'll default to OLD if not sure.
    // Using isFoc to test highlighting if needed, or just let it be derived.
    return false; // Replace with real logic if backend provides isNewPatient flag
  };

  // Filter Logic
  let filteredQueue = queue.filter(entry => {
    let match = true;
    
    // Status Filter dropdown
    if (statusFilter !== 'All') {
      if (statusFilter === 'Completed' && entry.status !== 'COMPLETED') match = false;
      if (statusFilter === 'Waiting' && entry.status !== 'WAITING') match = false;
      if (statusFilter === 'In Progress' && entry.status !== 'IN_SESSION') match = false;
      if (statusFilter === 'Cancelled' && entry.status === 'CANCELLED') match = false;
    }

    // Purpose Filter
    if (purposeFilter !== 'All') {
      if (getVisitType(entry) !== purposeFilter) match = false;
    }

    // Legend Filters (Checkbox acting as OR filters if any selected)
    if (selectedLegends.length > 0) {
      let legendMatch = false;
      if (selectedLegends.includes('Waiting') && entry.status === 'WAITING') legendMatch = true;
      if (selectedLegends.includes('In Progress') && entry.status === 'IN_SESSION') legendMatch = true;
      if (selectedLegends.includes('Completed') && entry.status === 'COMPLETED') legendMatch = true;
      if (selectedLegends.includes('Cancelled') && entry.status === 'CANCELLED') legendMatch = true;
      if (selectedLegends.includes('New Patient') && isNewPatient(entry)) legendMatch = true;
      if (selectedLegends.includes('FOC') && getBillingStatus(entry) === 'FOC') legendMatch = true;
      
      if (!legendMatch) match = false;
    }

    return match;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredQueue.length / itemsPerPage) || 1;
  const currentQueueData = filteredQueue.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatTime = (dateString: string) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ReceptionLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-20 px-6">
        
        {/* Modern Top Header - Replacing utilitarian wireframe with our app's sleek styling */}
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
                <Activity className="w-6 h-6 text-white animate-pulse" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">OPD Queue Control</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Daily Visit Management</p>
             </div>
          </div>

          {/* Top Row Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase">Date:</span>
                <input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="text-[12px] font-bold text-slate-800 outline-none bg-transparent"
                />
             </div>
             <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase">Purpose:</span>
                <select 
                  value={purposeFilter}
                  onChange={(e) => setPurposeFilter(e.target.value)}
                  className="text-[12px] font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-Up">Follow-Up</option>
                  <option value="Procedure">Procedure</option>
                </select>
             </div>
             <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase">Status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-[12px] font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Waiting">Waiting</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
             </div>
             <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase">Age Range:</span>
                <select 
                  value={ageRangeFilter}
                  onChange={(e) => setAgeRangeFilter(e.target.value)}
                  className="text-[12px] font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="0-18">0-18</option>
                  <option value="19-40">19-40</option>
                  <option value="41-60">41-60</option>
                  <option value="60+">60+</option>
                </select>
             </div>
          </div>
        </div>

        {/* Legend / Filter Checkboxes */}
        <div className="flex flex-wrap items-center gap-4 px-2">
          {['Waiting', 'In Progress', 'Completed', 'Cancelled', 'New Patient', 'FOC'].map((legend) => {
            const isSelected = selectedLegends.includes(legend);
            return (
              <button 
                key={legend}
                onClick={() => toggleLegend(legend)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-teal-50 border-teal-200 text-teal-800 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isSelected ? <CheckSquare className="w-4 h-4 text-teal-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {legend} {legend === 'In Progress' && '(Blinking)'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Table Area */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden relative min-h-[500px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 space-y-6 min-h-[400px]">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-teal-600 rounded-full animate-spin"></div>
                <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Loading Queue Data...</p>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200">
                    <th className="px-6 py-4 text-center w-12"><Square className="w-4 h-4 text-slate-400 mx-auto" /></th>
                    <th className="px-4 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest border-l border-slate-200">Case ID</th>
                    <th className="px-4 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest border-l border-slate-200">Appt</th>
                    <th className="px-4 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest border-l border-slate-200">Chk-In</th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest border-l border-slate-200">Patient Name</th>
                    <th className="px-4 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest border-l border-slate-200">Visit</th>
                    <th className="px-4 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest border-l border-slate-200">Age/Sex</th>
                    <th className="px-4 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest border-l border-slate-200">Billing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentQueueData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-50 space-y-4">
                          <Users className="w-12 h-12 text-slate-300" />
                          <span className="text-[12px] font-black uppercase tracking-widest text-slate-500">No patients found matching filters</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentQueueData.map((entry) => {
                    const isNew = isNewPatient(entry);
                    const isInSession = entry.status === 'IN_SESSION';
                    const billing = getBillingStatus(entry);
                    const rowBg = isNew ? 'bg-amber-50/30' : isInSession ? 'bg-teal-50/20' : 'hover:bg-slate-50';

                    return (
                      <tr key={entry.id} className={`transition-colors ${rowBg}`}>
                        <td className="px-6 py-4 text-center border-b border-slate-100">
                          <Square className="w-4 h-4 text-slate-300 mx-auto" />
                        </td>
                        <td className="px-4 py-4 border-l border-b border-slate-100">
                          <span className="text-[12px] font-black text-slate-800 tracking-wider">
                            {entry.case?.caseNumber || entry.tokenDisplay}
                          </span>
                        </td>
                        <td className="px-4 py-4 border-l border-b border-slate-100">
                          <span className="text-[12px] font-bold text-slate-600 tracking-wider">
                            {formatTime(entry.case?.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-4 border-l border-b border-slate-100">
                          <span className="text-[12px] font-bold text-slate-600 tracking-wider">
                            {entry.checkInTime ? formatTime(entry.checkInTime) : '--'}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-l border-b border-slate-100">
                          <div className={`text-[13px] font-black uppercase tracking-wider ${isInSession ? 'text-teal-600 animate-pulse' : 'text-slate-900'} flex items-center gap-2`}>
                            <Link href={`/reception/patients/${entry.patient.id}`} className="hover:text-teal-600 transition-colors flex items-center gap-2">
                              {entry.patient.firstName} {entry.patient.lastName} 
                              <span className="text-[10px] text-slate-400 font-bold">[{isNew ? 'NEW' : 'OLD'}]</span>
                              <Eye className="w-4 h-4 text-slate-400 hover:text-teal-600" />
                            </Link>
                          </div>
                        </td>
                        <td className="px-4 py-4 border-l border-b border-slate-100">
                          <span className="text-[11px] font-bold text-slate-600">{getVisitType(entry)}</span>
                        </td>
                        <td className="px-4 py-4 border-l border-b border-slate-100">
                          <span className="text-[12px] font-black text-slate-700 tracking-widest">{getAgeSex(entry)}</span>
                        </td>
                        <td className="px-4 py-4 border-l border-b border-slate-100">
                          {billing === 'FOC' ? (
                            <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-black uppercase tracking-widest border border-blue-200 inline-block">
                              FOC
                            </div>
                          ) : billing === 'PAID' ? (
                            <div className="text-[11px] font-black text-slate-600 uppercase">PAID</div>
                          ) : (
                            <div className="text-[11px] font-black text-rose-600 uppercase">PENDING</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer Pagination Strip */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev Page
              </button>
              <span className="text-[11px] font-bold text-slate-600">
                Page <span className="font-black text-slate-900">{currentPage}</span> of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
              >
                Next Page
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
              Total: {filteredQueue.length} appointments
            </div>
          </div>
        </div>

      </div>
    </ReceptionLayout>
  );
};

export default OpdQueueView;