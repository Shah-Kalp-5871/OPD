'use client';

import React, { useState, useEffect } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useQueueSSE } from '@/hooks/useQueueSSE';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
  Search,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  RotateCcw,
  ArrowRight,
  X,
  Lock,
  Bell
} from 'lucide-react';
import CheckInModal from '@/views/reception/components/CheckInModal';
import { QueueStatusBadge } from '@/views/reception/components/QueueStatusBadge';
import { useAuthStore } from '@/store/authStore';

const OpdQueueView = () => {
  const router = useRouter();
  const [queue, setQueue] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, checkedIn: 0, waiting: 0, completed: 0, cancelled: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const [doctors, setDoctors] = useState<any[]>([]);
  const user = useAuthStore(state => state.user);
  const selectedDoctor = user?.id || 'all';
  
  // New Filters
  const [queueTab, setQueueTab] = useState<'current' | 'completed'>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  const [purposeFilter, setPurposeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [ageRangeFilter, setAgeRangeFilter] = useState<string>('All');
  
  // Legend Selection
  const [selectedLegends, setSelectedLegends] = useState<string[]>([]);
  const [checkingInApptId, setCheckingInApptId] = useState<string | null>(null);

  // Sorting
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'asc' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { entries: sseEntries, stats: sseStats, lastEvent, refreshData: refreshSseData } = useQueueSSE({
    doctorId: selectedDoctor === 'all' ? undefined : selectedDoctor
  });

  const [appointmentsQueue, setAppointmentsQueue] = useState<any[]>([]);

  // Cancel Appointment Modal State
  const [cancelApptId, setCancelApptId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelAppointment = async () => {
    if (!cancelApptId || !cancelReason.trim()) return;
    setIsCancelling(true);
    try {
      await api.patch(`/appointments/${cancelApptId}/cancel`, { reason: cancelReason });
      toast.success('Appointment cancelled successfully');
      setCancelApptId(null);
      setCancelReason('');
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setIsCancelling(false);
    }
  };

  const playBellSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // First Tone (Ding)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.50, ctx.currentTime); // High C
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 1.0);

      // Second Tone (Dong - lasts for 2 seconds)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.4); // A note, starts slightly later
      gain2.gain.setValueAtTime(0, ctx.currentTime + 0.4);
      gain2.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.45);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0); // Fades out over 2 seconds
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 2.0);

    } catch (e) {
      console.error('Audio playback failed', e);
    }
  };

  const playCallingBellSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Play 5 chimes over 10 seconds (every 2 seconds)
      for (let i = 0; i < 5; i++) {
        const startTime = ctx.currentTime + (i * 2);
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880.00, startTime); 
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.8, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.0);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 1.0);
      }
    } catch (e) {
      console.error('Audio playback failed', e);
    }
  };

  useEffect(() => {
    if (lastEvent) {
      if (lastEvent.type === 'SESSION_ENDED') {
        playBellSound();
        toast.success(`Session ended for ${lastEvent.patientName}. Ready for next patient!`, {
          duration: 5000,
          position: 'top-center'
        });
        fetchAppointments();
        refreshSseData();
      } else if (lastEvent.type === 'STATUS_CHANGED' && lastEvent.status === 'CALLING') {
        playCallingBellSound();
        toast.info(`Doctor is calling patient: ${lastEvent.patientName || 'Next Patient'}!`, {
          duration: 10000,
          position: 'top-center'
        });
        fetchAppointments();
        refreshSseData();
      }
    }
  }, [lastEvent]);

  useEffect(() => {
    setQueue([...sseEntries, ...appointmentsQueue]);
  }, [sseEntries, appointmentsQueue]);

  useEffect(() => {
    if (sseStats) {
      setStats(sseStats);
    }
  }, [sseStats]);

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, [selectedDoctor, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const apptUrl = `/appointments?date=${dateFilter}${selectedDoctor !== 'all' ? `&doctorId=${selectedDoctor}` : ''}`;
      
      const apptRes = await api.get(apptUrl);
      
      const apptData = (apptRes.data?.data || [])
        .filter((a: any) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED')
        .map((a: any) => ({
          isAppointment: true,
          appointmentId: a.id,
          id: a.id,
          status: 'SCHEDULED_APPOINTMENT',
          tokenDisplay: 'APP-' + new Date(a.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tokenNumber: 9999,
          patient: a.patient,
          doctor: a.doctor,
          case: { visitType: a.purpose, createdAt: a.appointmentTime },
          checkInTime: null,
          createdAt: a.createdAt,
        }));

      setAppointmentsQueue(apptData);
    } catch (error) {
      toast.error('Failed to fetch appointments');
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

  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedAppointmentForCheckIn, setSelectedAppointmentForCheckIn] = useState<string | null>(null);
  const [selectedPatientForCheckIn, setSelectedPatientForCheckIn] = useState<any>(null);

  const handleDirectCheckIn = (appointmentId: string, patient: any) => {
    setSelectedAppointmentForCheckIn(appointmentId);
    setSelectedPatientForCheckIn(patient);
    setIsCheckInModalOpen(true);
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
    if (entry.patient?._count?.cases !== undefined) {
      return entry.patient._count.cases <= 1;
    }
    return false;
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  let filteredQueue = queue.filter(entry => {
    let match = true;

    // Filter by Tab (Current vs Completed)
    const isCompleted = ['COMPLETED', 'SESSION_ENDED', 'BILLING_PENDING', 'PHARMACY_PENDING'].includes(entry.status);
    if (queueTab === 'current' && isCompleted) match = false;
    if (queueTab === 'completed' && !isCompleted) match = false;

    // Search Query
    if (searchQuery.trim() !== '') {
      const patient = entry.patient || entry.patientObj;
      if (patient) {
        const searchStr = searchQuery.toLowerCase();
        const nameMatch = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase().includes(searchStr);
        const idMatch = patient.patientId?.toLowerCase().includes(searchStr);
        const phoneMatch = patient.mobile?.includes(searchStr);
        if (!nameMatch && !idMatch && !phoneMatch) match = false;
      } else {
        match = false;
      }
    }
    
    if (statusFilter !== 'All') {
      if (statusFilter === 'Completed' && entry.status !== 'COMPLETED') match = false;
      if (statusFilter === 'Waiting' && entry.status !== 'WAITING') match = false;
      if (statusFilter === 'In Progress' && entry.status !== 'IN_SESSION') match = false;
      if (statusFilter === 'Cancelled' && entry.status === 'CANCELLED') match = false;
    }

    if (purposeFilter !== 'All') {
      if (getVisitType(entry) !== purposeFilter) match = false;
    }

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

  const sortedQueue = React.useMemo(() => {
    let sortableItems = [...filteredQueue];
    sortableItems.sort((a, b) => {
      let aValue: any = '';
      let bValue: any = '';

      if (sortConfig.key === 'createdAt') {
        aValue = new Date(a.case?.createdAt || 0).getTime();
        bValue = new Date(b.case?.createdAt || 0).getTime();
      } else if (sortConfig.key === 'checkInTime') {
        aValue = new Date(a.checkInTime || 0).getTime();
        bValue = new Date(b.checkInTime || 0).getTime();
      } else if (sortConfig.key === 'patientName') {
        aValue = `${a.patient?.firstName || ''} ${a.patient?.lastName || ''}`.toLowerCase();
        bValue = `${b.patient?.firstName || ''} ${b.patient?.lastName || ''}`.toLowerCase();
      } else if (sortConfig.key === 'age') {
        aValue = parseInt(a.patient?.profile?.age) || 0;
        bValue = parseInt(b.patient?.profile?.age) || 0;
      } else {
        aValue = getNestedValue(a, sortConfig.key) || '';
        bValue = getNestedValue(b, sortConfig.key) || '';
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [filteredQueue, sortConfig]);

  const totalPages = Math.ceil(sortedQueue.length / itemsPerPage) || 1;
  const currentQueueData = sortedQueue.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatTime = (dateString: string) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadgeString = (status: string) => {
    switch (status) {
      case 'WAITING':
        return `<div class="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-black uppercase tracking-widest border border-amber-200 inline-block">WAITING</div>`;
      case 'IN_SESSION':
        return `<div class="px-2 py-1 bg-sky-100 text-[#0a4b63] rounded text-[10px] font-black uppercase tracking-widest border border-sky-200 inline-block animate-pulse">IN PROGRESS</div>`;
      case 'COMPLETED':
        return `<div class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-widest border border-emerald-200 inline-block">COMPLETED</div>`;
      case 'CANCELLED':
        return `<div class="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[10px] font-black uppercase tracking-widest border border-rose-200 inline-block">CANCELLED</div>`;
      case 'SCHEDULED_APPOINTMENT':
        return `<div class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-[10px] font-black uppercase tracking-widest border border-indigo-200 inline-block">SCHEDULED APPT</div>`;
      default:
        return `<div class="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-black uppercase tracking-widest border border-slate-200 inline-block">${status}</div>`;
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) return null;
    return <span className="text-white ml-1 inline-block text-[12px]">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <DoctorLayout>
      <div className="space-y-6 pb-20 w-full mx-auto">
        
        {/* Modern Top Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white p-2 lg:p-3 rounded-xl border border-slate-200 shadow-sm gap-3">
          <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 bg-[#0d6282] rounded-lg flex items-center justify-center shadow-sm">
                <Activity className="w-4 h-4 text-white animate-pulse" />
             </div>
             <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">OPD Queue Control</h1>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-0.5">Daily Visit Management</p>
             </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex-1 justify-end">
             <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-slate-200 min-w-[130px]">
                <Search className="w-3 h-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-[10px] font-bold text-slate-800 outline-none bg-transparent w-full"
                />
             </div>
             <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-slate-200">
                <span className="text-[8px] font-black text-slate-500 uppercase">Date:</span>
                <input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="text-[10px] font-bold text-slate-800 outline-none bg-transparent"
                />
             </div>
             <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-slate-200">
                <span className="text-[8px] font-black text-slate-500 uppercase">Purpose:</span>
                <select 
                  value={purposeFilter}
                  onChange={(e) => setPurposeFilter(e.target.value)}
                  className="text-[10px] font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-Up">Follow-Up</option>
                  <option value="Procedure">Procedure</option>
                </select>
             </div>
             <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-slate-200">
                <span className="text-[8px] font-black text-slate-500 uppercase">Status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-[10px] font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Waiting">Waiting</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
             </div>
             <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-slate-200">
                <span className="text-[8px] font-black text-slate-500 uppercase">Age:</span>
                <select 
                  value={ageRangeFilter}
                  onChange={(e) => setAgeRangeFilter(e.target.value)}
                  className="text-[10px] font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="0-18">0-18</option>
                  <option value="19-40">19-40</option>
                  <option value="41-60">41-60</option>
                  <option value="60+">60+</option>
                </select>
             </div>

             <button 
                onClick={() => {
                   setDateFilter(new Date().toISOString().split('T')[0]);
                   setPurposeFilter('All');
                   setStatusFilter('All');
                   setAgeRangeFilter('All');
                   setSelectedLegends([]);
                   setSearchQuery('');
                   setSortConfig({ key: 'createdAt', direction: 'asc' });
                }}
                title="Reset Filters"
                className="p-1.5 bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-all shadow-sm flex items-center justify-center gap-1"
             >
                <RotateCcw className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase px-1">Reset</span>
             </button>
          </div>
        </div>

        {/* TABS & Legend */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-2">
          {/* TABS */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
             <button 
               onClick={() => setQueueTab('current')}
               className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                 queueTab === 'current' ? 'bg-white text-[#0d6282] shadow-sm' : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               Current Queue
             </button>
             <button 
               onClick={() => setQueueTab('completed')}
               className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                 queueTab === 'completed' ? 'bg-white text-[#0d6282] shadow-sm' : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               Completed
             </button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-2">
            {['Waiting', 'In Progress', 'Completed', 'Cancelled', 'New Patient', 'FOC'].map((legend) => {
              const isSelected = selectedLegends.includes(legend);
              return (
                <button 
                  key={legend}
                  onClick={() => toggleLegend(legend)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
                    isSelected 
                      ? 'bg-sky-50 border-sky-200 text-[#0a4b63] shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? <CheckSquare className="w-3 h-3 text-[#0d6282]" /> : <Square className="w-3 h-3 text-slate-400" />}
                  <span className="text-[9px] font-black uppercase tracking-wider">
                    {legend} {legend === 'In Progress' && '(Blinking)'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden relative min-h-[500px] flex flex-col">
           {isLoading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 space-y-6">
                 <div className="w-16 h-16 border-4 border-slate-100 border-t-[#0d6282] rounded-full animate-spin"></div>
                 <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Loading Queue Data...</p>
             </div>
           )}
           
           <div className="flex-1 relative overflow-auto bg-white scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
             <table className="w-full text-left border-collapse border border-slate-200">
               <thead className="bg-[#107ca3] text-white sticky top-0 z-10">
                 <tr>
                   <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] cursor-pointer hover:bg-[#0d6282] transition-colors" onClick={() => handleSort('case.caseNumber')}><div className="flex items-center justify-center gap-1">Case No <SortIcon columnKey="case.caseNumber" /></div></th>
                   <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] cursor-pointer hover:bg-[#0d6282] transition-colors" onClick={() => handleSort('createdAt')}><div className="flex items-center justify-center gap-1">Appt Time <SortIcon columnKey="createdAt" /></div></th>
                   <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] cursor-pointer hover:bg-[#0d6282] transition-colors" onClick={() => handleSort('checkInTime')}><div className="flex items-center justify-center gap-1">Check In <SortIcon columnKey="checkInTime" /></div></th>
                   <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] cursor-pointer hover:bg-[#0d6282] transition-colors" onClick={() => handleSort('patientName')}><div className="flex items-center gap-1">Patient Name <SortIcon columnKey="patientName" /></div></th>
                   <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] cursor-pointer hover:bg-[#0d6282] transition-colors" onClick={() => handleSort('case.visitType')}><div className="flex items-center justify-center gap-1">Visit For <SortIcon columnKey="case.visitType" /></div></th>
                   <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] cursor-pointer hover:bg-[#0d6282] transition-colors" onClick={() => handleSort('age')}><div className="flex items-center justify-center gap-1">Age <SortIcon columnKey="age" /></div></th>
                   <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] cursor-pointer hover:bg-[#0d6282] transition-colors" onClick={() => handleSort('patient.gender')}><div className="flex items-center justify-center gap-1">Sex <SortIcon columnKey="patient.gender" /></div></th>
                   <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] cursor-pointer hover:bg-[#0d6282] transition-colors" onClick={() => handleSort('patient.address.city')}><div className="flex items-center gap-1">Address <SortIcon columnKey="patient.address.city" /></div></th>
                   <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] text-center">Billing</th>
                   <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] cursor-pointer hover:bg-[#0d6282] transition-colors" onClick={() => handleSort('status')}><div className="flex items-center justify-center gap-1">Status <SortIcon columnKey="status" /></div></th>
                   <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest border border-[#0d6282] text-center">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {currentQueueData.length === 0 ? (
                   <tr>
                     <td colSpan={11} className="py-16 text-center text-slate-400">
                       <div className="flex flex-col items-center justify-center">
                         <Search className="w-10 h-10 mb-3 text-slate-300" />
                         <span className="text-xs font-bold uppercase tracking-widest">No patients found</span>
                       </div>
                     </td>
                   </tr>
                 ) : (
                   currentQueueData.map((entry, idx) => {
                      const isInSession = entry.status === 'IN_SESSION';
                      const isCalling = entry.status === 'CALLING';
                      let rowBg = '';
                      switch (entry.status) {
                        case 'WAITING': rowBg = 'bg-amber-50/40 hover:bg-amber-100/50'; break;
                        case 'CALLING': rowBg = 'bg-blue-100 border-2 border-blue-400 hover:bg-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse'; break;
                        case 'IN_SESSION': rowBg = 'bg-sky-50/60 hover:bg-sky-100/60'; break;
                        case 'COMPLETED': rowBg = 'bg-emerald-50/40 hover:bg-emerald-100/50'; break;
                        case 'CANCELLED': rowBg = 'bg-rose-50/40 hover:bg-rose-100/50'; break;
                        case 'SCHEDULED_APPOINTMENT': rowBg = 'bg-indigo-50/40 hover:bg-indigo-100/50'; break;
                        default: rowBg = idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/30 hover:bg-slate-50';
                      }
                      const billing = getBillingStatus(entry);

                      return (
                         <tr 
                           key={entry.id || idx} 
                           onClick={() => !isInSession && entry.patient?.id && router.push(`/doctor/patients/hub/${entry.patient.id}/`)}
                           className={`${rowBg} transition-all duration-300 ${isInSession ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                         >
                          <td className="px-4 py-4 border border-slate-200 text-center">
                            <span className={`w-fit mx-auto text-xs font-black tracking-wider px-3 py-1.5 rounded-xl border transition-all ${entry.status === 'IN_SESSION' ? 'bg-[#0d6282] text-white border-[#0a4b63] shadow-sm' : 'bg-white text-slate-900 border-slate-300 shadow-sm'}`}>
                               {entry.isAppointment ? '--' : (entry.case?.caseNumber || entry.tokenDisplay)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center border border-slate-200">
                             <span className="text-xs font-bold text-slate-700 flex items-center justify-center gap-2">
                                {formatTime(entry.expectedTime || entry.case?.createdAt)}
                             </span>
                          </td>
                          <td className="px-4 py-4 text-center border border-slate-200">
                             <span className="text-xs font-bold text-slate-700 flex items-center justify-center gap-2">
                                {entry.checkInTime ? formatTime(entry.checkInTime) : '--'}
                             </span>
                          </td>
                          <td className="px-4 py-4 border border-slate-200">
                             <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900 capitalize">{entry.mrId ? `${entry.mr?.firstName} ${entry.mr?.lastName}` : `${entry.patient?.firstName} ${entry.patient?.lastName}`}</span>
                                {entry.mrId && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest border bg-amber-100 text-amber-700 border-amber-200 uppercase">
                                    MR
                                  </span>
                                )}
                             </div>
                          </td>
                          <td className="px-4 py-4 text-center border border-slate-200">
                             <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest bg-slate-50/50 border border-slate-200 px-3 py-1.5 rounded-xl">
                                {getVisitType(entry)}
                             </span>
                          </td>
                          <td className="px-4 py-4 text-center text-[12px] font-bold text-slate-700 border border-slate-200">
                            {entry.mrId ? '--' : entry.patient?.profile?.age || '--'}
                          </td>
                          <td className="px-4 py-4 text-center text-[12px] font-bold text-slate-700 capitalize border border-slate-200">
                            {entry.mrId ? '--' : (entry.patient?.gender ? entry.patient.gender.toLowerCase() : 'u')}
                          </td>
                          <td className="px-4 py-4 text-[12px] font-bold text-slate-700 truncate max-w-[120px] border border-slate-200">
                            {entry.mrId ? (entry.mr?.companyName || '--') : (entry.patient?.address?.city || '--')}
                          </td>
                          <td className="px-4 py-4 text-center border border-slate-200">
                             <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${
                               billing === 'FOC' || billing === 'COMPLETED'
                                 ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                 : 'bg-amber-50 text-amber-600 border-amber-200'
                             }`}>
                                {billing === 'FOC' ? 'FOC' : (billing || 'PENDING')}
                             </span>
                          </td>
                          <td className="px-4 py-4 text-center border border-slate-200">
                            <QueueStatusBadge entry={entry} onCancel={setCancelApptId} />
                          </td>
                         <td className="px-4 py-4 text-center border border-slate-200">
                            {entry.isAppointment ? (
                              <button 
                                onClick={(e) => { 
                                   e.stopPropagation(); 
                                   handleDirectCheckIn(entry.appointmentId, entry.patient);
                                }}
                                disabled={checkingInApptId === entry.appointmentId}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm transition-all border border-indigo-200 flex items-center justify-center min-w-[70px] mx-auto"
                              >
                                {checkingInApptId === entry.appointmentId ? (
                                  <div className="w-2.5 h-2.5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                                ) : (
                                  'Arrived'
                                )}
                              </button>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                {!entry.mrId && entry.status === 'WAITING' && (
                                  <>
                                    <span className={`px-2 py-1 rounded-[4px] text-[9px] font-bold tracking-widest uppercase border ${entry.case?.vitalsList?.length > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-500 border-rose-200'}`}>
                                      Vit {entry.case?.vitalsList?.length > 0 ? '✓' : '✗'}
                                    </span>
                                    <span className={`px-2 py-1 rounded-[4px] text-[9px] font-bold tracking-widest uppercase border ${entry.case?.visitComplaint ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-500 border-rose-200'}`}>
                                      Cmp {entry.case?.visitComplaint ? '✓' : '✗'}
                                    </span>
                                  </>
                                )}
                                {entry.status === 'IN_SESSION' && (
                                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                    <Lock className="w-3 h-3" /> Locked
                                  </span>
                                )}
                                {entry.status === 'CALLING' && (
                                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1 animate-pulse">
                                    <Activity className="w-3 h-3" /> Calling
                                  </span>
                                )}
                              </div>
                            )}
                         </td>
                       </tr>
                     );
                   })
                 )}
               </tbody>
             </table>
           </div>

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

      {cancelApptId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <X className="w-4 h-4 text-rose-500" /> Cancel Appointment
              </h2>
              <button onClick={() => setCancelApptId(null)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block mb-2">Reason for Cancellation</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setCancelApptId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={handleCancelAppointment}
                disabled={!cancelReason.trim() || isCancelling}
                className="px-6 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCheckInModalOpen && (
        <CheckInModal
          isOpen={isCheckInModalOpen}
          onClose={() => {
            setIsCheckInModalOpen(false);
            setSelectedAppointmentForCheckIn(null);
            setSelectedPatientForCheckIn(null);
          }}
          appointmentId={selectedAppointmentForCheckIn || undefined}
          patient={selectedPatientForCheckIn}
          onSuccess={() => {
            setIsCheckInModalOpen(false);
            fetchAppointments();
            refreshSseData();
          }}
        />
      )}
    </DoctorLayout>
  );
};

export default OpdQueueView;