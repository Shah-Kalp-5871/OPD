'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useQueueSSE } from '@/hooks/useQueueSSE';
import { ReactTabulator, ColumnDefinition } from 'react-tabulator';
import 'react-tabulator/css/tabulator.min.css';

import { 
  UserPlus, 
  CalendarPlus, 
  Search, 
  Wallet, 
  BellRing, 
  ArrowRight,
  Activity,
  CheckSquare,
  Square,
  Users,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ReceptionDashboardView = () => {
  // From Dashboard
  const [statsData, setStatsData] = useState({
    total: 0,
    checkedIn: 0,
    waiting: 0,
    completed: 0,
    cancelled: 0
  });

  // From Queue
  const [queue, setQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  
  // Filters
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  const [purposeFilter, setPurposeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [ageRangeFilter, setAgeRangeFilter] = useState<string>('All');
  
  // Legend Selection
  const [selectedLegends, setSelectedLegends] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { entries: sseEntries, stats: sseStats } = useQueueSSE({
    doctorId: selectedDoctor === 'all' ? undefined : selectedDoctor
  });

  useEffect(() => {
    if (sseEntries.length > 0) {
      setQueue(sseEntries);
    }
  }, [sseEntries]);

  useEffect(() => {
    if (sseStats) {
      setStatsData(sseStats);
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
      setStatsData(response.data);
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

  const getBillingStatus = (entry: any) => {
    if (entry.patient?.isFoc) return 'FOC';
    return entry.case?.bill?.paymentStatus || 'PENDING';
  };

  const isNewPatient = (entry: any) => {
    return false;
  };

  // Filter Logic
  let filteredQueue = queue.filter(entry => {
    let match = true;
    
    // Status Filter
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

    // Legend Filters
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

  const getStatusBadgeString = (status: string) => {
    switch (status) {
      case 'WAITING':
        return `<div class="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-black uppercase tracking-widest border border-amber-200 inline-block">WAITING</div>`;
      case 'IN_SESSION':
        return `<div class="px-2 py-1 bg-teal-100 text-teal-700 rounded text-[10px] font-black uppercase tracking-widest border border-teal-200 inline-block animate-pulse">IN PROGRESS</div>`;
      case 'COMPLETED':
        return `<div class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-widest border border-emerald-200 inline-block">COMPLETED</div>`;
      case 'CANCELLED':
        return `<div class="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[10px] font-black uppercase tracking-widest border border-rose-200 inline-block">CANCELLED</div>`;
      default:
        return `<div class="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-black uppercase tracking-widest border border-slate-200 inline-block">${status}</div>`;
    }
  };

  const columns: ColumnDefinition[] = [
    { title: "Case No", field: "case.caseNumber", formatter: (cell: any) => `<span class="text-[12px] font-black text-slate-800 tracking-wider">${cell.getData().case?.caseNumber || cell.getData().tokenDisplay}</span>`, width: 120 },
    { title: "Appointment Time", field: "case.createdAt", formatter: (cell: any) => `<span class="text-[12px] font-bold text-slate-600 tracking-wider">${formatTime(cell.getValue())}</span>`, width: 180 },
    { title: "Check In Time", field: "checkInTime", formatter: (cell: any) => `<span class="text-[12px] font-bold text-slate-600 tracking-wider">${cell.getValue() ? formatTime(cell.getValue()) : '--'}</span>`, width: 140 },
    { title: "Patient Name", field: "patient.firstName", formatter: (cell: any) => {
        const data = cell.getData();
        const isNew = isNewPatient(data);
        const isInSession = data.status === 'IN_SESSION';
        return `<div class="text-[13px] font-black uppercase tracking-wider ${isInSession ? 'text-teal-600 animate-pulse' : 'text-slate-900'} flex items-center gap-2">
                   ${data.patient.firstName} ${data.patient.lastName} 
                   <span class="text-[10px] text-slate-400 font-bold">[${isNew ? 'NEW' : 'OLD'}]</span>
                </div>`;
    }},
    { title: "Visit For", field: "case.visitType", formatter: (cell: any) => `<span class="text-[11px] font-bold text-slate-600 uppercase tracking-wider">${getVisitType(cell.getData())}</span>`, width: 120 },
    { title: "Age", field: "patient.profile.age", formatter: (cell: any) => `<span class="text-[12px] font-black text-slate-700 tracking-widest">${cell.getValue() || '--'}</span>`, width: 70 },
    { title: "Gender", field: "patient.gender", formatter: (cell: any) => `<span class="text-[12px] font-black text-slate-700 tracking-widest">${cell.getValue() ? cell.getValue().charAt(0).toUpperCase() : 'U'}</span>`, width: 90 },
    { title: "Address", field: "patient.address.city", formatter: (cell: any) => `<span class="text-[12px] font-bold text-slate-600 uppercase tracking-widest">${cell.getValue() || '--'}</span>`, width: 120 },
    { title: "Billing", field: "billing", formatter: (cell: any) => {
        const billing = getBillingStatus(cell.getData());
        if (billing === 'FOC') return `<div class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-black uppercase tracking-widest border border-blue-200 inline-block">FOC</div>`;
        if (billing === 'PAID') return `<div class="text-[11px] font-black text-slate-600 uppercase">PAID</div>`;
        return `<div class="text-[11px] font-black text-rose-600 uppercase">PENDING</div>`;
    }, width: 100 },
    { title: "Status", field: "status", formatter: (cell: any) => getStatusBadgeString(cell.getValue()), width: 140 },
    { title: "Action", field: "action", headerSort: false, formatter: (cell: any) => {
        return `<a href="/reception/patients/${cell.getData().patient.id}" class="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-teal-600 transition-colors shadow-sm inline-block group cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 group-hover:text-teal-600 transition-colors"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                </a>`;
    }, hozAlign: "center" as const, width: 90 }
  ];

  const rowFormatter = (row: any) => {
    const data = row.getData();
    const isNew = isNewPatient(data);
    const isInSession = data.status === 'IN_SESSION';
    
    if (isNew) row.getElement().classList.add('row-new');
    if (isInSession) row.getElement().classList.add('row-insession');
  };

  return (
    <ReceptionLayout>
      <div className="space-y-10 pb-20">
        
        {/* 🔷 TOP SECTION: QUICK ACTIONS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Command Center</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             <Link href="/reception/patients/register" className="flex items-center gap-4 p-6 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 group">
                <div className="p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                   <UserPlus className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-teal-400">Add Entry</p>
                   <p className="text-sm font-black uppercase tracking-tighter">New Patient</p>
                </div>
             </Link>
             <Link href="/reception/appointments" className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-teal-300 transition-all shadow-sm group">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                   <CalendarPlus className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Scheduling</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Book Appointment</p>
                </div>
             </Link>
             <Link href="/reception/patients/search" className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-teal-300 transition-all shadow-sm group">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                   <Search className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Database</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Search Patient</p>
                </div>
             </Link>
             <Link href="/reception/billing" className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-teal-300 transition-all shadow-sm group">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                   <Wallet className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Financials</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Today's Billing</p>
                </div>
             </Link>
          </div>
        </div>

        {/* 🔷 NOTIFICATION PANEL (LEFT ALERT BOX) */}
        <div className="bg-teal-600 rounded-2xl p-6 shadow-xl shadow-teal-100 flex items-center justify-between border-2 border-teal-500 overflow-hidden relative group">
           <div className="absolute right-0 top-0 h-full w-32 bg-white/5 skew-x-[30deg] translate-x-16"></div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                 <BellRing className="w-6 h-6 text-white" />
              </div>
              <div>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-teal-100 uppercase tracking-widest leading-none">Notification: Dr. Valaki</span>
                    <span className="w-1 h-1 rounded-full bg-teal-300"></span>
                    <span className="text-[10px] font-black text-teal-200 uppercase tracking-widest leading-none">Clinical Signal</span>
                 </div>
                 <h3 className="text-lg font-black text-white mt-1 uppercase tracking-tight">
                   System Ready: <span className="text-teal-200 underline decoration-teal-300 underline-offset-4">Waiting for next patient...</span>
                 </h3>
              </div>
           </div>
           <div className="flex items-center gap-4 relative z-10">
              <div className="px-6 py-2 bg-white text-teal-700 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm">
                 Queue Active: <span className="text-emerald-600">{statsData.waiting} Patients</span>
              </div>
              <button className="p-3 bg-teal-800 text-white rounded-xl hover:bg-teal-900 transition-colors">
                 <ArrowRight className="w-5 h-5" />
              </button>
           </div>
        </div>

        {/* 🔷 OPD QUEUE INTEGRATED */}
        <div className="space-y-6 pt-4 border-t border-slate-200">
          
          {/* Filters Header */}
          <div className="flex flex-col lg:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
                  <Activity className="w-6 h-6 text-white animate-pulse" />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">OPD Queue</h1>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Live Hub</p>
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
            </div>
          </div>

          {/* Legend Checkboxes */}
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

          {/* Table Container */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden relative min-h-[500px] flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 space-y-6 min-h-[400px]">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-teal-600 rounded-full animate-spin"></div>
                  <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Loading Queue Data...</p>
              </div>
            ) : (
              <div className="flex-1">
                <ReactTabulator
                  data={currentQueueData}
                  columns={columns}
                  layout="fitColumns"
                  responsiveLayout="hide"
                  rowFormatter={rowFormatter}
                  options={{
                    headerSort: true, // Specifically keep sorting
                    selectable: false,
                    placeholder: currentQueueData.length === 0 ? "No patients found matching filters" : undefined,
                    initialSort: [
                      { column: "case.createdAt", dir: "asc" }
                    ]
                  }}
                  className="w-full h-full border-none"
                />
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

      </div>
    </ReceptionLayout>
  );
};

export default ReceptionDashboardView;
