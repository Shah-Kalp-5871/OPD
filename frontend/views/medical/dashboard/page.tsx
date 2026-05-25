'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MedicalLayout from '@/views/layouts/MedicalLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  ClipboardList, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  PackageSearch,
  Activity,
  Archive,
  ShoppingCart,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Plus,
  Loader2
} from 'lucide-react';

const MedicalDashboardView = () => {
  const router = useRouter();
  
  const [queueData, setQueueData] = useState<any[]>([]);
  const [alertsData, setAlertsData] = useState<{lowStock: any[], nearExpiry: any[], expired: any[]}>({
    lowStock: [], nearExpiry: [], expired: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [queueRes, alertsRes] = await Promise.all([
        api.get('/pharmacy/queue'),
        api.get('/pharmacy/inventory/alerts')
      ]);
      setQueueData(queueRes.data || []);
      setAlertsData(alertsRes.data || { lowStock: [], nearExpiry: [], expired: [] });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingCount = queueData.filter(i => i.status === 'PHARMACY_PENDING').length;
  // Normally dispensed count would come from a different endpoint (e.g. daily stats), 
  // but we'll use a placeholder for 'Drugs Taken Today' for now until that endpoint exists
  const dispensedCount = 0; 
  
  const outOfStockCount = alertsData.lowStock.filter((i: any) => i.totalStock === 0).length;

  const summaryStats = [
    { label: 'Pending Dispensing', value: pendingCount.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Drugs Taken Today', value: dispensedCount.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Not Taken', value: '0', icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-50' },
    { label: 'Out of Stock', value: outOfStockCount.toString(), icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  // Combine alerts into a single array for the table
  const allAlerts = [
    ...alertsData.expired.map(item => ({
      name: item.inventory?.drug?.drugName || 'Unknown',
      stock: item.stockQuantity,
      min: item.inventory?.reorderLevel || 0,
      status: 'EXPIRED',
      expiry: new Date(item.expiryDate).toLocaleDateString(),
      action: 'Dispose'
    })),
    ...alertsData.lowStock.map(item => ({
      name: item.drugName || 'Unknown',
      stock: item.totalStock,
      min: item.reorderLevel,
      status: item.totalStock === 0 ? 'OUT OF STOCK' : 'LOW STOCK',
      expiry: '-',
      action: 'Restock'
    })),
    ...alertsData.nearExpiry.map(item => ({
      name: item.inventory?.drug?.drugName || 'Unknown',
      stock: item.stockQuantity,
      min: item.inventory?.reorderLevel || 0,
      status: 'NEAR EXPIRY',
      expiry: new Date(item.expiryDate).toLocaleDateString(),
      action: 'Prioritize'
    }))
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LOW STOCK': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'OUT OF STOCK': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'EXPIRED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'NEAR EXPIRY': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Normal': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Sample Low': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'PHARMACY_PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'PHARMACY_IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <MedicalLayout>
      <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
        
        {/* 🔷 TOP SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {summaryStats.map((stat, idx) => (
             <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-20 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
                <div className="flex items-center justify-between mb-6">
                   <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} shadow-inner`}>
                      <stat.icon className="w-7 h-7" />
                   </div>
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h3>
                <p className="text-4xl font-black text-slate-800 tracking-tight">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : stat.value}
                </p>
             </div>
           ))}
        </div>

        {/* 🔷 DRUG STOCK ALERTS SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4 text-white">
                 <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <PackageSearch className="w-5 h-5 text-white" />
                 </div>
                 <h2 className="text-xs font-black uppercase tracking-[0.2em]">Drug Stock Alerts</h2>
              </div>
              <button onClick={fetchDashboardData} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                 Refresh Inventory
              </button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Drug Name</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Min Alert</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-12 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Checking inventory...</p>
                        </td>
                      </tr>
                    ) : allAlerts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-12 text-center">
                          <h3 className="text-sm font-black text-slate-800 tracking-tight">No Alerts</h3>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Inventory is healthy</p>
                        </td>
                      </tr>
                    ) : allAlerts.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <span className="text-[13px] font-black text-slate-800 tracking-tight">{row.name}</span>
                         </td>
                          <td className="px-6 py-6">
                             <span className={`text-[13px] font-black ${row.stock === 0 ? 'text-rose-600' : (typeof row.min === 'number' && row.stock < row.min) ? 'text-amber-600' : 'text-slate-600'}`}>{row.stock}</span>
                          </td>
                         <td className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{row.min}</td>
                         <td className="px-6 py-6">
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(row.status)}`}>
                               {row.status}
                            </span>
                         </td>
                         <td className="px-6 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">{row.expiry}</td>
                         <td className="px-8 py-6 text-right">
                            {row.action !== '-' ? (
                               <button 
                                onClick={() => router.push('/medical/stock')}
                                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${
                                  row.action === 'Restock' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                               }`}>
                                  {row.action}
                               </button>
                            ) : (
                               <span className="text-slate-200">—</span>
                            )}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* 🔷 TODAY'S PRESCRIPTION QUEUE SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <ClipboardList className="w-5 h-5" />
                 </div>
                 <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Today's Prescription Queue</h2>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Updates Enabled</span>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">MRD</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case ID</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Drugs Prescribed</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading queue...</p>
                        </td>
                      </tr>
                    ) : queueData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-12 text-center">
                          <h3 className="text-sm font-black text-slate-800 tracking-tight">No Active Prescriptions</h3>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">The queue is empty</p>
                        </td>
                      </tr>
                    ) : queueData.slice(0, 5).map((row, idx) => {
                      const patientName = `${row.case?.patient?.firstName || ''} ${row.case?.patient?.lastName || ''}`.trim();
                      
                      // Extract drug names
                      let drugNames: string[] = [];
                      if (row.case?.prescriptions) {
                        row.case.prescriptions.forEach((p: any) => {
                          if (p.items) {
                            p.items.forEach((item: any) => {
                              if (item.drug?.drugName) drugNames.push(item.drug.drugName);
                            });
                          }
                        });
                      }
                      
                      const drugsString = drugNames.slice(0, 3).join(', ') + (drugNames.length > 3 ? ` +${drugNames.length - 3} more` : '');

                      return (
                      <tr 
                        key={row.id} 
                        onClick={() => router.push(`/medical/dispensing/${row.caseId}`)}
                        className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                      >
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px] group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                  {patientName ? patientName[0] : 'P'}
                               </div>
                               <span className="text-[13px] font-black text-slate-800 tracking-tight">{patientName || 'Unknown Patient'}</span>
                            </div>
                         </td>
                         <td className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{row.case?.patient?.mrdNumber || '--'}</td>
                         <td className="px-6 py-6 text-[11px] font-black text-slate-600 tracking-wider uppercase">{row.caseId}</td>
                         <td className="px-6 py-6">
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed max-w-xs truncate">{drugsString || 'None'}</p>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                               <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(row.status)}`}>
                                  {row.status.replace('PHARMACY_', '')}
                               </span>
                               <button className="p-2 text-slate-200 group-hover:text-emerald-600 transition-colors">
                                  <ArrowRight className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    )})}
                 </tbody>
              </table>
           </div>

           {/* Footer Action */}
           <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => router.push('/medical/dispensing')}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
              >
                 View Full Queue
                 <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
           </div>
        </div>

      </div>
    </MedicalLayout>
  );
};

export default MedicalDashboardView;
