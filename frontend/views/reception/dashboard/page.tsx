'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useQueueSSE } from '@/hooks/useQueueSSE';

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
  ChevronLeft,
  ChevronRight,
  BarChart3,
  RotateCcw,
  X
} from 'lucide-react';

const ReceptionDashboardView = () => {
  const router = useRouter();
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  
  // Filters
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  const [purposeFilter, setPurposeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [ageRangeFilter, setAgeRangeFilter] = useState<string>('All');
  
  // Legend Selection
  const [selectedLegends, setSelectedLegends] = useState<string[]>([]);

  // Sorting
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'asc' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { entries: sseEntries, stats: sseStats, lastEvent } = useQueueSSE({
    doctorId: selectedDoctor === 'all' ? undefined : selectedDoctor
  });

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [vitals, setVitals] = useState({ temp: '', pulse: '', bpSys: '', bpDia: '', height: '', weight: '', spo2: '' });
  const [appointmentsQueue, setAppointmentsQueue] = useState<any[]>([]);

  // Check-In Modal Additions
  const [activeTab, setActiveTab] = useState<'check-in' | 'missed'>('check-in');
  const [missedAction, setMissedAction] = useState<string>(''); // 'reschedule', 'no-answer', 'not-called'
  const [newFuDate, setNewFuDate] = useState<string>('');
  const [missedNote, setMissedNote] = useState<string>('');
  const [isSubmittingMissed, setIsSubmittingMissed] = useState(false);

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

  useEffect(() => {
    if (lastEvent) {
      if (lastEvent.type === 'SESSION_ENDED') {
        playBellSound();
        toast.success(`Session ended for ${lastEvent.patientName}. Ready for next patient!`, {
          duration: 5000,
          position: 'top-center'
        });
        fetchQueue();
      }
    }
  }, [lastEvent]);

  useEffect(() => {
    if (sseEntries.length > 0 || appointmentsQueue.length > 0) {
      setQueue([...sseEntries, ...appointmentsQueue]);
    }
  }, [sseEntries, appointmentsQueue]);

  useEffect(() => {
    if (sseStats) {
      setStatsData(sseStats);
    }
  }, [sseStats]);

  useEffect(() => {
    fetchQueue();
    fetchStats();
    fetchDoctors();
  }, [selectedDoctor, dateFilter]);

  const fetchQueue = async () => {
    try {
      setIsLoading(true);
      const queueUrl = selectedDoctor === 'all' ? '/queue/live' : `/queue/live?doctorId=${selectedDoctor}`;
      const apptUrl = `/appointments?date=${dateFilter}${selectedDoctor !== 'all' ? `&doctorId=${selectedDoctor}` : ''}`;
      
      const [queueRes, apptRes] = await Promise.all([
        api.get(queueUrl),
        api.get(apptUrl)
      ]);

      const queueData = queueRes.data;
      const apptData = (apptRes.data?.data || [])
        .filter((a: any) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED')
        .map((a: any) => ({
          isAppointment: true,
          appointmentId: a.id,
          id: a.id,
          status: 'SCHEDULED_APPOINTMENT',
          tokenDisplay: 'APP-' + new Date(a.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tokenNumber: 9999, // Sort after token entries usually
          patient: a.patient,
          doctor: a.doctor,
          case: { visitType: a.purpose, createdAt: a.appointmentTime },
          checkInTime: null,
          createdAt: a.createdAt,
        }));

      setAppointmentsQueue(apptData);
      setQueue([...queueData, ...apptData]);
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  const submitCheckIn = async (skipVitals: boolean) => {
    if (!selectedAppointmentId) return;
    try {
      const payload: any = { appointmentId: selectedAppointmentId };
      if (!skipVitals) {
        payload.vitals = {};
        if (vitals.height) payload.vitals.height = Number(vitals.height);
        if (vitals.weight) payload.vitals.weight = Number(vitals.weight);
        if (vitals.temp) payload.vitals.temperature = Number(vitals.temp);
        if (vitals.pulse) payload.vitals.pulse = Number(vitals.pulse);
        if (vitals.bpSys && vitals.bpDia) payload.vitals.bloodPressure = `${vitals.bpSys}/${vitals.bpDia}`;
        if (vitals.spo2) payload.vitals.spo2 = Number(vitals.spo2);
      }
      
      await api.post('/appointments/check-in', payload);
      toast.success('Patient checked in successfully!');
      setShowCheckInModal(false);
      setSelectedAppointmentId(null);
      setVitals({ temp: '', pulse: '', bpSys: '', bpDia: '', height: '', weight: '', spo2: '' });
      fetchQueue();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to check in patient');
    }
  };

  const handleMissedActionSubmit = async () => {
    if (!selectedAppointmentId) {
      toast.error('No appointment selected.');
      return;
    }
    if (missedAction === 'reschedule' && !newFuDate) {
      toast.error('Please select a new follow-up date for rescheduling.');
      return;
    }
    
    setIsSubmittingMissed(true);
    try {
      const entry = queue.find(e => e.appointmentId === selectedAppointmentId);
      
      await api.post('/appointments/missed-action', {
        patientId: entry?.patient?.id,
        appointmentId: selectedAppointmentId,
        action: missedAction,
        newFuDate: newFuDate || undefined,
        note: missedNote || undefined
      });

      toast.success('Patient status updated successfully');
      setMissedAction('');
      setNewFuDate('');
      setMissedNote('');
      setShowCheckInModal(false);
      setSelectedAppointmentId(null);
      fetchQueue();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to update appointment status';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsSubmittingMissed(false);
    }
  };

  const sendToDoctor = async (entryId: string) => {
    setSendingIds(prev => new Set(prev).add(entryId));
    try {
      await api.patch(`/queue/${entryId}/status`, { status: 'IN_SESSION' });
      toast.success(`Patient sent to doctor!`);
      await fetchQueue();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send patient');
    } finally {
      setSendingIds(prev => { const s = new Set(prev); s.delete(entryId); return s; });
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
    // Exclude completed/ended sessions from the Dashboard View
    if (entry.status === 'COMPLETED' || entry.status === 'SESSION_ENDED') {
      return false;
    }

    let match = true;
    
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
        return `<div class="px-2 py-1 bg-orange-100 text-orange-700 rounded text-[10px] font-black uppercase tracking-widest border border-orange-200 inline-block animate-pulse">IN PROGRESS</div>`;
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
    if (sortConfig.key !== columnKey) return <span className="text-slate-300 ml-1 inline-block">↕</span>;
    return <span className="text-orange-600 ml-1 inline-block">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <ReceptionLayout>
      <div className="space-y-10 pb-20 max-w-[1600px] mx-auto px-6">
        
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
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-orange-400">Add Entry</p>
                   <p className="text-sm font-black uppercase tracking-tighter">New Patient</p>
                </div>
             </Link>
             
             <button 
                onClick={fetchStats}
                className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-orange-300 transition-all shadow-sm group"
             >
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                   <BarChart3 className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Total Today</p>
                   <p className="text-sm font-black uppercase tracking-tighter">View Statistics</p>
                </div>
             </button>
             <Link href="/reception/appointments" className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-orange-300 transition-all shadow-sm group">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                   <CalendarPlus className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Scheduling</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Book Appointment</p>
                </div>
             </Link>
             <Link href="/reception/patients/search" className="flex items-center gap-4 p-6 bg-white border border-slate-100 text-slate-800 rounded-2xl hover:border-orange-300 transition-all shadow-sm group">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                   <Search className="w-6 h-6" />
                </div>
                <div className="text-left">
                   <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 text-slate-400">Database</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Search Patient</p>
                </div>
             </Link>
          </div>
        </div>

        {/* 🔷 NOTIFICATION PANEL (LEFT ALERT BOX) */}
        <div className={`rounded-2xl p-6 shadow-xl flex items-center justify-between border-2 overflow-hidden relative group transition-colors duration-500 ${
          lastEvent?.type === 'SESSION_STARTED' 
            ? 'bg-rose-600 border-rose-500 shadow-rose-200 animate-pulse' 
            : 'bg-orange-600 border-orange-500 shadow-orange-100'
        }`}>
           <div className="absolute right-0 top-0 h-full w-32 bg-white/5 skew-x-[30deg] translate-x-16"></div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                 <BellRing className="w-6 h-6 text-white" />
              </div>
              <div>
                 <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${lastEvent?.type === 'SESSION_STARTED' ? 'text-rose-100' : 'text-orange-100'}`}>Notification</span>
                    <span className={`w-1 h-1 rounded-full ${lastEvent?.type === 'SESSION_STARTED' ? 'bg-rose-300' : 'bg-orange-300'}`}></span>
                    <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${lastEvent?.type === 'SESSION_STARTED' ? 'text-rose-200' : 'text-orange-200'}`}>Clinical Signal</span>
                 </div>
                 <h3 className="text-lg font-black text-white mt-1 uppercase tracking-tight">
                   {lastEvent?.type === 'SESSION_STARTED' ? (
                     <span>NOW CALLING: <span className="underline decoration-white underline-offset-4 font-extrabold">{lastEvent.patientName} ({lastEvent.token})</span></span>
                   ) : (
                     <span>System Ready: <span className={`${lastEvent?.type === 'SESSION_STARTED' ? 'text-rose-200 decoration-rose-300' : 'text-orange-200 decoration-orange-300'} underline underline-offset-4`}>Waiting for next patient...</span></span>
                   )}
                 </h3>
              </div>
           </div>
           <div className="flex items-center gap-4 relative z-10">
              <div className={`px-6 py-2 bg-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm ${lastEvent?.type === 'SESSION_STARTED' ? 'text-rose-700' : 'text-orange-700'}`}>
                 Queue Active: <span className={lastEvent?.type === 'SESSION_STARTED' ? 'text-rose-600' : 'text-emerald-600'}>{statsData.waiting} Patients</span>
              </div>
              <button className={`p-3 text-white rounded-xl transition-colors ${lastEvent?.type === 'SESSION_STARTED' ? 'bg-rose-800 hover:bg-rose-900' : 'bg-orange-800 hover:bg-orange-900'}`}>
                 <ArrowRight className="w-5 h-5" />
              </button>
           </div>
        </div>

        {/* 🔷 OPD QUEUE INTEGRATED */}
        <div className="space-y-6 pt-4 border-t border-slate-200">
          
          {/* Filters Header */}
          <div className="flex flex-col lg:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                  <Activity className="w-6 h-6 text-white animate-pulse" />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">OPD Queue</h1>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Live Hub</p>
               </div>
            </div>

            {/* Top Row Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 flex-1 justify-end">
               <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search patient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-[12px] font-bold text-slate-800 outline-none bg-transparent w-full"
                  />
               </div>
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
                    <option value="Missed">Missed</option>
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
                  className="p-3 bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-all shadow-sm"
               >
                  <RotateCcw className="w-5 h-5" />
               </button>
            </div>
          </div>

          {/* Legend Checkboxes */}
          <div className="flex flex-wrap items-center gap-4 px-2">
            {['Waiting', 'In Progress', 'Completed', 'Cancelled', 'Missed', 'New Patient', 'FOC'].map((legend) => {
              const isSelected = selectedLegends.includes(legend);
              return (
                <button 
                  key={legend}
                  onClick={() => toggleLegend(legend)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    isSelected 
                      ? 'bg-orange-50 border-orange-200 text-orange-800 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? <CheckSquare className="w-4 h-4 text-orange-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    {legend} {legend === 'In Progress' && '(Blinking)'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden relative min-h-[500px] flex flex-col">
             {isLoading && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 space-y-6">
                   <div className="w-16 h-16 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
                   <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Loading Queue Data...</p>
               </div>
             )}
             
             <div className="flex-1 relative overflow-auto bg-white">
               <table className="w-full text-sm text-center">
                 <thead className="text-[11px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                   <tr>
                     <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap border-r border-slate-100 last:border-0" onClick={() => handleSort('case.caseNumber')}>Case No <SortIcon columnKey="case.caseNumber" /></th>
                     <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap border-r border-slate-100 last:border-0" onClick={() => handleSort('createdAt')}>Appt Time <SortIcon columnKey="createdAt" /></th>
                     <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap border-r border-slate-100 last:border-0" onClick={() => handleSort('checkInTime')}>Check In <SortIcon columnKey="checkInTime" /></th>
                     <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap border-r border-slate-100 last:border-0" onClick={() => handleSort('patientName')}>Patient Name <SortIcon columnKey="patientName" /></th>
                     <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap border-r border-slate-100 last:border-0" onClick={() => handleSort('case.visitType')}>Visit For <SortIcon columnKey="case.visitType" /></th>
                     <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap border-r border-slate-100 last:border-0" onClick={() => handleSort('age')}>Age <SortIcon columnKey="age" /></th>
                     <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap border-r border-slate-100 last:border-0" onClick={() => handleSort('patient.gender')}>Sex <SortIcon columnKey="patient.gender" /></th>
                     <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap border-r border-slate-100 last:border-0" onClick={() => handleSort('patient.address.city')}>Address <SortIcon columnKey="patient.address.city" /></th>
                     <th className="px-4 py-4 whitespace-nowrap border-r border-slate-100 last:border-0">Billing</th>
                     <th className="px-4 py-4 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap border-r border-slate-100 last:border-0" onClick={() => handleSort('status')}>Status <SortIcon columnKey="status" /></th>
                     <th className="px-4 py-4 whitespace-nowrap">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {currentQueueData.length === 0 ? (
                     <tr>
                       <td colSpan={11} className="py-20 text-center text-slate-400">
                         <div className="flex flex-col items-center justify-center">
                           <Search className="w-12 h-12 mb-4 text-slate-300" />
                           <span className="text-sm font-bold uppercase tracking-widest">No patients found</span>
                         </div>
                       </td>
                     </tr>
                   ) : (
                     currentQueueData.map((entry, idx) => {
                       const isNew = isNewPatient(entry);
                       const isInSession = entry.status === 'IN_SESSION';
                       const rowBg = isInSession ? 'bg-orange-50/50' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30');
                       const billing = getBillingStatus(entry);

                       return (
                         <tr 
                           key={entry.id || idx} 
                           onClick={() => entry.patient?.id && router.push(`/reception/patients/${entry.patient.id}`)}
                           className={`${rowBg} hover:bg-slate-50 transition-colors cursor-pointer`}
                         >
                           <td className="px-4 py-3 whitespace-nowrap text-[12px] font-black text-slate-800 border-r border-slate-50">
                             {entry.isAppointment ? '--' : (entry.case?.caseNumber || entry.tokenDisplay)}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-[12px] font-bold text-slate-600 border-r border-slate-50">
                             {formatTime(entry.case?.createdAt)}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-[12px] font-bold text-slate-600 border-r border-slate-50">
                             {entry.checkInTime ? formatTime(entry.checkInTime) : '--'}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap border-r border-slate-50">
                             <div className={`text-[13px] font-black uppercase tracking-wider ${isInSession ? 'text-orange-600 animate-pulse' : 'text-slate-900'} flex items-center justify-center gap-2`}>
                                {entry.patient?.firstName} {entry.patient?.lastName} 
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest border ${isNew ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`}>
                                  {isNew ? 'NEW PT' : 'OLD PT'}
                                </span>
                             </div>
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-600 uppercase border-r border-slate-50">
                             {getVisitType(entry)}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-[12px] font-black text-slate-700 border-r border-slate-50">
                             {entry.patient?.profile?.age || '--'}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-[12px] font-black text-slate-700 border-r border-slate-50">
                             {entry.patient?.gender ? entry.patient.gender.charAt(0).toUpperCase() : 'U'}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-[12px] font-bold text-slate-600 uppercase border-r border-slate-50">
                             {entry.patient?.address?.city || '--'}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap border-r border-slate-50">
                             {billing === 'FOC' ? (
                               <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-black uppercase tracking-widest border border-blue-200">FOC</span>
                             ) : billing === 'PAID' ? (
                               <span className="text-[11px] font-black text-slate-600 uppercase">PAID</span>
                             ) : (
                               <span className="text-[11px] font-black text-rose-600 uppercase">PENDING</span>
                             )}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap border-r border-slate-50">
                             <div dangerouslySetInnerHTML={{ __html: getStatusBadgeString(entry.status) }} />
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-center">
                             {entry.isAppointment ? (
                               <button 
                                 onClick={(e) => { e.stopPropagation(); setSelectedAppointmentId(entry.appointmentId); setShowCheckInModal(true); }}
                                 className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm transition-all border border-indigo-200"
                               >
                                 Mark Arrived
                               </button>
                             ) : (
                               <button 
                                 onClick={(e) => { e.stopPropagation(); sendToDoctor(entry.id); }}
                                 disabled={sendingIds.has(entry.id) || isInSession}
                                 className="px-4 py-2 bg-slate-900 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm transition-all flex items-center gap-2 mx-auto group"
                               >
                                 {sendingIds.has(entry.id) ? (
                                   <>
                                     <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                     Sending...
                                   </>
                                 ) : isInSession ? (
                                   'In Session'
                                 ) : (
                                   <>
                                     Send to Doctor <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                   </>
                                 )}
                               </button>
                             )}
                           </td>
                         </tr>
                       );
                     })
                   )}
                 </tbody>
               </table>
             </div>

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

      {showCheckInModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-xl font-black text-slate-800 tracking-tighter">Patient Status</h3>
              <button onClick={() => setShowCheckInModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex border-b border-slate-200">
              <button 
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'check-in' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                onClick={() => setActiveTab('check-in')}
              >
                Check-In (Vitals)
              </button>
              <button 
                className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'missed' ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                onClick={() => setActiveTab('missed')}
              >
                Missed / No-Show
              </button>
            </div>

            {activeTab === 'check-in' && (
              <>
                <div className="p-6 overflow-y-auto space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Temperature (°F)</label>
                      <input type="number" placeholder="98.6" value={vitals.temp} onChange={e => setVitals({...vitals, temp: e.target.value})} className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Pulse Rate (BPM)</label>
                      <input type="number" placeholder="72" value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value})} className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">BP Systolic (mmHg)</label>
                      <input type="number" placeholder="120" value={vitals.bpSys} onChange={e => setVitals({...vitals, bpSys: e.target.value})} className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">BP Diastolic (mmHg)</label>
                      <input type="number" placeholder="80" value={vitals.bpDia} onChange={e => setVitals({...vitals, bpDia: e.target.value})} className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Height (cm)</label>
                      <input type="number" placeholder="170" value={vitals.height} onChange={e => setVitals({...vitals, height: e.target.value})} className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Body Weight (Kg)</label>
                      <input type="number" placeholder="70" value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">SPO2 Oxygen (%)</label>
                      <input type="number" placeholder="98" value={vitals.spo2} onChange={e => setVitals({...vitals, spo2: e.target.value})} className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Auto-Calc BMI</label>
                      <div className="w-full px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl mt-1 font-black text-slate-700 flex items-center h-[38px]">
                        {vitals.height && vitals.weight ? (Number(vitals.weight) / Math.pow(Number(vitals.height) / 100, 2)).toFixed(1) : '--'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
                  <button onClick={() => submitCheckIn(true)} className="px-6 py-3 bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 rounded-xl text-sm font-black uppercase tracking-widest flex-1 transition-all">
                    Skip Vitals
                  </button>
                  <button onClick={() => submitCheckIn(false)} className="px-6 py-3 bg-orange-600 text-white shadow-xl shadow-orange-600/20 hover:bg-orange-700 rounded-xl text-sm font-black uppercase tracking-widest flex-1 transition-all">
                    Save & Check In
                  </button>
                </div>
              </>
            )}

            {activeTab === 'missed' && (
              <>
                <div className="p-6 overflow-y-auto space-y-5">
                  <div className="grid grid-cols-1 gap-3">
                     <button 
                       onClick={() => setMissedAction('reschedule')}
                       className={`border p-4 rounded-xl text-left text-sm transition-all ${missedAction === 'reschedule' ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold ring-4 ring-blue-500/10' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-semibold'}`}
                     >
                        <div className="mb-1">Called - Rescheduled</div>
                        <div className="text-[10px] font-normal opacity-70">Requires new date</div>
                     </button>
                     <button 
                       onClick={() => setMissedAction('no-answer')}
                       className={`border p-4 rounded-xl text-left text-sm transition-all ${missedAction === 'no-answer' ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold ring-4 ring-amber-500/10' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-semibold'}`}
                     >
                        <div className="mb-1">Called - No Answer</div>
                        <div className="text-[10px] font-normal opacity-70">Auto-notes failure</div>
                     </button>
                     <button 
                       onClick={() => setMissedAction('not-called')}
                       className={`border p-4 rounded-xl text-left text-sm transition-all ${missedAction === 'not-called' ? 'bg-slate-100 border-slate-300 text-slate-800 font-bold ring-4 ring-slate-500/10' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-semibold'}`}
                     >
                        <div className="mb-1">Not Called / Cancelled</div>
                        <div className="text-[10px] font-normal opacity-70">Patient cancelled or no action taken</div>
                     </button>
                  </div>
                  
                  {(missedAction === 'reschedule' || missedAction === 'no-answer' || missedAction === 'not-called') && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-5 p-5 bg-slate-50 rounded-xl border border-slate-100">
                           {missedAction === 'reschedule' && (
                             <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">New F/U Date</label>
                                <input type="date" value={newFuDate} onChange={(e) => setNewFuDate(e.target.value)} className="w-full border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all" />
                             </div>
                           )}
                           <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase">Internal Note (Optional)</label>
                              <input type="text" placeholder="Add details..." value={missedNote} onChange={(e) => setMissedNote(e.target.value)} className="w-full border border-slate-200 bg-white rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all" />
                           </div>
                        </div>
                      </div>
                  )}
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4">
                   <button 
                     onClick={handleMissedActionSubmit}
                     disabled={isSubmittingMissed || !missedAction}
                     className="bg-slate-900 text-white font-black uppercase tracking-widest py-3 px-8 text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
                   >
                     {isSubmittingMissed ? 'Saving...' : 'Save Update'}
                   </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </ReceptionLayout>
  );
};

export default ReceptionDashboardView;
