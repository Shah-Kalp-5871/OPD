'use client';

import React, { useState, useEffect } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  Wallet, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Globe, 
  Printer, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  History
} from 'lucide-react';

const BillingView = () => {
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [isFoc, setIsFoc] = useState(false);
  const [amountCollected, setAmountCollected] = useState('2300');
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [receiptGenerated, setReceiptGenerated] = useState(false);

  const billData = [
    { service: 'Consultation', desc: 'New Consultation – Dr. Valaki', discount: '-', amount: 500 },
    { service: 'Procedure', desc: 'Hair Removal Diode – Session 1', discount: '10%', amount: 1800 }
  ];

  const totals = {
    gross: 2500,
    discount: 200,
    net: 2300
  };

  const paymentModes = [
    { id: 'Cash', icon: Banknote, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'Card', icon: CreditCard, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'UPI', icon: QrCode, color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { id: 'Online', icon: Globe, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
  ];

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                 Billing & Payment — <span className="text-teal-600">MAHESH K. KUMAR</span>
              </h1>
              <div className="flex items-center gap-4 mt-4">
                 <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Case: C003-001-130426
                 </span>
                 <span className="bg-teal-50 text-teal-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-teal-100">
                    <History className="w-3.5 h-3.5" />
                    MRD: P03-260003
                 </span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* LEFT COLUMN: BILL SUMMARY & TOTALS */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* 🔷 SECTION 1: BILL SUMMARY */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                       <Wallet className="w-4 h-4 text-slate-400" />
                       Bill Summary
                    </h3>
                    <div className="group relative">
                       <ShieldAlert className="w-4 h-4 text-amber-500 cursor-help" />
                       <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 text-white p-3 rounded-xl text-[9px] font-bold leading-relaxed opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 shadow-xl">
                          Discount field hidden from Reception. Only Doctor/Admin can apply discount.
                       </div>
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-slate-50/50">
                             <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                             <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                             <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Discount</th>
                             <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {billData.map((item, idx) => (
                             <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5">
                                   <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest px-2 py-1 bg-slate-100 rounded">
                                      {item.service}
                                   </span>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-slate-600">{item.desc}</td>
                                <td className="px-8 py-5 text-center">
                                   <span className={item.discount !== '-' ? 'text-rose-500 font-black text-xs' : 'text-slate-300'}>
                                      {item.discount}
                                   </span>
                                </td>
                                <td className="px-8 py-5 text-right font-black text-slate-800">
                                   ₹ {item.amount.toLocaleString()}
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 {/* 🔷 TOTAL SUMMARY SECTION */}
                 <div className="p-8 bg-slate-900 text-white rounded-b-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">TOTAL GROSS</p>
                          <p className="text-xl font-black">₹ {totals.gross.toLocaleString()}</p>
                       </div>
                       <div className="md:text-center">
                          <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">TOTAL DISCOUNT</p>
                          <p className="text-xl font-black text-rose-300">₹ {totals.discount.toLocaleString()}</p>
                       </div>
                       <div className="md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                          <p className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-1">NET PAYABLE</p>
                          <p className="text-3xl font-black text-teal-400 tracking-tighter">₹ {totals.net.toLocaleString()}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* FOC NOTIFICATION (SIMULATION) */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-none mb-1">Authorized Protocol</p>
                    <p className="text-xs font-bold text-amber-700">When Doctor applies discount/FOC → pop-up notification here.</p>
                 </div>
              </div>

              {/* 🔷 SECTION 3: RECEIPT PREVIEW */}
              <div className="space-y-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                    <Printer className="w-4 h-4" />
                    Receipt Preview
                 </h3>
                 
                 <div className="bg-white border-2 border-dashed border-slate-200 p-8 rounded-3xl relative overflow-hidden group">
                    {/* Receipt Aesthetics */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>
                    <div className="flex justify-between items-start mb-8">
                       <div>
                          <p className="text-lg font-black text-slate-900 tracking-widest uppercase">RECEIPT</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">RCP-0413-003 | 13/04/2026</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-slate-800 uppercase">MedFlow Clinic</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">OPD Billing Counter</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="pb-6 border-b border-slate-100">
                          <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Mahesh K. Kumar | P03-260003</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Case: C003-001-130426</p>
                       </div>

                       <div className="space-y-3">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                             <span>Consultation</span>
                             <span className="font-black text-slate-800">₹ 500</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                             <span>Procedure – Hair Removal</span>
                             <span className="font-black text-slate-800">₹ 1,800</span>
                          </div>
                          <div className="flex justify-between text-xs font-black text-rose-500 pt-2 border-t border-slate-50">
                             <span>Discount (10%)</span>
                             <span>- ₹ 200</span>
                          </div>
                       </div>

                       <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">NET PAID via {paymentMode}</p>
                             <p className="text-xl font-black text-slate-900 tracking-tighter">₹ 2,300.00</p>
                          </div>
                          <div className="w-12 h-12 bg-white rounded-lg border border-slate-100 flex items-center justify-center">
                             <QrCode className="w-8 h-8 text-slate-200" />
                          </div>
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Digital Copy — Patient Records Integrated</p>
                    </div>

                    <button className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/5 transition-all flex items-center justify-center group-hover:opacity-100 opacity-0">
                       <div className="bg-white px-4 py-2 rounded-lg shadow-xl text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-all">
                          <Printer className="w-3.5 h-3.5" />
                          Print Receipt
                       </div>
                    </button>
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: PAYMENT COLLECTION */}
           <div className="space-y-8">
              
              {/* 🔷 SECTION 2: PAYMENT COLLECTION */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8 sticky top-8">
                 <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3 mb-6">
                       <CheckCircle2 className="w-4 h-4 text-teal-500" />
                       Payment Collection
                    </h3>
                    
                    {isFoc ? (
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4">
                         <Info className="w-8 h-8 text-slate-400 mx-auto" />
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                            FOC patients — billing hidden. <br />Internal record only.
                         </p>
                         <button onClick={() => setIsFoc(false)} className="text-[9px] font-black text-teal-600 uppercase tracking-widest hover:underline">
                            Switch to Payment Mode
                         </button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                         <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</label>
                               <select 
                                 className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-teal-600 transition-all"
                                 value={paymentStatus}
                                 onChange={(e) => setPaymentStatus(e.target.value)}
                               >
                                  <option>Pending</option>
                                  <option>Partial Paid</option>
                                  <option>Full Paid</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Collected (₹) *</label>
                               <input 
                                 type="number" 
                                 className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black outline-none focus:border-teal-600 focus:bg-white transition-all text-teal-600"
                                 value={amountCollected}
                                 onChange={(e) => setAmountCollected(e.target.value)}
                               />
                            </div>
                         </div>

                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Payment Mode:</p>
                            <div className="grid grid-cols-2 gap-3">
                               {paymentModes.map((mode) => (
                                 <button
                                   key={mode.id}
                                   onClick={() => setPaymentMode(mode.id)}
                                   className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMode === mode.id ? `border-slate-800 ${mode.color.split(' ')[0]} shadow-lg scale-[1.02]` : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                 >
                                    <mode.icon className={`w-6 h-6 ${paymentMode === mode.id ? mode.color.split(' ')[1] : 'text-slate-400'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMode === mode.id ? 'text-slate-900' : 'text-slate-500'}`}>{mode.id}</span>
                                 </button>
                               ))}
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Receipt ID</p>
                               <p className="text-[10px] font-black text-slate-800 tracking-widest uppercase">RCP-0413-003</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                               <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Payment Time</p>
                               <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <p className="text-[10px] font-black text-slate-800 tracking-widest uppercase">15:47 PM</p>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-3 pt-4">
                            <button className="w-full py-5 bg-slate-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 group">
                               Collect & Print Receipt
                               <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                               <button className="py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                                  Mark Pending
                               </button>
                               <button className="py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                                  Partial Paid
                               </button>
                            </div>
                         </div>
                      </div>
                    )}
                 </div>
              </div>

           </div>
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default BillingView;
