'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
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
  X
} from 'lucide-react';
import CheckInModal from '../components/CheckInModal';

const OpdQueueView = () => {
  const router = useRouter();
  const [queue, setQueue] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, checkedIn: 0, waiting: 0, completed: 0, cancelled: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  
  // New Filters
  const [queueTab, setQueueTab] = useState<'current' | 'completed'>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  const [purposeFilter, setPurposeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [ageRangeFilter, setAgeRangeFilter] = useState<string>('All');
  
  // Check-In Modal
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedCheckInPatient, setSelectedCheckInPatient] = useState<any>(null);
  const [selectedCheckInAppt, setSelectedCheckInAppt] = useState<string | undefined>(undefined);

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

  const [appointmentsQueue, setAppointmentsQueue] = useState<any[]>([]);

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
      setStats(sseStats);
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
          tokenNumber: 9999,
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
    const isCompleted = entry.status === 'COMPLETED' || entry.status === 'SESSION_ENDED';
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
      <div className="max-w-[1600px] mx-auto space-y-6 pb-20 px-6">
        
        {/* Modern Top Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                <Activity className="w-6 h-6 text-white animate-pulse" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">OPD Queue Control</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Daily Visit Management</p>
             </div>
          </div>

          {/* TABS */}
          <div className="flex items-center gap-6 border-b border-slate-200 px-2 mt-4">
             <button 
               onClick={() => setQueueTab('current')}
               className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all border-b-4 ${
                 queueTab === 'current' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-400 hover:text-slate-600'
               }`}
             >
               Current Queue
             </button>
             <button 
               onClick={() => setQueueTab('completed')}
               className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all border-b-4 ${
                 queueTab === 'completed' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-600'
               }`}
             >
               Completed
             </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 flex-1 justify-end mt-4">
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
                className="ml-2 flex items-center justify-center p-2 bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 rounded-xl transition-all shadow-sm"
                title="Reset Filters"
             >
                <Square className="w-5 h-5 opacity-50 absolute" />
                <span className="text-[10px] font-black uppercase px-2 z-10 relative">Reset</span>
             </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 px-2">
          {['Waiting', 'In Progress', 'Completed', 'Cancelled', 'New Patient', 'FOC'].map((legend) => {
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

        {/* Main Table Area */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden relative min-h-[500px] flex flex-col">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 space-y-6 min-h-[400px]">
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
                        <td className="px-4 py-3 whitespace-nowrap border-r border-slate-50" dangerouslySetInnerHTML={{ __html: getStatusBadgeString(entry.status) }} />
                        <td className="px-4 py-3 whitespace-nowrap">
                           {entry.isAppointment ? (
                             <button 
                               onClick={(e) => { 
                                 e.stopPropagation(); 
                                 setSelectedCheckInPatient(entry.patient);
                                 setSelectedCheckInAppt(entry.appointmentId);
                                 setIsCheckInModalOpen(true);
                               }}
                               className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm transition-all border border-indigo-200"
                             >
                               Mark Arrived
                             </button>
                           ) : entry.status === 'WAITING' ? (
                             <button 
                               disabled={sendingIds.has(entry.id)}
                               onClick={async (e) => {
                                 e.stopPropagation();
                                 const entryId = entry.id;
                                 setSendingIds(prev => new Set(prev).add(entryId));
                                 try {
                                   await api.patch(`/queue/${entryId}/status`, { status: 'IN_SESSION' });
                                   toast.success(`${entry.patient?.firstName} sent to doctor!`);
                                   await fetchQueue();
                                 } catch (err: any) {
                                   toast.error(err?.response?.data?.message || 'Failed to send patient');
                                 } finally {
                                   setSendingIds(prev => { const s = new Set(prev); s.delete(entryId); return s; });
                                 }
                               }}
                               className="px-4 py-2 bg-slate-900 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-wait rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm transition-all"
                             >
                               {sendingIds.has(entry.id) ? 'Sending...' : 'Send to Doctor'}
                             </button>
                           ) : (
                            <Link 
                              href={`/opd/reception/patients/${entry.patient?.id}`} 
                              onClick={(e) => e.stopPropagation()}
                              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-orange-600 hover:border-orange-200 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all inline-block shadow-sm"
                            >
                              View Profile
                            </Link>
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

    {/* Check In Modal */}
    <CheckInModal 
      isOpen={isCheckInModalOpen}
      onClose={() => {
        setIsCheckInModalOpen(false);
        setSelectedCheckInPatient(null);
        setSelectedCheckInAppt(undefined);
      }}
      patient={selectedCheckInPatient}
      appointmentId={selectedCheckInAppt}
      onSuccess={() => fetchQueue()}
    />

    </ReceptionLayout>
  );
};

export default OpdQueueView;