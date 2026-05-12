'use client';

import React, { useState } from 'react';
import MedicalLayout from '@/views/layouts/MedicalLayout';
import { 
  Package, 
  Search, 
  Plus, 
  History, 
  AlertCircle, 
  Calendar, 
  User, 
  ChevronRight, 
  ChevronDown,
  ArrowUpRight,
  Database,
  Filter,
  MoreVertical,
  ClipboardList,
  Pill,
  Factory,
  CheckCircle2
} from 'lucide-react';

const StockManagementView = () => {
  const [selectedDrug, setSelectedDrug] = useState<number | null>(1);

  const inventoryData = [
    { id: 1, name: 'Tab Dolo 650mg', form: 'Tablet', stock: 45, min: 20, status: 'Normal', expiry: '06/2027', dispensed: 3 },
    { id: 2, name: 'Tab Fluconazole 400mg', form: 'Tablet', stock: 6, min: 10, status: 'LOW', expiry: '12/2026', dispensed: 2 },
    { id: 3, name: 'Cream Monpic', form: 'Cream', stock: 3, min: 5, status: 'LOW', expiry: '08/2026', dispensed: 1 },
    { id: 4, name: 'Syp Albendazole Zentel', form: 'Syrup', stock: 0, min: 8, status: 'OUT OF STOCK', expiry: 'EXP', dispensed: 0 },
    { id: 5, name: '(S) Tab Levocetrizine', form: 'Tablet', stock: 2, min: 0, status: 'SAMPLE LOW', expiry: '04/2026', dispensed: 1 },
  ];

  const dispensingHistory = [
    { id: 'H1', pid: 'P03-260001', name: 'Rameshbhai Patel', qty: '15 tabs', date: '13/04/2026', case: 'C001-001-130426', by: 'Suresh (Med)' },
    { id: 'H2', pid: 'P03-260003', name: 'Mahesh Kumar', qty: '15 tabs', date: '13/04/2026', case: 'C003-001-130426', by: 'Suresh (Med)' },
    { id: 'H3', pid: 'P03-260005', name: 'Anita Sharma', qty: '10 tabs', date: '12/04/2026', case: 'C012-005-120426', by: 'Suresh (Med)' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'LOW': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'OUT OF STOCK': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'SAMPLE LOW': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <MedicalLayout>
      <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
        
        {/* 🔷 PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-emerald-400 shadow-xl shadow-slate-200">
                 <Database className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">Drug Stock Management</h1>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-emerald-500" />
                    Central Pharmacy Inventory & Batch Tracking
                 </p>
              </div>
           </div>
           <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center gap-3 active:scale-95">
              <Plus className="w-5 h-5" />
              Add / Update Stock
           </button>
        </div>

        {/* 🔷 MAIN INVENTORY TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative group flex-1 max-w-md">
                 <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                 <input type="text" placeholder="Search drugs by name or form..." className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner" />
              </div>
              <div className="flex items-center gap-4">
                 <button className="px-6 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all">Filter</button>
                 <button className="px-6 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all">Export</button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white border-b border-slate-100">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Drug Name</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Form</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Stock</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Min Alert</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Dispensed</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {inventoryData.map((row) => (
                      <tr 
                        key={row.id} 
                        onClick={() => setSelectedDrug(row.id)}
                        className={`group cursor-pointer transition-all ${selectedDrug === row.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50/50'}`}
                      >
                         <td className="px-8 py-6">
                            <span className={`text-[13px] font-black tracking-tight ${selectedDrug === row.id ? 'text-emerald-700' : 'text-slate-800'}`}>{row.name}</span>
                         </td>
                         <td className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{row.form}</td>
                         <td className="px-6 py-6 text-center">
                            <span className={`text-[14px] font-black ${row.stock <= row.min ? 'text-rose-600' : 'text-slate-700'}`}>{row.stock}</span>
                         </td>
                         <td className="px-6 py-6 text-center text-[12px] font-bold text-slate-400">{row.min}</td>
                         <td className="px-6 py-6">
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusBadge(row.status)}`}>
                               {row.status}
                            </span>
                         </td>
                         <td className="px-6 py-6">
                            <span className={`text-[11px] font-black uppercase tracking-widest ${row.expiry === 'EXP' ? 'text-rose-500' : 'text-slate-500'}`}>{row.expiry}</span>
                         </td>
                         <td className="px-6 py-6 text-center text-[12px] font-black text-slate-400 tracking-tight">{row.dispensed}</td>
                         <td className="px-8 py-6 text-right">
                            <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                               <ArrowUpRight className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* 🔷 DRUG DETAIL & HISTORY SECTION */}
        {selectedDrug && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-6 duration-700">
              {/* Left Column: Detail Summary */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                       <Pill className="w-24 h-24 text-emerald-50 opacity-[0.05] -rotate-12" />
                    </div>
                    <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Drug Detail</h2>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Tab Dolo 650mg</h3>
                    <div className="mt-8 space-y-4">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock</span>
                          <span className="text-xl font-black text-slate-800">45 <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Tablets</span></span>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min Alert Level</span>
                          <span className="text-lg font-black text-amber-600 underline decoration-amber-200 underline-offset-4">20</span>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</span>
                          <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">06 / 2027</span>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Last Restocked</span>
                          <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">01 / 04 / 2026</span>
                       </div>
                    </div>
                    <button className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                       <ClipboardList className="w-5 h-5 text-emerald-400" />
                       VIEW FULL AUDIT LOG
                    </button>
                 </div>
              </div>

              {/* Right Column: Dispensing History Table */}
              <div className="lg:col-span-8">
                 <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-full">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                             <History className="w-5 h-5" />
                          </div>
                          <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Dispensing Audit History</h2>
                       </div>
                       <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline underline-offset-4">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient ID</th>
                                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient Name</th>
                                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                             {dispensingHistory.map((history) => (
                               <tr key={history.id} className="hover:bg-slate-50/30 transition-colors">
                                  <td className="px-8 py-5">
                                     <span className="text-[11px] font-black text-slate-800">{history.pid}</span>
                                  </td>
                                  <td className="px-6 py-5">
                                     <span className="text-[12px] font-black text-slate-700 tracking-tight">{history.name}</span>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Case: {history.case}</p>
                                  </td>
                                  <td className="px-6 py-5 text-[11px] font-black text-emerald-600 uppercase tracking-widest">{history.qty}</td>
                                  <td className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{history.date}</td>
                                  <td className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                     {history.by}
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* 🔷 ADD STOCK ENTRY FORM */}
        <div className="bg-white rounded-[3rem] border-4 border-slate-100 shadow-2xl shadow-slate-200 overflow-hidden">
           <div className="p-10 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                    <Plus className="w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add Stock Entry</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 italic">Real-time inventory update & batch linking</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                 <AlertCircle className="w-5 h-5 text-amber-500" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Updating stock will instantly reflect across dispensing panels.</p>
              </div>
           </div>

           <div className="p-12 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Drug Name</label>
                    <div className="relative group">
                       <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                       <input type="text" placeholder="Search drug to restock..." className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Quantity Added</label>
                    <div className="relative group">
                       <Package className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                       <input type="number" placeholder="Enter units (tabs/vials)" className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 text-emerald-600">Batch Number</label>
                    <div className="relative group">
                       <Database className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                       <input type="text" placeholder="e.g. BATCH-2026-X" className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Expiry Date</label>
                    <div className="relative group">
                       <Calendar className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                       <input type="date" className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" />
                    </div>
                 </div>
                 <div className="space-y-4 lg:col-span-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Supplier / Manufacturer</label>
                    <div className="relative group">
                       <Factory className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                       <input type="text" placeholder="Enter supplier name or pharma co." className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner" />
                    </div>
                 </div>
              </div>

              <div className="pt-10 flex flex-col items-center border-t border-slate-100 gap-8">
                 <button className="px-24 py-7 bg-slate-900 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-black transition-all active:scale-[0.97] flex items-center gap-4 group">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 group-hover:scale-125 transition-transform" />
                    SAVE STOCK UPDATE
                 </button>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-slate-200" />
                    MedFlow Secure Inventory System
                    <div className="w-8 h-[1px] bg-slate-200" />
                 </div>
              </div>
           </div>
        </div>

      </div>
    </MedicalLayout>
  );
};

export default StockManagementView;
