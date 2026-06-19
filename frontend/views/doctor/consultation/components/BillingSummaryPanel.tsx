import React from 'react';
import { IndianRupee, Receipt, Tag, ShieldCheck, X } from 'lucide-react';
import { Card, Badge } from './ClinicalDesignSystem';

interface BillingSummaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

const BillingSummaryPanel: React.FC<BillingSummaryPanelProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed w-[360px] bg-white border-l border-slate-200 flex flex-col h-full right-0 top-0 z-50 shadow-2xl transition-transform transform translate-x-0">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-slate-900 font-extrabold text-lg tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            Billing Summary
          </h3>
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
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Outstanding (Today)</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-medium text-slate-300">₹</span>
                <span className="text-4xl font-black tracking-tight">1,250</span>
                <span className="text-sm font-bold text-slate-400">.00</span>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Visit Breakdown</h4>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Consultation Fee</span>
                <span className="text-sm font-black text-slate-900">₹500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Procedures</span>
                <span className="text-sm font-black text-slate-900">₹750</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-200 border-dashed">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> FOC / Discount
                </span>
                <span className="text-sm font-black text-emerald-600">-₹0</span>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Billing History</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Monthly</p>
                <p className="text-sm font-black text-slate-800 mt-1">₹3,450</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Yearly</p>
                <p className="text-sm font-black text-slate-800 mt-1">₹12,800</p>
              </div>
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
