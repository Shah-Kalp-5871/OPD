import React from 'react';
import { IndianRupee, Receipt, Tag, ShieldCheck, X } from 'lucide-react';
import { Card, Badge } from './ClinicalDesignSystem';
import { useBillingSummary } from '../hooks/useBillingSummary';

interface BillingSummaryPanelProps {
  caseId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const BillingSummaryPanel: React.FC<BillingSummaryPanelProps> = ({ caseId, isOpen, onClose }) => {
  const { bill, loading } = useBillingSummary(caseId);
  
  const netAmount = parseFloat(bill?.netAmount || 0);
  const paidAmount = parseFloat(bill?.paidAmount || 0);
  const balanceAmount = parseFloat(bill?.balanceAmount || 0);
  const discountTotal = parseFloat(bill?.discountTotal || 0);
  const isPaid = bill?.paymentStatus === 'PAID';
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`absolute w-[360px] bg-white border-l border-slate-200 flex flex-col h-full right-0 top-0 z-40 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col gap-1">
            <h3 className="text-slate-900 font-extrabold text-lg tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              Billing Summary
            </h3>
            {isPaid && (
              <Badge variant="emerald" className="self-start text-[10px]">FULLY PAID</Badge>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 bg-white border border-slate-200 rounded-xl text-slate-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Total Summary */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <IndianRupee className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex flex-col gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Outstanding (Balance)</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-medium text-slate-300">₹</span>
                  <span className="text-4xl font-black tracking-tight">{loading ? '...' : balanceAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-slate-700/50 pt-3">
                <div className="flex flex-col">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Net Payable</span>
                   <span className="text-sm font-bold text-slate-200">₹{loading ? '...' : netAmount.toLocaleString()}</span>
                </div>
                <div className="flex flex-col text-right">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Paid</span>
                   <span className="text-sm font-bold text-emerald-400">₹{loading ? '...' : paidAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Visit Breakdown</h4>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
              {bill?.items?.length > 0 ? (
                bill.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 truncate max-w-[180px]">{item.serviceName} {item.quantity > 1 ? `(x${item.quantity})` : ''}</span>
                    <span className="text-sm font-black text-slate-900">₹{parseFloat(item.totalPrice || 0).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 text-center italic py-2">No items billed yet</div>
              )}

              {discountTotal > 0 && (
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 border-dashed">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Discount
                  </span>
                  <span className="text-sm font-black text-emerald-600">-₹{discountTotal.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>



          {/* Payment Status Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 mt-4">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-900 tracking-tight">Payment Verification</p>
              <p className="text-[10px] font-medium text-blue-700 leading-relaxed mt-1">
                Some procedures require payment verification before approval. Reception will clear payments automatically.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default BillingSummaryPanel;
