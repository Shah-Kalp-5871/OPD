'use client';

import React, { useState } from 'react';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import api from '@/lib/api';
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

  const [loading, setLoading] = useState(true);
  const [billingSummary, setBillingSummary] = useState<any>({
    today: 0,
    monthly: 0,
    yearly: 0,
    total: 0
  });
  const [billingHistory, setBillingHistory] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchBilling = async () => {
      try {
        setLoading(true);
        // Using generic billing history endpoint 
        const response = await api.get('/billing/history');
        if (response.data && response.data.items) {
          setBillingHistory(response.data.items);
          
          // Calculate summary dynamically based on fetched history
          const total = response.data.items.reduce((sum: number, item: any) => sum + (Number(item.netAmount) || 0), 0);
          setBillingSummary({
            today: total, // Simplified for dynamic placeholder
            monthly: total,
            yearly: total,
            total: total
          });
        }
      } catch (err) {
        console.error('Failed to load billing history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, []);

  const billingCards = [
    { label: "Today's Bill", amount: billingSummary.today.toLocaleString(), icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Monthly Bill", amount: billingSummary.monthly.toLocaleString(), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: "Yearly Bill", amount: billingSummary.yearly.toLocaleString(), icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: "Total Bill", amount: billingSummary.total.toLocaleString(), icon: PieChart, color: 'text-slate-600', bg: 'bg-slate-100' }
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
                 Billing Summary & History
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
                       {loading ? (
                         <tr><td colSpan={7} className="py-12 text-center text-xs font-medium text-slate-400 italic">Loading billing records...</td></tr>
                       ) : billingHistory.length === 0 ? (
                         <tr><td colSpan={7} className="py-12 text-center text-xs font-medium text-slate-400 italic">No billing history found.</td></tr>
                       ) : billingHistory.map((row, idx) => (
                         <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 text-[11px] font-black text-slate-500">{new Date(row.createdAt || Date.now()).toLocaleDateString()}</td>
                            <td className="px-6 py-5 text-[12px] font-black text-slate-800">{row.billType || 'Consultation'}</td>
                            <td className="px-6 py-5 text-[12px] font-black text-slate-700">{row.grossAmount || '0'}</td>
                            <td className="px-6 py-5 text-[12px] font-bold text-rose-500">{row.discountAmount ? `₹${row.discountAmount}` : '—'}</td>
                            <td className="px-6 py-5 text-[13px] font-black text-emerald-600">{row.netAmount || '0'}</td>
                            <td className="px-6 py-5">
                               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                  {row.paymentMethod || 'CASH'}
                               </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                               <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(row.status || 'Paid')}`}>
                                  {row.status || 'Paid'}
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
