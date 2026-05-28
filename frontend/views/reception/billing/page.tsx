'use client';

import React, { useRef, useState, useEffect } from 'react';
import { format } from 'date-fns';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { useSearchParams, useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import Script from 'next/script';
import api from '@/lib/api';
import { billingApi } from '@/lib/api/billing';
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
  User,
  Ban,
  Lock,
  Receipt,
  ShieldCheck
} from 'lucide-react';

const BillingView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const caseId = searchParams.get('caseId');

  const [isLoading, setIsLoading] = useState(true);
  const [bill, setBill] = useState<any>(null);
  const [pendingBills, setPendingBills] = useState<any[]>([]);
  const [isFoc, setIsFoc] = useState(false);
  const [focReason, setFocReason] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [amountCollected, setAmountCollected] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [qrMode, setQrMode] = useState<'UPI' | 'RAZORPAY'>('UPI');
  const [upiConfig, setUpiConfig] = useState<{ upiId: string; upiPayeeName: string } | null>(null);
  const paymentSubmittingRef = useRef(false);

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
    // Fetch UPI config for QR generation
    api.get('/admin/payment-settings')
      .then(res => setUpiConfig(res.data))
      .catch(() => {}); // silently ignore
  }, [caseId]);

  const fetchBillDetails = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/billing/${caseId}`);
      setBill(response.data);
      setAmountCollected(response.data.balanceAmount.toString());
      setPaymentMode('CASH');
      setTransactionId('');
    } catch (error: any) {
      if (error.response?.status === 404) {
        setBill(null); // No bill exists yet
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch bill details');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingBills = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/billing/list/pending');
      // Handle either paginated envelope { data: [...], meta: ... } or direct array
      const bills = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
      setPendingBills(bills);
    } catch (error) {
      toast.error('Failed to fetch pending bills');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBill = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/billing', {
        caseId,
        autoPopulateFromConsultation: true
      });
      toast.success('Bill generated from clinical record');
      fetchBillDetails();
    } catch (error: any) {
      const message = getBillingErrorMessage(error, 'Failed to generate bill');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Split handlers removed in favor of single mode payment

  const handleCollectPayment = async () => {
    if (paymentSubmittingRef.current || isSubmitting) return;
    if (!bill && !isFoc) return;
    if (bill?.paymentStatus === 'PAID') {
      toast.error('This bill is already fully paid');
      return;
    }
    
    // Validate payment if not FOC
    if (!isFoc) {
      const parsedAmount = parseFloat(amountCollected) || 0;
      if (parsedAmount <= 0) {
        toast.error('Amount collected must be greater than zero');
        return;
      }
      if (parsedAmount > Number(bill.balanceAmount)) {
        toast.error('Payment amount cannot exceed remaining balance');
        return;
      }
    } else if (!focReason) {
      toast.error('FOC reason is required');
      return;
    }

    paymentSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      if (!isFoc && paymentMode === 'UPI_QR') {
        // Generate direct UPI QR code (no third-party gateway)
        const amount = parseFloat(amountCollected);
        if (!upiConfig?.upiId) {
          toast.error('UPI ID not configured. Please ask admin to set it up in Payment Management.');
          setIsSubmitting(false);
          paymentSubmittingRef.current = false;
          return;
        }
        const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiConfig.upiId)}&pn=${encodeURIComponent(upiConfig.upiPayeeName || 'Clinic')}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Bill #${bill.billNumber} - OPD`)}` ;
        setQrUrl(upiDeepLink);
        setQrMode('UPI');
        setIsQrModalOpen(true);
        setIsSubmitting(false);
        paymentSubmittingRef.current = false;
        return;
      }

      if (!isFoc && paymentMode === 'BANK_TRANSFER') {
        // Initialize Razorpay Payment Link
        const amount = parseFloat(amountCollected);
        const linkRes = await api.post('/payments/link', {
          amount: amount,
          currency: 'INR',
          provider: 'RAZORPAY',
          billId: bill.id,
          appointmentId: bill.caseId
        });

        setQrUrl(linkRes.data.shortUrl);
        setIsQrModalOpen(true);
        toast.success(`Payment link generated and sent to ${bill.patient?.firstName}'s WhatsApp`);
        setIsSubmitting(false);
        paymentSubmittingRef.current = false;
        return; // wait for callback or manual verification
      }

      const result = await api.post(`/billing/${bill.id}/pay`, {
        isFoc,
        focReason,
        splits: isFoc ? [] : [{
          amount: parseFloat(amountCollected),
          paymentMode: paymentMode,
          transactionId: transactionId
        }]
      }, {
        headers: {
          'Idempotency-Key': crypto.randomUUID(),
        },
      });
      toast.success('Payment settled successfully');
      const updatedBillRes = await api.get(`/billing/${caseId}`);
      const updatedBill = updatedBillRes.data;
      setBill(updatedBill);
      setAmountCollected('0');
      setPaymentMode('CASH');
      setTransactionId('');
      // Auto-open print receipt if fully paid
      if (updatedBill.paymentStatus === 'PAID') {
        setTimeout(() => {
          window.open(`/opd/print/invoice/${updatedBill.id}`, '_blank');
        }, 800);
      }
    } catch (error: any) {
      const message = getBillingErrorMessage(error, 'Payment processing failed');
      toast.error(message);
    } finally {
      paymentSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await billingApi.finalizeBill(bill.id);
      toast.success('Bill finalized and locked');
      fetchBillDetails();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to finalize bill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefund = async () => {
    if (isSubmitting || !refundAmount || !refundReason) return;
    setIsSubmitting(true);
    try {
      await billingApi.refundBill(bill.id, {
        amount: parseFloat(refundAmount),
        reason: refundReason
      });
      toast.success('Refund processed successfully');
      setIsRefundModalOpen(false);
      setRefundAmount('');
      setRefundReason('');
      fetchBillDetails();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process refund');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintInvoice = () => {
    window.open(`/opd/print/invoice/${bill.id}`, '_blank');
  };

  const getBillingErrorMessage = (error: any, fallback: string) => {
    const message = error?.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
    return fallback;
  };

  const paymentModes = [
    { id: 'CASH', label: 'Cash', icon: Banknote, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'CREDIT_CARD', label: 'Card', icon: CreditCard, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'UPI_QR', label: 'UPI QR', icon: QrCode, color: 'bg-violet-50 text-violet-600 border-violet-100' },
    { id: 'BANK_TRANSFER', label: 'Razorpay', icon: Globe, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
  ];

  if (isLoading) {
    return (
      <ReceptionLayout>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
           <div className="w-10 h-10 border-4 border-slate-100 border-t-teal-600 rounded-full animate-spin"></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Financial Records...</p>
        </div>
      </ReceptionLayout>
    );
  }

  // Case 1: No case selected - show list of pending bills
  if (!caseId) {
    return (
      <ReceptionLayout>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Billing Dashboard</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4">Manage patient payments and pending dues</p>
            </div>
            <div>
              <button
                onClick={() => router.push('/reception/billing/history')}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
              >
                <History className="w-4 h-4" />
                View History
              </button>
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
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {pendingBills.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-8 py-20 text-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
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
                                {pb.isFinalized ? (
                                  <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border border-emerald-100 flex items-center justify-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Finalized
                                  </span>
                                ) : (
                                  <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border border-amber-100 flex items-center justify-center gap-1">
                                    <Clock className="w-3 h-3" /> Draft
                                  </span>
                                )}
                             </td>
                             <td className="px-8 py-5 text-center">
                                <button 
                                  onClick={() => router.push(`/reception/billing?caseId=${pb.caseId}`)}
                                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                >
                                   View Details
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

  // Case 2: Case selected but no bill generated yet
  if (caseId && !bill) {
    return (
      <ReceptionLayout>
        <div className="max-w-4xl mx-auto py-20 text-center space-y-8">
           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-10 h-10" />
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Clinical Bill Not Initialized</h2>
              <p className="text-xs font-bold text-slate-400 uppercase mt-2 tracking-widest">The system needs to generate a financial record for this consultation</p>
           </div>
           <div className="flex flex-col items-center gap-4">
              <button 
                onClick={handleGenerateBill}
                disabled={isSubmitting}
                className="px-8 py-4 bg-teal-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center gap-3"
              >
                {isSubmitting ? 'Generating...' : 'Auto-Generate Bill from Consultation Data'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => router.push('/reception/billing')}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900"
              >
                Go Back
              </button>
           </div>
        </div>
      </ReceptionLayout>
    );
  }

  return (
    <ReceptionLayout>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
           <div className="flex items-center gap-4">
              {bill.isFinalized && (
                <button 
                  onClick={() => setIsRefundModalOpen(true)}
                  className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100 flex items-center gap-2"
                >
                  <Ban className="w-3.5 h-3.5" />
                  Issue Refund
                </button>
              )}
              <button 
                onClick={handlePrintInvoice}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Invoice
              </button>
              <button 
                onClick={() => router.push('/reception/billing')}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-2"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                Back
              </button>
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
                       Bill Summary [ {bill.billNumber} ]
                    </h3>
                    <div className="flex items-center gap-4">
                       <div className="group relative">
                          <ShieldAlert className="w-4 h-4 text-amber-500 cursor-help" />
                          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 text-white p-3 rounded-xl text-[9px] font-bold leading-relaxed opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 shadow-xl">
                             Discount field is restricted. Only authorized personnel can apply discounts.
                          </div>
                       </div>
                       {bill.isFinalized ? (
                         <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100">
                            <ShieldCheck className="w-3.5 h-3.5" /> Finalized
                         </div>
                       ) : (
                         <button 
                           onClick={handleFinalize}
                           disabled={isSubmitting}
                           className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-amber-100 hover:bg-amber-100 transition-all"
                         >
                            <Lock className="w-3.5 h-3.5" /> Finalize Bill
                         </button>
                       )}
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
                 <div className="p-5 bg-slate-100/80 border-t border-slate-200 text-slate-800 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-b-3xl">
                     <p className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                        TOTAL GROSS: <span className="text-base font-black">₹ {bill.grossAmount.toLocaleString()}</span>
                     </p>
                     <p className="text-slate-300 font-bold hidden md:block">|</p>
                     <p className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                        TOTAL DISCOUNT: <span className="text-base font-black text-rose-600">₹ {bill.discountTotal.toLocaleString()}</span>
                     </p>
                     <p className="text-slate-300 font-bold hidden md:block">|</p>
                     <p className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-800">
                        NET PAYABLE: <span className="text-lg font-black">₹ {bill.netAmount.toLocaleString()}</span>
                     </p>
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
              <div className="bg-slate-100 rounded-lg p-2 font-mono text-[11px] leading-relaxed text-slate-800 relative group overflow-hidden">
                 <div className="bg-slate-900 text-white p-3 font-bold text-sm tracking-widest text-center uppercase">
                    RECEIPT
                 </div>
                 <div className="bg-white p-4 border border-slate-200 border-t-0 min-h-[200px]">
                    <p className="font-bold mb-1">{bill.patient.firstName} {bill.patient.lastName} | {bill.patient.mrdNumber}</p>
                    <p className="text-slate-500 mb-4 border-b border-dashed border-slate-300 pb-4">Case: {bill.case.caseNumber}</p>
                    
                    <div className="space-y-2 mb-4">
                       {bill.items.map((item: any) => (
                         <div key={item.id} className="flex justify-between">
                            <span>{item.serviceName}</span>
                            <span>{item.totalPrice.toLocaleString()}</span>
                         </div>
                       ))}
                    </div>
                    
                    <div className="border-t border-dashed border-slate-300 pt-2 mb-2 flex justify-between text-slate-500">
                       <span>Discount:</span>
                       <span>{bill.discountTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 pb-4 border-b border-dashed border-slate-300">
                       <span>Net Paid:</span>
                       <span>{bill.netAmount.toLocaleString()} — {bill.paidAmount > 0 ? bill.paymentMode : paymentMode}</span>
                    </div>
                    
                    <div className="mt-4 text-slate-500 text-[10px] flex justify-between">
                       <span>Receipt No: {bill.billNumber || 'PENDING'}</span>
                       <span>{format(new Date(), 'dd/MM/yyyy')}</span>
                    </div>
                 </div>

                 <button 
                   onClick={handlePrintInvoice}
                   className="absolute inset-0 bg-slate-900/10 hover:bg-slate-900/20 transition-all flex items-center justify-center group-hover:opacity-100 opacity-0 backdrop-blur-[1px]"
                 >
                    <div className="bg-white px-4 py-2 rounded-lg shadow-xl text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                       <Printer className="w-3.5 h-3.5" />
                       Print Receipt
                    </div>
                 </button>
              </div>

              {/* REFUND MODAL */}
               {isRefundModalOpen && (
                 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95">
                       <div className="text-center space-y-2">
                          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Receipt className="w-8 h-8" />
                          </div>
                          <h3 className="text-xl font-black text-slate-900 uppercase">Issue Refund</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Process financial reversal for {bill.billNumber}</p>
                       </div>

                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refund Amount (MAX: ₹{bill.paidAmount})</label>
                             <input 
                               type="number" 
                               value={refundAmount}
                               onChange={(e) => setRefundAmount(e.target.value)}
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black outline-none focus:border-rose-500"
                               placeholder="0.00"
                             />
                          </div>

                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason for Refund</label>
                             <textarea 
                               value={refundReason}
                               onChange={(e) => setRefundReason(e.target.value)}
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-rose-500 h-24 resize-none"
                               placeholder="ENTER REASON..."
                             />
                          </div>

                          <div className="flex gap-4">
                             <button 
                               onClick={() => setIsRefundModalOpen(false)}
                               className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200"
                             >
                                Cancel
                             </button>
                             <button 
                               onClick={handleRefund}
                               disabled={isSubmitting || !refundAmount || !refundReason}
                               className="flex-1 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-100 disabled:opacity-50"
                             >
                                Confirm Refund
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
           </div>

           {/* RIGHT COLUMN: PAYMENT COLLECTION */}
           <div className="space-y-8">
              
              {/* 🔷 SECTION 2: PAYMENT COLLECTION */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                  <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                     <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        Payment Collection
                     </h3>
                     {bill.paymentStatus !== 'PAID' && (
                       <div className="flex items-center gap-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer" htmlFor="foc-toggle">FOC Mode</label>
                          <label htmlFor="foc-toggle" className="relative inline-flex items-center cursor-pointer">
                             <input id="foc-toggle" type="checkbox" checked={isFoc} disabled={isSubmitting} onChange={(e) => setIsFoc(e.target.checked)} className="sr-only peer" />
                             <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                          </label>
                       </div>
                     )}
                  </div>
                  
                  {bill.paymentStatus === 'PAID' ? (
                     <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border-8 border-emerald-50/50">
                           <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h4 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-2">Payment Settled</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-[250px] mb-8 leading-relaxed">This consultation has been fully paid. No further collections required.</p>
                        <button 
                           onClick={() => window.open(`/opd/print/invoice/${bill.id}`, '_blank')}
                           className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200">
                           <Printer className="w-4 h-4" />
                           Print Official Receipt
                        </button>
                     </div>
                  ) : (
                     <div className="flex flex-col flex-1">
                        <div className="p-6 space-y-8 flex-1">
                           {isFoc ? (
                              <div className="p-6 bg-amber-50/50 border border-amber-200 rounded-2xl text-xs space-y-4">
                                 <p className="font-black text-amber-800 uppercase tracking-widest flex items-center gap-2">
                                   <AlertCircle className="w-4 h-4" />
                                   Free of Charge (FOC) Justification
                                 </p>
                                 <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Standard billing fields are hidden. An internal note is required to process this waiver.</p>
                                 <textarea 
                                   className="w-full p-4 bg-white border border-amber-200 rounded-xl outline-none h-32 resize-none font-medium text-slate-700 placeholder:text-slate-300 focus:border-amber-400 transition-all"
                                   placeholder="ENTER JUSTIFICATION HERE..."
                                   value={focReason} onChange={(e) => setFocReason(e.target.value)} disabled={isSubmitting}
                                 />
                              </div>
                           ) : (
                              <div className="space-y-8">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Collected (₹) *</label>
                                        <input type="number" value={amountCollected} onChange={(e) => setAmountCollected(e.target.value)} disabled={isSubmitting} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-300" placeholder="0.00" />
                                     </div>
                                     <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction / Receipt ID</label>
                                        <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} disabled={isSubmitting} placeholder="AUTO-GENERATED IF EMPTY" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition-all uppercase placeholder:normal-case placeholder:text-slate-300 placeholder:font-medium" />
                                     </div>
                                  </div>

                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Mode *</label>
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {paymentModes.map((mode) => {
                                           const Icon = mode.icon;
                                           const isSelected = paymentMode === mode.id;
                                           return (
                                             <button 
                                               key={mode.id} 
                                               onClick={() => setPaymentMode(mode.id)}
                                               disabled={isSubmitting}
                                               className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm shadow-teal-100' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
                                             >
                                                <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{mode.label}</span>
                                             </button>
                                           );
                                        })}
                                     </div>
                                  </div>
                              </div>
                           )}
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 mt-auto">
                            <button 
                              onClick={() => router.push('/reception/billing')}
                              disabled={isSubmitting}
                              className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                            >
                               MARK PENDING
                            </button>
                            <button 
                              onClick={handleCollectPayment}
                              disabled={isSubmitting}
                              className="flex-[2] py-4 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-2"
                            >
                               COLLECT PAYMENT & RECEIPT <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                     </div>
                  )}
              </div>

           </div>
        </div>
      </div>

      {/* QR PAYMENT MODAL (UPI & Razorpay) */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            {/* Header */}
            <div className={`p-6 text-center ${qrMode === 'UPI' ? 'bg-gradient-to-br from-violet-50 to-purple-50' : 'bg-gradient-to-br from-indigo-50 to-blue-50'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${qrMode === 'UPI' ? 'bg-violet-100 text-violet-600' : 'bg-indigo-100 text-indigo-600'}`}>
                <QrCode className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {qrMode === 'UPI' ? 'Scan & Pay via UPI' : 'Scan to Pay — Razorpay'}
              </h2>
              <p className="text-[11px] font-medium text-slate-500 mt-1">
                {qrMode === 'UPI'
                  ? `Pay directly to ${upiConfig?.upiPayeeName || 'Clinic'} · ${upiConfig?.upiId}`
                  : `Payment link also sent to ${bill?.patient?.firstName}'s WhatsApp`}
              </p>
            </div>

            <div className="p-6 space-y-4 text-center">
              {/* QR Code */}
              <div className="flex justify-center p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm mx-auto w-fit">
                <QRCodeCanvas value={qrUrl} size={190} level="H" includeMargin />
              </div>

              {/* Amount */}
              <div className={`p-4 rounded-2xl ${qrMode === 'UPI' ? 'bg-violet-50 border border-violet-100' : 'bg-indigo-50 border border-indigo-100'}`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount Due</p>
                <p className="text-3xl font-black text-slate-900">₹{amountCollected}</p>
              </div>

              {/* UPI apps hint */}
              {qrMode === 'UPI' && (
                <p className="text-[10px] font-bold text-slate-400">
                  Works with GPay · PhonePe · Paytm · BHIM · Any UPI app
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
              {qrMode === 'UPI' ? (
                // UPI: Manual "Mark as Paid" since no webhook
                <button
                  onClick={async () => {
                    try {
                      setIsSubmitting(true);
                      await api.post(`/billing/${bill.id}/pay`, {
                        isFoc: false,
                        focReason: '',
                        splits: [{
                          amount: parseFloat(amountCollected),
                          paymentMode: 'CASH', // maps to UPI in ledger note
                          transactionId: `UPI-${Date.now()}`
                        }]
                      }, { headers: { 'Idempotency-Key': crypto.randomUUID() } });
                      const updatedRes = await api.get(`/billing/${caseId}`);
                      setBill(updatedRes.data);
                      setIsQrModalOpen(false);
                      toast.success('UPI Payment confirmed!');
                      setTimeout(() => {
                        window.open(`/opd/print/invoice/${updatedRes.data.id}`, '_blank');
                      }, 800);
                    } catch (err: any) {
                      toast.error(err.response?.data?.message || 'Failed to record payment');
                    } finally {
                      setIsSubmitting(false);
                      paymentSubmittingRef.current = false;
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <CheckCircle2 className="w-4 h-4" /> Patient Has Paid — Confirm
                </button>
              ) : (
                // Razorpay: Webhook-driven, just verify
                <button
                  onClick={async () => {
                    try {
                      const checkRes = await api.get(`/billing/${caseId}`);
                      if (checkRes.data.paymentStatus === 'PAID') {
                        setBill(checkRes.data);
                        setIsQrModalOpen(false);
                        toast.success('Payment received!');
                        setTimeout(() => {
                          window.open(`/opd/print/invoice/${checkRes.data.id}`, '_blank');
                        }, 800);
                      } else {
                        toast.error('Payment not received yet. Please wait for patient to complete.');
                      }
                    } catch (e) {
                      toast.error('Failed to verify status');
                    }
                  }}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Verify Payment Status
                </button>
              )}
              <button
                onClick={() => { setIsQrModalOpen(false); setIsSubmitting(false); paymentSubmittingRef.current = false; }}
                className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                Close / Pay Later
              </button>
            </div>
          </div>
        </div>
      )}
    </ReceptionLayout>
  );
};

export default BillingView;

