'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  PhoneCall, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Smartphone, 
  ClipboardList,
  Info
} from 'lucide-react';
import api from '@/lib/api';

const ReceptionFollowupView = () => {
  const [selectedOutcome, setSelectedOutcome] = useState('Rescheduled');
  const [selectedFollowup, setSelectedFollowup] = useState<any>(null);
  const [followUpQueue, setFollowUpQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowups();
  }, []);

  const fetchFollowups = async () => {
    try {
      const res = await api.get('/followups/pending');
      const followups = res.data.data || [];
      setFollowUpQueue(followups);
      if (followups.length > 0) {
        setSelectedFollowup(followups[0]);
      }
    } catch (err) {
      console.error('Error fetching followups', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedFollowup) return;
    
    let status = 'SCHEDULED';
    if (selectedOutcome === 'Rescheduled') status = 'RESCHEDULED';
    if (selectedOutcome === 'NoAnswer') status = 'MISSED';
    if (selectedOutcome === 'DoNotCall') status = 'CANCELLED';

    const outcomeLabels: any = {
      Rescheduled: 'Called & Appointment Rescheduled',
      NoAnswer: 'Call not answered - F/U Missed',
      DoNotCall: 'Do Not Call (Patient Request)',
      UnableReach: 'Unable to Reach',
    };

    try {
      await api.patch(`/followups/${selectedFollowup.id}/status`, {
        status,
        callOutcome: outcomeLabels[selectedOutcome]
      });
      
      alert('Call log saved successfully');
      fetchFollowups();
    } catch (err) {
      console.error('Failed to save log', err);
      alert('Failed to save log');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'MISSED': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'RESCHEDULED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'SCHEDULED': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const outcomeOptions = [
    { id: 'Rescheduled', label: 'Called & Appointment Rescheduled', icon: CheckCircle2 },
    { id: 'NoAnswer', label: 'Called — No Answer (F/U Missed)', icon: AlertCircle },
    { id: 'DoNotCall', label: 'Do Not Call (Patient Request)', icon: XCircle },
    { id: 'UnableReach', label: 'Unable to Reach', icon: Info },
  ];

  return (
    <ReceptionLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-32 animate-in fade-in duration-500">
        
        {/* 🔷 PAGE HEADER */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                 <PhoneCall className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Follow-Up Booking & Mgmt</h1>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1.5 ml-1">Forwarded by Doctor Coordination Team</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active F/U</p>
                 <p className="text-xl font-black text-slate-800">{followUpQueue.length} Patients</p>
              </div>
           </div>
        </div>

        {/* 🔷 FOLLOW-UP TABLE SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">MRD</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">F/U Type</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading...</td></tr>
                    ) : followUpQueue.map((row) => (
                      <tr 
                        key={row.id} 
                        onClick={() => setSelectedFollowup(row)}
                        className={`group cursor-pointer transition-all ${selectedFollowup?.id === row.id ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'}`}
                      >
                         <td className="px-6 py-6">
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${selectedFollowup?.id === row.id ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-400'}`}>
                                  {row.patientCase?.patient?.firstName?.[0] || '?'}
                               </div>
                               <span className="text-[13px] font-black text-slate-800 tracking-tight">{row.patientCase?.patient?.firstName} {row.patientCase?.patient?.lastName}</span>
                            </div>
                         </td>
                         <td className="px-6 py-6 text-[11px] font-bold text-slate-400 tracking-wider uppercase">{row.patientCase?.patient?.mrdNumber}</td>
                         <td className="px-6 py-6">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{row.reason || 'Follow-Up'}</span>
                         </td>
                         <td className="px-6 py-6 text-[11px] font-black text-slate-600">{new Date(row.dueDate).toLocaleDateString()}</td>
                         <td className="px-6 py-6">
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(row.status)}`}>
                               {row.status}
                            </span>
                         </td>
                      </tr>
                    ))}
                    {followUpQueue.length === 0 && !loading && (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-400">No pending follow-ups</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        {/* 🔷 CALL OUTCOME LOGGING SECTION */}
        {selectedFollowup && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mt-8">
             <div className="p-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4 text-white">
                   <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-white" />
                   </div>
                   <div>
                      <h2 className="text-xs font-black uppercase tracking-[0.2em]">Log Call Outcome</h2>
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1">Patient: {selectedFollowup.patientCase?.patient?.firstName}</p>
                   </div>
                </div>
             </div>

             <div className="p-10 space-y-10">
                {/* Call Outcome Options */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Call Outcome:</label>
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {outcomeOptions.map((opt) => (
                        <button 
                          key={opt.id}
                          onClick={() => setSelectedOutcome(opt.id)}
                          className={`p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-4 shadow-sm ${
                            selectedOutcome === opt.id 
                            ? 'border-blue-600 bg-blue-50 shadow-blue-100' 
                            : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                          }`}
                        >
                           <opt.icon className={`w-6 h-6 ${selectedOutcome === opt.id ? 'text-blue-600' : 'text-slate-400'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest leading-tight ${selectedOutcome === opt.id ? 'text-blue-900' : 'text-slate-500'}`}>
                              {opt.label}
                           </span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-end gap-4 pt-6 border-t border-slate-100">
                   <button onClick={handleSave} className="w-full md:w-auto px-16 py-5 bg-blue-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3">
                      <CheckCircle2 className="w-4 h-4" />
                      SAVE CALL LOG
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </ReceptionLayout>
  );
};

export default ReceptionFollowupView;
