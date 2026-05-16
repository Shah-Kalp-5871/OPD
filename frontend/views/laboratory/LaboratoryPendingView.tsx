'use client';

import React, { useState, useEffect } from 'react';
import LaboratoryLayout from '@/views/layouts/LaboratoryLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  TestTube2, 
  Search, 
  Clock, 
  User, 
  ArrowRight, 
  AlertCircle,
  MoreVertical,
  FlaskConical,
  Dna,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  FileUp
} from 'lucide-react';
import Link from 'next/link';

const LaboratoryPendingView = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/laboratory/pending');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending investigations');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.patientCase?.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.patientCase?.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ORDERED': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'SAMPLE_COLLECTED': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'PROCESSING': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <LaboratoryLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Laboratory Queue</h1>
            <p className="text-slate-500 font-bold mt-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              {orders.length} active investigations pending processing
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search patient or Order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold w-full md:w-80 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                />
             </div>
             <button 
               onClick={fetchPendingOrders}
               className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
             >
               {loading ? <Loader2 className="w-6 h-6 animate-spin text-blue-600" /> : <RefreshCcw className="w-6 h-6 text-slate-600" />}
             </button>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 gap-4">
           {loading ? (
             <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Scanning Diagnostic Queue...</p>
             </div>
           ) : filteredOrders.length === 0 ? (
             <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <FlaskConical className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest">Diagnostic queue is currently empty</p>
             </div>
           ) : filteredOrders.map((order) => (
             <div key={order.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
                {/* Status Bar */}
                <div className={`absolute top-0 left-0 w-2 h-full ${
                  order.status === 'ORDERED' ? 'bg-amber-400' : 
                  order.status === 'SAMPLE_COLLECTED' ? 'bg-blue-400' : 'bg-indigo-400'
                }`}></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                   {/* Patient Info */}
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
                         <User className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div>
                         <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-slate-900 uppercase">
                               {order.patientCase?.patient?.firstName} {order.patientCase?.patient?.lastName}
                            </h3>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                               {order.status.replace('_', ' ')}
                            </span>
                         </div>
                         <div className="flex items-center gap-4 mt-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                               ID: <span className="text-slate-600">{order.id.split('-')[0]}</span>
                            </p>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                               AGE: <span className="text-slate-600">{order.patientCase?.patient?.age || 'N/A'} Y</span>
                            </p>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                               GENDER: <span className="text-slate-600">{order.patientCase?.patient?.gender}</span>
                            </p>
                         </div>
                      </div>
                   </div>

                   {/* Investigation Summary */}
                   <div className="flex-1 md:max-w-md">
                      <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                         <div className="flex items-center gap-3">
                            <Dna className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-bold text-slate-700">Investigations Ordered</span>
                         </div>
                         <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-blue-600">
                            {order.results?.length || 0} ITEMS
                         </span>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="flex items-center gap-3">
                      {order.status === 'ORDERED' && (
                        <button 
                          onClick={() => {/* Update to SAMPLE_COLLECTED */}}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                        >
                           COLLECT SAMPLE
                        </button>
                      )}
                      
                      <Link 
                        href={`/laboratory/process/${order.id}`}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                      >
                         PROCESS RESULTS
                         <ArrowRight className="w-4 h-4" />
                      </Link>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </LaboratoryLayout>
  );
};

export default LaboratoryPendingView;
