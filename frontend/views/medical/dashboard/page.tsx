'use client';

import React from 'react';
import MedicalLayout from '@/views/layouts/MedicalLayout';
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
  Plus
} from 'lucide-react';

const MedicalDashboardView = () => {
  const summaryStats = [
    { label: 'Pending Dispensing', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Drugs Taken Today', value: '28', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Not Taken', value: '6', icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-50' },
    { label: 'Out of Stock', value: '3', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const stockAlerts = [
    { name: 'Tab Fluconazole 400mg', stock: 6, min: 10, status: 'LOW STOCK', expiry: '12/2026', action: 'Restock' },
    { name: 'Cream Monpic', stock: 3, min: 5, status: 'LOW STOCK', expiry: '08/2026', action: 'Restock' },
    { name: 'Syp Zentel', stock: 0, min: 8, status: 'OUT OF STOCK', expiry: '-', action: 'Mark Unavailable' },
    { name: 'Tab Dolo 650mg', stock: 45, min: 20, status: 'Normal', expiry: '06/2027', action: '-' },
    { name: '(S) Tab Levocetrizine', stock: 2, min: '-', status: 'Sample Low', expiry: '-', action: 'Update Stock' },
  ];

  const prescriptionQueue = [
    { patient: 'Mahesh K. Kumar', mrd: 'P03-260003', case: 'C003-001-130426', drugs: 'Tab Dolo, Syp Zentel, Cream Monpic', status: 'Pending' },
    { patient: 'Sneha R. Shah', mrd: 'P03-260002', case: 'C002-001-130426', drugs: '(S) Levocetrizine', status: 'Pending' },
    { patient: 'Priya N. Desai', mrd: 'P03-260004', case: 'C004-001-130426', drugs: 'Tab Fluconazole', status: 'Dispensed' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LOW STOCK': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'OUT OF STOCK': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Normal': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Sample Low': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Dispensed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
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
                <p className="text-4xl font-black text-slate-800 tracking-tight">{stat.value}</p>
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
              <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                 <RefreshCw className="w-4 h-4" />
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
                    {stockAlerts.map((row, idx) => (
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
                               <button className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${
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
                    {prescriptionQueue.map((row, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px]">
                                  {row.patient[0]}
                               </div>
                               <span className="text-[13px] font-black text-slate-800 tracking-tight">{row.patient}</span>
                            </div>
                         </td>
                         <td className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{row.mrd}</td>
                         <td className="px-6 py-6 text-[11px] font-black text-slate-600 tracking-wider uppercase">{row.case}</td>
                         <td className="px-6 py-6">
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed max-w-xs">{row.drugs}</p>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                               <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(row.status)}`}>
                                  {row.status}
                               </span>
                               <button className="p-2 text-slate-200 hover:text-emerald-600 transition-colors">
                                  <ArrowRight className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Footer Action */}
           <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
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
