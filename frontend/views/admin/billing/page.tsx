'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  IndianRupee, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Search, 
  Filter, 
  CreditCard, 
  Settings, 
  Download,
  Info,
  ShieldCheck,
  UserCircle
} from 'lucide-react';

const BillingManagementView = () => {
  // Simulating Role for UI Logic (Admin by default to show Discount)
  const [userRole, setUserRole] = useState<'Admin' | 'Reception'>('Admin');

  const summaryCards = [
    { title: 'Today Consult Income', value: '12,500', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Today Procedure Income', value: '6,000', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Today Total', value: '18,500', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Pending Dues', value: '3,200', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const transactions = [
    { id: 'TXN-001', date: '13/04', patient: 'Rameshbhai P.', caseId: 'C001-001-130426', service: 'Consultation', gross: '500', discount: '—', final: '500' },
    { id: 'TXN-002', date: '13/04', patient: 'Sneha Shah', caseId: 'C002-001-130426', service: 'Consultation', gross: '500', discount: '10%', final: '450' },
    { id: 'TXN-003', date: '13/04', patient: 'Mahesh Kumar', caseId: 'C004-001-130426', service: 'Procedure', gross: '2,000', discount: '—', final: '2,000' },
    { id: 'TXN-004', date: '13/04', patient: 'Priya Desai', caseId: 'C003-001-130426', service: 'Consultation', gross: '500', discount: '—', final: '500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        {/* Header & Role Switcher (Simulation Only) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Billing & Transaction Management</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Clinic Financial Dashboard</p>
          </div>
          
          {/* Role Simulation Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
            <button 
              onClick={() => setUserRole('Admin')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${userRole === 'Admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Admin View
            </button>
            <button 
              onClick={() => setUserRole('Reception')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${userRole === 'Reception' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Reception View
            </button>
          </div>
        </div>

        {/* 🔷 Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 flex items-center justify-between group hover:border-blue-200 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{card.title}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-300">■</span>
                  <h3 className={`text-2xl font-black ${card.color} tracking-tight`}>{card.value}</h3>
                </div>
              </div>
              <div className={`p-3 ${card.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* 🔷 Filter Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Date From: [01/04/2026]
              </label>
              <input type="date" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all" defaultValue="2026-04-01" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Date To: [13/04/2026]
              </label>
              <input type="date" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all" defaultValue="2026-04-13" />
            </div>
          </div>
          <button className="px-10 py-3 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all uppercase tracking-widest shadow-lg shadow-slate-200 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100 mb-0.5">
             <Info className="w-4 h-4 text-blue-500" />
             <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest max-w-[200px]">
               Discount field visible to Doctor/Admin only. Not for Reception.
             </span>
          </div>
        </div>

        {/* 🔷 Billing Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-5">Txn ID</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Patient</th>
                  <th className="px-8 py-5">Case ID</th>
                  <th className="px-8 py-5">Service</th>
                  <th className="px-8 py-5">Gross (■)</th>
                  {userRole === 'Admin' && <th className="px-8 py-5">Disc</th>}
                  <th className="px-8 py-5 text-right text-slate-900">Final (■)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                {transactions.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 text-xs font-black text-blue-600">{txn.id}</td>
                    <td className="px-8 py-5 text-xs text-slate-500">{txn.date}</td>
                    <td className="px-8 py-5 text-sm font-extrabold text-slate-800">{txn.patient}</td>
                    <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tight">{txn.caseId}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        txn.service === 'Procedure' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {txn.service}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600">■ {txn.gross}</td>
                    {userRole === 'Admin' && (
                      <td className="px-8 py-5 text-xs">
                        {txn.discount !== '—' ? (
                          <span className="text-rose-600 font-black">{txn.discount}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-black text-slate-900">
                        <span className="text-slate-300 font-normal">■</span>
                        <span className="text-sm">{txn.final}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-50">
             <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                    FOC patients: all billing fields hidden throughout session. Discount column dynamic visibility active.
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-slate-600 hover:text-blue-600 uppercase tracking-widest transition-all">
                  <Download className="w-3.5 h-3.5" />
                  Export Ledger
                </button>
             </div>
          </div>
        </div>

        {/* 🔷 Payment Configuration Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
              Payment Configuration
            </h3>
            <Settings className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <UserCircle className="w-3.5 h-3.5" />
                  Default Consult Fee per Doctor (configure in Doctor Mgmt)
                </label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none cursor-not-allowed opacity-60"
                  disabled
                  placeholder="Linked to Doctor Profiles"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                  Razorpay API Key
                </label>
                <input 
                  type="password" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
                  placeholder="rzp_live_••••••••••••••••"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button className="px-16 py-4 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all shadow-2xl shadow-slate-200 uppercase tracking-[0.2em] flex items-center gap-3">
                <Settings className="w-4 h-4" />
                SAVE CONFIGURATION
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BillingManagementView;
