'use client';

import React from 'react';
import { 
  Printer, 
  ChevronLeft, 
  MapPin, 
  Phone, 
  Globe, 
  Calendar,
  User,
  AlertCircle,
  FileText,
  CreditCard,
  Hash,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { getAssetPath } from '@/lib/path-utils';

interface InvoicePrintViewProps {
  data: any; // The full bill record from getBillById
}

const InvoicePrintView: React.FC<InvoicePrintViewProps> = ({ data }) => {
  const router = useRouter();
  
  if (!data) return null;

  const { 
    billNumber, 
    grossAmount, 
    discountTotal, 
    netAmount, 
    paidAmount, 
    balanceAmount, 
    isFinalized, 
    finalizedAt, 
    patient, 
    case: patientCase, 
    items = [], 
    payments = [],
    refunds = []
  } = data;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: any) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Number(val));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10 print:p-0 print:bg-white font-sans text-slate-900">
      {/* UI Controls - Hidden on Print */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-4">
           {!isFinalized && (
             <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
               <AlertCircle className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-wider">Status: Draft / Unfinalized</span>
             </div>
           )}
           <button 
             onClick={handlePrint}
             className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
           >
              <Printer className="w-4 h-4" />
              PRINT INVOICE
           </button>
        </div>
      </div>

      {/* The Actual Invoice - A4 Aspect Ratio */}
      <div className="max-w-[800px] mx-auto bg-white shadow-2xl print:shadow-none min-h-[1100px] flex flex-col p-12 border border-slate-100 print:border-none relative overflow-hidden">
        
        {/* Watermark for non-finalized */}
        {!isFinalized && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-45 select-none">
            <span className="text-[150px] font-black uppercase italic">DRAFT BILL</span>
          </div>
        )}

        {/* Header - Hospital Branding */}
        <div className="flex items-start justify-between border-b-4 border-slate-900 pb-10">
           <div className="flex items-center gap-6">
              <div className="relative w-20 h-20">
                <Image 
                  src={getAssetPath('/hospital-logo.png')} 
                  alt="MedFlow Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">MedFlow EMR</h1>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Patient Financial Services</p>
              </div>
           </div>
           
           <div className="text-right">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Tax Invoice</h2>
              <div className="flex items-center justify-end gap-2 text-slate-900 mb-1">
                 <p className="text-[10px] font-black uppercase tracking-wider">Medical District, Phase II</p>
                 <MapPin className="w-3 h-3" />
              </div>
              <div className="flex items-center justify-end gap-2 text-slate-600 mb-1">
                 <p className="text-[10px] font-bold">+91 98765 43210</p>
                 <Phone className="w-3 h-3" />
              </div>
              <div className="flex items-center justify-end gap-2 text-slate-600">
                 <p className="text-[10px] font-bold underline">billing@medflow-system.com</p>
                 <Globe className="w-3 h-3" />
              </div>
           </div>
        </div>

        {/* Patient & Bill Details Row */}
        <div className="grid grid-cols-2 gap-10 py-8 border-b border-slate-100">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Bill To</h4>
              <div className="space-y-1">
                <p className="text-lg font-black text-slate-900 uppercase">{patient?.firstName} {patient?.lastName}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                  <span>MRD: {patient?.mrdNumber}</span>
                  <span>•</span>
                  <span>{patient?.gender} / {patient?.profile?.dob ? `${Math.floor((new Date().getTime() - new Date(patient.profile.dob).getTime()) / 31536000000)}Y` : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Invoice No:</span>
                <span className="font-black text-slate-900 uppercase">{billNumber}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Date:</span>
                <span className="font-black text-slate-900 uppercase">
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Case ID:</span>
                <span className="font-black text-slate-900 uppercase">#{patientCase?.caseNumber}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Doctor:</span>
                <span className="font-black text-slate-900 uppercase">Dr. {patientCase?.doctor?.name}</span>
              </div>
            </div>
        </div>

        {/* Invoice Items Table */}
        <div className="mt-8 flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest w-12">#</th>
                <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Description / Service</th>
                <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Rate</th>
                <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Disc%</th>
                <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-4 text-[10px] font-black text-slate-300">{idx + 1}</td>
                  <td className="py-4">
                    <p className="text-xs font-black text-slate-900 uppercase">{item.serviceName}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">{item.itemType}</p>
                  </td>
                  <td className="py-4 text-right text-xs font-bold text-slate-700">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 text-center text-xs font-black text-slate-900">{item.quantity}</td>
                  <td className="py-4 text-center text-xs font-bold text-slate-500">{item.discount}%</td>
                  <td className="py-4 text-right text-xs font-black text-slate-900">{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                    No items recorded on this bill.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="mt-10 grid grid-cols-2 gap-20">
           <div className="space-y-6">
              {/* Payment History */}
              {payments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard className="w-3 h-3" />
                    Transaction History
                  </h4>
                  <div className="space-y-2">
                    {payments.map((p: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start text-[10px] border-b border-slate-50 pb-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-500 uppercase">{p.paymentMode}</span>
                          <span className="font-medium text-slate-400 text-[8px] mt-0.5">{new Date(p.paymentDate || p.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                          {p.transactionId && <span className="font-medium text-slate-400 text-[8px]">Txn: {p.transactionId}</span>}
                        </div>
                        <span className="font-black text-slate-900">{formatCurrency(p.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Refund History */}
              {refunds.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <Receipt className="w-3 h-3" />
                    Refunds Issued
                  </h4>
                  <div className="space-y-2">
                    {refunds.map((r: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] border-b border-red-50 pb-1">
                        <span className="font-bold text-red-500 uppercase">REV • {new Date(r.createdAt).toLocaleDateString()}</span>
                        <span className="font-black text-red-600">-{formatCurrency(r.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
           </div>

           <div className="space-y-3 bg-slate-900 p-6 rounded-2xl text-white">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold uppercase tracking-widest opacity-60">Gross Total</span>
                <span className="font-black">{formatCurrency(grossAmount)}</span>
              </div>
              {Number(discountTotal) > 0 && (
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold uppercase tracking-widest opacity-60">Tax / Discount</span>
                  <span className="font-black text-emerald-400">-{formatCurrency(discountTotal)}</span>
                </div>
              )}
              <div className="h-px bg-white/10 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest">Net Payable</span>
                <span className="text-xl font-black">{formatCurrency(netAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] mt-4 pt-4 border-t border-white/10">
                <span className="font-bold uppercase tracking-widest opacity-60">Total Paid</span>
                <span className="font-black text-emerald-400">{formatCurrency(paidAmount)}</span>
              </div>
              
              {Number(balanceAmount) > 0 ? (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-rose-500/30">
                  <span className="text-sm font-black uppercase tracking-widest text-rose-400">Yet to Pay</span>
                  <span className="text-xl font-black text-rose-400">{formatCurrency(balanceAmount)}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-emerald-500/30">
                  <span className="text-sm font-black uppercase tracking-widest text-emerald-400">Balance Due</span>
                  <span className="text-xl font-black text-emerald-400">₹0.00</span>
                </div>
              )}
           </div>
        </div>

        {/* Footer - Finalization & Policy */}
        <div className="mt-auto pt-16 border-t border-slate-100 flex justify-between items-end">
           <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Bill Finalized At</p>
                <p className="text-[10px] font-bold text-slate-900 uppercase">
                  {isFinalized ? new Date(finalizedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'NOT FINALIZED'}
                </p>
              </div>
              
              <div className="max-w-xs">
                <p className="text-[7px] font-bold text-slate-400 uppercase leading-relaxed">
                  * This is a computer-generated tax invoice. No physical signature required if finalized. 
                  All refunds are subject to clinical audit and management approval. 
                  Payments are processed securely via MedFlow Financial Bridge.
                </p>
              </div>

              <div className="flex items-center gap-2 opacity-50">
                 <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[8px] font-black text-slate-400 border border-slate-200 uppercase">
                    BARCODE
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Financial Audit</p>
                    <p className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter">REF: {data.id?.split('-')[0]}</p>
                 </div>
              </div>
           </div>
           
           <div className="text-center w-64 space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center text-slate-900">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="text-[8px] font-black text-slate-900 uppercase tracking-[0.2em]">Verified Secure</p>
              </div>
              <div className="h-px bg-slate-900"></div>
              <p className="text-xs font-black text-slate-900 uppercase">Cashier Signature</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MedFlow Billing Dept.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrintView;
