'use client';

import React, { useState, useEffect } from 'react';
import PharmacyLayout from '@/views/layouts/PharmacyLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  ClipboardList, 
  Search, 
  User, 
  Clock, 
  AlertCircle,
  Pill,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

const PharmacyQueueView = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQueue();
    // In a real app, setup SSE here
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pharmacy/queue');
      setQueue(response.data);
    } catch (error) {
      toast.error('Failed to fetch pharmacy queue');
    } finally {
      setLoading(false);
    }
  };

  const filteredQueue = queue.filter(item => 
    item.patientCase?.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.patientCase?.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.patientCase?.tokenDisplay?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PharmacyLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Pharmacy Queue</h1>
            <p className="text-slate-500 font-bold mt-2 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-500" />
              {queue.length} patients waiting for medication
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by name or token..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold w-full md:w-80 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
                />
             </div>
             <button 
               onClick={fetchQueue}
               className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
             >
               {loading ? <Loader2 className="w-6 h-6 animate-spin text-emerald-600" /> : <Clock className="w-6 h-6 text-slate-600" />}
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="relative z-10">
                 <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                    <Clock className="w-7 h-7 text-emerald-600" />
                 </div>
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Average Wait Time</p>
                 <h3 className="text-3xl font-black text-slate-900 mt-2">12 <span className="text-lg text-slate-400">mins</span></h3>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="relative z-10">
                 <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                    <Pill className="w-7 h-7 text-blue-600" />
                 </div>
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Pending Prescriptions</p>
                 <h3 className="text-3xl font-black text-slate-900 mt-2">{queue.length}</h3>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="relative z-10">
                 <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                    <AlertCircle className="w-7 h-7 text-amber-600" />
                 </div>
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Stock Alerts</p>
                 <h3 className="text-3xl font-black text-slate-900 mt-2">4 <span className="text-lg text-slate-400">items</span></h3>
              </div>
           </div>
        </div>

        {/* Queue Table */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient / Token</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Doctor / Branch</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prescription</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Waiting</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Pharmacy Queue...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                        <ClipboardList className="w-10 h-10 text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No pending prescriptions found</p>
                    </div>
                  </td>
                </tr>
              ) : filteredQueue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-200">
                        {item.tokenDisplay}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase">
                          {item.patientCase?.patient?.firstName} {item.patientCase?.patient?.lastName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {item.patientCase?.patient?.gender} / {item.patientCase?.patient?.age} Yrs
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Dr. {item.patientCase?.doctor?.user?.firstName} {item.patientCase?.doctor?.user?.lastName}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Main OPD</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                       <Pill className="w-4 h-4 text-emerald-500" />
                       <span className="text-sm font-bold text-slate-700">
                         {item.patientCase?.prescriptions?.[0]?.items?.length || 0} Medications
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-sm font-bold text-slate-500">
                    {Math.floor((new Date().getTime() - new Date(item.updatedAt).getTime()) / (1000 * 60))} mins
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      item.status === 'PHARMACY_PENDING' 
                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <Link 
                      href={`/pharmacy/dispense/${item.caseId}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                    >
                      Dispense
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PharmacyLayout>
  );
};

export default PharmacyQueueView;
