'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MedicalLayout from '@/views/layouts/MedicalLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  ArrowRight,
  ClipboardList,
  Clock,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const DispensingQueueView = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [queueData, setQueueData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await api.get('/pharmacy/queue');
      setQueueData(response.data || []);
    } catch (error) {
      toast.error('Failed to load dispensing queue');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQueue = queueData.filter(item => {
    const patientName = `${item.case?.patient?.firstName || ''} ${item.case?.patient?.lastName || ''}`.trim();
    const mrd = item.case?.patient?.mrdNumber || '';
    const caseId = item.caseId || '';
    
    const searchLower = searchQuery.toLowerCase();
    
    return patientName.toLowerCase().includes(searchLower) || 
           mrd.toLowerCase().includes(searchLower) ||
           caseId.toLowerCase().includes(searchLower);
  });

  const handleRowClick = (caseId: string) => {
    router.push(`/medical/dispensing/${caseId}`);
  };

  const pendingCount = queueData.filter(i => i.status === 'PHARMACY_PENDING').length;
  const inProgressCount = queueData.filter(i => i.status === 'PHARMACY_IN_PROGRESS').length;

  return (
    <MedicalLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dispensing Hub</h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Search patients and fulfill prescriptions</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by Patient Name, MRD, or Case ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-[12px] font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all w-[350px] shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Prescriptions</h3>
              <p className="text-2xl font-black text-slate-800 tracking-tight mt-1">{pendingCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Progress</h3>
              <p className="text-2xl font-black text-slate-800 tracking-tight mt-1">{inProgressCount}</p>
            </div>
          </div>
        </div>

        {/* Queue Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                   <ClipboardList className="w-5 h-5" />
                </div>
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Active Prescriptions</h2>
              </div>
              <button onClick={fetchQueue} className="text-slate-400 hover:text-emerald-600 transition-colors">
                <ArrowRight className="w-5 h-5 transform rotate-45" /> {/* Use as a refresh icon proxy for now */}
              </button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">MRD / Case ID</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-16 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading prescriptions...</p>
                        </td>
                      </tr>
                    ) : filteredQueue.map((row, idx) => {
                      const patientName = `${row.case?.patient?.firstName || ''} ${row.case?.patient?.lastName || ''}`.trim();
                      const mrd = row.case?.patient?.mrdNumber || '--';
                      
                      // Count total drugs across all active prescriptions for this case
                      let totalDrugs = 0;
                      if (row.case?.prescriptions) {
                        row.case.prescriptions.forEach((p: any) => {
                          totalDrugs += p.items?.length || 0;
                        });
                      }

                      const time = new Date(row.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                      
                      return (
                      <tr 
                        key={row.id} 
                        onClick={() => handleRowClick(row.caseId)}
                        className="group hover:bg-emerald-50/30 transition-colors cursor-pointer"
                      >
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-[12px] group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                  {patientName ? patientName[0] : 'P'}
                               </div>
                               <div>
                                 <span className="block text-[14px] font-black text-slate-800 tracking-tight">{patientName || 'Unknown Patient'}</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                           <div className="space-y-1">
                             <div className="text-[11px] font-black text-slate-600 uppercase tracking-wider">{mrd}</div>
                             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.caseId}</div>
                           </div>
                         </td>
                         <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600">{totalDrugs}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drugs</span>
                            </div>
                         </td>
                         <td className="px-6 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{time}</td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-4">
                               <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                  row.status === 'PHARMACY_PENDING' 
                                  ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                  : 'bg-blue-50 text-blue-600 border-blue-100'
                               }`}>
                                  {row.status.replace('PHARMACY_', '')}
                               </span>
                               <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-all shadow-sm">
                                  <ArrowRight className="w-4 h-4" />
                               </div>
                            </div>
                         </td>
                      </tr>
                    )})}
                    
                    {!isLoading && filteredQueue.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-16 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-50 text-slate-300 mb-4">
                            <Search className="w-8 h-8" />
                          </div>
                          <h3 className="text-sm font-black text-slate-800 tracking-tight">No Prescriptions Found</h3>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">The queue is currently empty</p>
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </MedicalLayout>
  );
};

export default DispensingQueueView;
