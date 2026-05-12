'use client';

import React, { useState } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import { 
  Wallet, 
  TrendingUp, 
  Calendar, 
  PieChart, 
  Info, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  DollarSign,
  ChevronDown,
  Gift,
  Bell,
  FileText
} from 'lucide-react';

const BillingView = () => {
  const [discount, setDiscount] = useState('');
  const [isFoc, setIsFoc] = useState(false);
  const [reason, setReason] = useState('');

  const billingCards = [
    { label: "Today's Bill", amount: '2,300', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Monthly Bill", amount: '8,700', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: "Yearly Bill", amount: '34,200', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: "Total Bill", amount: '52,400', icon: PieChart, color: 'text-slate-600', bg: 'bg-slate-100' }
  ];

  const billingHistory = [
    { date: '13/04/2026', service: 'Consultation – Dr. Valaki', gross: '500', discount: '—', net: '500', mode: 'UPI', status: 'Paid' },
    { date: '13/04/2026', service: 'Hair Removal – Session 2', gross: '2,000', discount: '10%', net: '1,800', mode: 'UPI', status: 'Paid' },
    { date: '01/04/2026', service: 'Consultation', gross: '500', discount: '—', net: '500', mode: 'Cash', status: 'Paid' },
    { date: '25/03/2026', service: 'Hair Removal – Session 1', gross: '2,000', discount: '—', net: '2,000', mode: 'Cash', status: 'Paid' },
    { date: '15/03/2026', service: 'Consultation – Dr. Valaki', gross: '500', discount: '100%', net: 'FOC', mode: '—', status: 'FOC' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'FOC': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Discounted': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-32">
        
        {/* 🔷 PAGE HEADER */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-blue-400">
                    <FileText className="w-5 h-5" />
                 </div>
                 Billing Summary – RAMESHBHAI M. PATEL | MRD: P03-260001
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 ml-1">
                 Doctor-Side Financial Overview & Billing Authorization
              </p>
           </div>
           <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all flex items-center gap-2">
                 <Bell className="w-4 h-4" />
                 View Alerts
              </button>
           </div>
        </div>

        {/* 🔷 BILLING SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {billingCards.map((card, idx) => (
             <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm group hover:border-blue-200 transition-all cursor-default relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{card.label}</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-[11px] font-black text-slate-400">₹</span>
                      <span className="text-2xl font-black text-slate-800 tracking-tight">{card.amount}</span>
                   </div>
                </div>
                <div className={`absolute -right-4 -bottom-4 w-20 h-20 ${card.bg} rounded-full flex items-center justify-center ${card.color} opacity-20 group-hover:scale-110 transition-transform duration-500`}>
                   <card.icon className="w-10 h-10" />
                </div>
             </div>
           ))}
        </div>

        {/* 🔷 BILLING BREAKDOWN SECTION */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400">
                    <CreditCard className="w-5 h-5" />
                 </div>
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Service-wise Billing Breakdown</h3>
              </div>
              
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                 <Info className="w-4 h-4 text-blue-500" />
                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">
                    Consultation billing and Procedure billing shown separately.
                 </p>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross (₹)</th>
                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Disc</th>
                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net (₹)</th>
                       <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Mode</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {billingHistory.map((row, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{row.date}</td>
                         <td className="px-6 py-5">
                            <span className="text-[12px] font-black text-slate-800 tracking-tight">{row.service}</span>
                         </td>
                         <td className="px-6 py-5 text-[12px] font-black text-slate-700">{row.gross}</td>
                         <td className="px-6 py-5">
                            <span className={`text-[11px] font-black ${row.discount !== '—' ? 'text-blue-600' : 'text-slate-400'}`}>
                               {row.discount}
                            </span>
                         </td>
                         <td className="px-6 py-5 text-[12px] font-black text-slate-900">{row.net}</td>
                         <td className="px-6 py-5">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{row.mode}</span>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(row.status)}`}>
                               {row.status}
                            </span>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
              <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                 <AlertCircle className="w-4 h-4 text-amber-500" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Discount/FOC only applied by <span className="text-blue-600">Doctor</span> or <span className="text-slate-800">Admin</span>.
                 </p>
              </div>
           </div>
        </div>

        {/* 🔷 FOC / DISCOUNT ACTION SECTION */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative group">
           {/* Accent Background */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50 transition-all group-hover:scale-110 pointer-events-none" />
           
           <div className="p-8 bg-slate-900 border-b border-slate-800 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                 <Gift className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">FOC / Discount Actions (Doctor Only)</h3>
           </div>

           <div className="p-10 space-y-10 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 
                 {/* Discount Input */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Apply Discount (%)</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         value={discount}
                         onChange={(e) => setDiscount(e.target.value)}
                         placeholder="0.00"
                         className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                       />
                       <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">%</span>
                    </div>
                 </div>

                 {/* FOC Toggle */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Mark as FOC</label>
                    <label className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all shadow-inner">
                       <span className={`text-xs font-black uppercase tracking-widest transition-colors ${isFoc ? 'text-blue-600' : 'text-slate-400'}`}>
                          Full Waiver
                       </span>
                       <div className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isFoc}
                            onChange={() => setIsFoc(!isFoc)}
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                       </div>
                    </label>
                 </div>

                 {/* Reason Section */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Reason / Authorization Note</label>
                    <textarea 
                      rows={1}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Professional Courtesy, Academic Case"
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner resize-none"
                    />
                 </div>

              </div>

              {/* ACTION BUTTON */}
              <div className="flex flex-col items-center gap-6">
                 <button className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center gap-4 group">
                    <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    APPLY & NOTIFY RECEPTION
                 </button>
                 
                 <div className="flex items-center gap-3 text-slate-400">
                    <Bell className="w-3.5 h-3.5" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em]">
                       A pop-up notification will automatically appear at Reception billing counter when FOC or discount is applied.
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </DoctorLayout>
  );
};

export default BillingView;
