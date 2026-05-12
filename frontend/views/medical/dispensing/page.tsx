'use client';

import React, { useState } from 'react';
import MedicalLayout from '@/views/layouts/MedicalLayout';
import { 
  Pill, 
  User, 
  ClipboardList, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Smartphone, 
  ArrowRight,
  PackageCheck,
  Ban,
  Database,
  UserCircle
} from 'lucide-react';

const MedicalDispensingView = () => {
  const [dispenseStatus, setDispenseStatus] = useState<Record<number, string>>({
    1: 'Taken',
    3: 'Pending',
    4: 'Pending'
  });

  const rxList = [
    { id: 1, rx: '1', name: 'Tab Dolo 650mg', form: 'Tablet', qty: '15', cost: 12, total: 180 },
    { id: 2, rx: '2', name: 'Syp Albendazole (Zentel)', form: 'Syrup', qty: '4 doses', cost: 8, total: 32, unavailable: true },
    { id: 3, rx: '3', name: 'Cream Clotrimazole (Monpic)', form: 'Cream', qty: '1 tube', cost: 25, total: 25 },
    { id: 4, rx: '4', name: '(S) Tab Levocetrizine', form: 'Tablet', qty: '7 tabs', cost: 0, total: 0 },
  ];

  const getStatusBadge = (id: number, unavailable?: boolean) => {
    if (unavailable) return 'bg-rose-50 text-rose-600 border-rose-100';
    const status = dispenseStatus[id];
    switch (status) {
      case 'Taken': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Not Taken': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Pending': return 'bg-slate-50 text-slate-400 border-slate-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <MedicalLayout>
      <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
        
        {/* 🔷 PAGE HEADER - PATIENT SUMMARY */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                 <PackageCheck className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Drug Dispensing</h1>
                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                    <div className="flex items-center gap-2">
                       <User className="w-3.5 h-3.5 text-emerald-600" />
                       <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">MAHESH K. KUMAR</span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">MRD: <span className="text-slate-800">P03-260003</span></div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Age/Gender: <span className="text-slate-800">45M</span></div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest underline decoration-emerald-200 underline-offset-4">Case: <span className="text-emerald-600 font-black">C003-001-130426</span></div>
                 </div>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live Inventory Sync</span>
              </div>
           </div>
        </div>

        {/* 🔷 DISPENSING TABLE SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rx#</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Drug Name</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Form</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Cost</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispense Status</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Confirm</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {rxList.map((row) => (
                      <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <span className="text-[11px] font-black text-slate-400">{row.rx}</span>
                         </td>
                         <td className="px-6 py-6">
                            <span className={`text-[13px] font-black tracking-tight ${row.unavailable ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                               {row.name}
                            </span>
                         </td>
                         <td className="px-6 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{row.form}</td>
                         <td className="px-6 py-6 text-center text-[12px] font-black text-slate-700">{row.qty}</td>
                         <td className="px-6 py-6 text-[12px] font-black text-slate-600">₹{row.cost}</td>
                         <td className="px-6 py-6 text-[13px] font-black text-emerald-600">₹{row.total}</td>
                         <td className="px-6 py-6">
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(row.id, row.unavailable)}`}>
                               {row.unavailable ? 'Unavailable' : (dispenseStatus[row.id] || 'Pending')}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            {!row.unavailable && (
                               <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => setDispenseStatus(prev => ({ ...prev, [row.id]: 'Taken' }))}
                                    className={`p-2 rounded-lg border transition-all ${dispenseStatus[row.id] === 'Taken' ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white border-slate-200 text-slate-300 hover:text-emerald-600 hover:border-emerald-200'}`}
                                  >
                                     <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => setDispenseStatus(prev => ({ ...prev, [row.id]: 'Not Taken' }))}
                                    className={`p-2 rounded-lg border transition-all ${dispenseStatus[row.id] === 'Not Taken' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-white border-slate-200 text-slate-300 hover:text-rose-500 hover:border-rose-200'}`}
                                  >
                                     <XCircle className="w-4 h-4" />
                                  </button>
                               </div>
                            )}
                            {row.unavailable && <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">OUT OF STOCK</span>}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="p-8 bg-slate-50/50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                 <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                    “Taken” auto-deducts from stock. “Not Taken” auto-creates <span className="text-slate-800">Special Note</span> in patient record. 
                    “Unavailable” triggers instant alert to Admin & Doctor.
                 </p>
              </div>
              <div className="flex items-center justify-end gap-4">
                 <div className="text-right mr-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Dispensed Value</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">₹237.00</p>
                 </div>
                 <button className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3">
                    <PackageCheck className="w-5 h-5 text-emerald-400" />
                    CONFIRM DISPENSING
                 </button>
              </div>
           </div>
        </div>

        {/* 🔷 UNAVAILABLE DRUG ALERT SECTION */}
        <div className="bg-rose-50 rounded-[2.5rem] border border-rose-200/50 p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-inner">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-200">
                 <Ban className="w-7 h-7" />
              </div>
              <div>
                 <h2 className="text-xs font-black text-rose-800 uppercase tracking-[0.2em]">DRUG UNAVAILABLE ALERT: Syp Albendazole (Zentel)</h2>
                 <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    OUT OF STOCK | Auto-notification sent to Admin & Doctor
                 </p>
              </div>
           </div>
           <div className="flex flex-col items-end gap-3">
              <button className="px-10 py-4 bg-rose-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center gap-3">
                 <Smartphone className="w-4 h-4 text-emerald-400" />
                 Mark as Drug Unavailable
              </button>
              <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest italic">Doctor and Admin will be notified immediately.</p>
           </div>
        </div>

        {/* 🔷 DRUG RETURN PROCESSING SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 bg-slate-900 border-b border-slate-800 flex items-center gap-4 text-white">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                 <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Drug Return Processing</h2>
           </div>

           <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient</label>
                    <div className="relative group">
                       <UserCircle className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500" />
                       <input type="text" placeholder="Mahesh K. Kumar" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Drug Returned</label>
                    <div className="relative group">
                       <Pill className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500" />
                       <input type="text" placeholder="e.g. Tab Dolo" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity Returned</label>
                    <input type="number" placeholder="0" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason</label>
                    <input type="text" placeholder="e.g. Side effects" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" />
                 </div>
              </div>

              <div className="flex flex-col items-center gap-8 pt-6 border-t border-slate-50">
                 <div className="flex items-start gap-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 max-w-2xl">
                    <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-relaxed">
                       Returned quantity is re-added to inventory automatically. Patient profile and billing ledger will be updated in the next cycle.
                    </p>
                 </div>
                 <button className="px-20 py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center gap-4 group">
                    <RotateCcw className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
                    PROCESS RETURN & UPDATE STOCK
                 </button>
              </div>
           </div>
        </div>

      </div>
    </MedicalLayout>
  );
};

export default MedicalDispensingView;
