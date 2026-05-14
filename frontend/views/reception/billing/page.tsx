'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useQueueSSE } from '@/hooks/useQueueSSE';

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
  History,
  Search,
  User
} from 'lucide-react';

const BillingView = () => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId');

  const [isLoading, setIsLoading] = useState(true);
  const [bill, setBill] = useState<any>(null);
  const [pendingBills, setPendingBills] = useState<any[]>([]);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [amountCollected, setAmountCollected] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { lastEvent } = useQueueSSE();

  useEffect(() => {
    if (lastEvent && (lastEvent.type === 'SESSION_ENDED' || lastEvent.type === 'STATUS_CHANGED')) {
      fetchPendingBills();
    }
  }, [lastEvent]);

  useEffect(() => {
    if (caseId) {
      fetchBillDetails();
    } else {
      fetchPendingBills();
    }
  }, [caseId]);


  const fetchBillDetails = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/billing/${caseId}`);
      setBill(response.data);
      setAmountCollected(response.data.balanceAmount.toString());
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch bill details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingBills = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/billing/list/pending');
      setPendingBills(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending bills');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectPayment = async () => {
    if (!bill) return;
    
    setIsSubmitting(true);
    try {
      await api.post(`/billing/${bill.id}/pay`, {
        amountPaid: parseFloat(amountCollected),
        paymentMode,
        transactionId: '' // Optional
      });
      toast.success('Payment collected successfully');
      fetchBillDetails();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment collection failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentModes = [
    { id: 'CASH', label: 'Cash', icon: Banknote, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'CARD', label: 'Card', icon: CreditCard, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'UPI', label: 'UPI', icon: QrCode, color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { id: 'ONLINE', label: 'Online', icon: Globe, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
  ];

  if (isLoading) {
    return (
      <ReceptionLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
           <div className="w-10 h-10 border-4 border-slate-100 border-t-teal-600 rounded-full animate-spin"></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Financial Records...</p>
        </div>
      </ReceptionLayout>
    );
  }

  // If no case is selected, show list of pending bills
  if (!caseId || !bill) {
    return (
      <ReceptionLayout>
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Billing Dashboard</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4">Manage patient payments and pending dues</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                   <Clock className="w-4 h-4 text-slate-400" />
                   Pending Collections
                </h3>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="SEARCH MRD OR NAME..." 
                     className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[10px] font-black outline-none focus:border-teal-500 w-64 uppercase"
                   />
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/50">
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Bill No</th>
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Net Amount</th>
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Paid</th>
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Due</th>
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {pendingBills.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
                            No pending bills found today
                          </td>
                        </tr>
                      ) : (
                        pendingBills.map((pb) => (
                          <tr key={pb.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-8 py-5">
                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{pb.billNumber}</span>
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex flex-col">
                                   <span className="text-[11px] font-black text-slate-800 uppercase">{pb.patient.firstName} {pb.patient.lastName}</span>
                                   <span className="text-[9px] font-bold text-slate-400 uppercase">{pb.patient.mrdNumber}</span>
                                </div>
                             </td>
                             <td className="px-8 py-5 text-right font-black text-slate-800 text-xs">₹ {pb.netAmount.toLocaleString()}</td>
                             <td className="px-8 py-5 text-right font-black text-emerald-600 text-xs">₹ {pb.paidAmount.toLocaleString()}</td>
                             <td className="px-8 py-5 text-right font-black text-rose-600 text-xs">₹ {pb.balanceAmount.toLocaleString()}</td>
                             <td className="px-8 py-5 text-center">
                                <button 
                                  onClick={() => window.location.href = `/reception/billing?caseId=${pb.caseId}`}
                                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                >
                                   Process Payment
                                </button>
                             </td>
                          </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </ReceptionLayout>
    );
  }

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                 Billing & Payment — <span className="text-teal-600 uppercase">{bill.patient.firstName} {bill.patient.lastName}</span>
              </h1>
              <div className="flex items-center gap-4 mt-4">
                 <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Case: {bill.case.caseNumber}
                 </span>
                 <span className="bg-teal-50 text-teal-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-teal-100">
                    <History className="w-3.5 h-3.5" />
                    MRD: {bill.patient.mrdNumber}
                 </span>
              </div>
           </div>
           <button 
             onClick={() => window.location.href = '/reception/billing'}
             className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-2"
           >
             <ArrowRight className="w-3.5 h-3.5 rotate-180" />
             Back to Dashboard
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* LEFT COLUMN: BILL SUMMARY & TOTALS */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* 🔷 SECTION 1: BILL SUMMARY */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                       <Wallet className="w-4 h-4 text-slate-400" />
                       Bill Summary [ {bill.billNumber} ]
                    </h3>
                    <div className="group relative">
                       <ShieldAlert className="w-4 h-4 text-amber-500 cursor-help" />
                       <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 text-white p-3 rounded-xl text-[9px] font-bold leading-relaxed opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 shadow-xl">
                          Discount field is restricted. Only authorized personnel can apply discounts.
                       </div>
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-slate-50/50">
                             <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                             <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</th>
                             <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Disc%</th>
                             <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {bill.items.map((item: any) => (
                             <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5">
                                   <div className="flex flex-col">
                                      <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{item.serviceName}</span>
                                      {item.description && <span className="text-[9px] text-slate-400 font-bold">{item.description}</span>}
                                   </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-slate-600">x{item.quantity}</td>
                                <td className="px-8 py-5 text-center">
                                   <span className={item.discount > 0 ? 'text-rose-500 font-black text-xs' : 'text-slate-300'}>
                                      {item.discount > 0 ? `${item.discount}%` : '-'}
                                   </span>
                                </td>
                                <td className="px-8 py-5 text-right font-black text-slate-800">
                                   ₹ {item.totalPrice.toLocaleString()}
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
                          <p className="text-xl font-black">₹ {bill.grossAmount.toLocaleString()}</p>
                       </div>
                       <div className="md:text-center">
                          <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">TOTAL DISCOUNT</p>
                          <p className="text-xl font-black text-rose-300">₹ {bill.discountTotal.toLocaleString()}</p>
                       </div>
                       <div className="md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                          <p className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-1">NET PAYABLE</p>
                          <p className="text-3xl font-black text-teal-400 tracking-tighter">₹ {bill.netAmount.toLocaleString()}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* PAYMENT HISTORY */}
              {bill.paidAmount > 0 && (
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-4">
                   <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Payment History
                   </h4>
                   <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-emerald-200/50">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount Received</p>
                         <p className="text-sm font-black text-slate-800">₹ {bill.paidAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Method</p>
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{bill.paymentMode}</p>
                      </div>
                   </div>
                </div>
              )}

              {/* 🔷 SECTION 3: RECEIPT PREVIEW */}
              <div className="space-y-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                    <Printer className="w-4 h-4" />
                    Receipt Preview
                 </h3>
                 
                 <div className="bg-white border-2 border-dashed border-slate-200 p-8 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>
                    <div className="flex justify-between items-start mb-8">
                       <div>
                          <p className="text-lg font-black text-slate-900 tracking-widest uppercase">RECEIPT</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            {bill.billNumber} | {format(new Date(bill.createdAt), 'dd/MM/yyyy')}
                          </p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">MedFlow Clinical Center</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">OPD Billing System</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="pb-6 border-b border-slate-100">
                          <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{bill.patient.firstName} {bill.patient.lastName} | {bill.patient.mrdNumber}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Case: {bill.case.caseNumber}</p>
                       </div>

                       <div className="space-y-3">
                          {bill.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-xs font-bold text-slate-600">
                               <span>{item.serviceName}</span>
                               <span className="font-black text-slate-800">₹ {item.totalPrice.toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-xs font-black text-rose-500 pt-2 border-t border-slate-50">
                             <span>Total Discount</span>
                             <span>- ₹ {bill.discountTotal.toLocaleString()}</span>
                          </div>
                       </div>

                       <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">NET PAYABLE</p>
                             <p className="text-xl font-black text-slate-900 tracking-tighter">₹ {bill.netAmount.toLocaleString()}</p>
                          </div>
                          <div className="w-12 h-12 bg-white rounded-lg border border-slate-100 flex items-center justify-center">
                             <QrCode className="w-8 h-8 text-slate-200" />
                          </div>
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Authentic Digital Receipt — OPD Records</p>
                    </div>

                    <button className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/5 transition-all flex items-center justify-center group-hover:opacity-100 opacity-0">
                       <div className="bg-white px-4 py-2 rounded-lg shadow-xl text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-all">
                          <Printer className="w-3.5 h-3.5" />
                          Print Final Receipt
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
                       Collect Payment
                    </h3>
                    
                    {bill.paymentStatus === 'PAID' ? (
                       <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4">
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                             <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em] mb-1">Payment Completed</p>
                             <p className="text-xs font-bold text-emerald-600">No balance remaining for this case.</p>
                          </div>
                          <button className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                             <Printer className="w-3.5 h-3.5" />
                             Print Receipt
                          </button>
                       </div>
                    ) : (
                       <div className="space-y-8">
                          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                             <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Balance Due</p>
                             <p className="text-2xl font-black text-rose-600 tracking-tighter">₹ {bill.balanceAmount.toLocaleString()}</p>
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount to Collect (₹) *</label>
                             <input 
                               type="number" 
                               className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black outline-none focus:border-teal-600 focus:bg-white transition-all text-teal-600"
                               value={amountCollected}
                               onChange={(e) => setAmountCollected(e.target.value)}
                             />
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
                                     <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMode === mode.id ? 'text-slate-900' : 'text-slate-500'}`}>{mode.label}</span>
                                  </button>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-3 pt-4">
                             <button 
                               onClick={handleCollectPayment}
                               disabled={isSubmitting}
                               className="w-full py-5 bg-slate-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50"
                             >
                                {isSubmitting ? 'Processing...' : 'Collect & Print Receipt'}
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                             </button>
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

