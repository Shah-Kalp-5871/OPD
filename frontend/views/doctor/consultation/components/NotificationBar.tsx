import React from 'react';
import { MessageSquare, IndianRupee, ChevronUp, Bell } from 'lucide-react';
import { Badge } from './ClinicalDesignSystem';
import { useBillingSummary } from '../hooks/useBillingSummary';

interface NotificationBarProps {
  caseId?: string;
  onOpenPayments: () => void;
  onOpenChat: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ caseId, onOpenPayments, onOpenChat }) => {
  const { bill, loading } = useBillingSummary(caseId);
  const totalAmount = bill?.balanceAmount || bill?.netAmount || 0;
  const isPaid = bill?.paymentStatus === 'PAID';
  return (
    <div className="bg-white border-t border-slate-200 h-12 flex items-center justify-between px-4 shrink-0 relative z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
      <div className="flex items-center h-full">
        {/* TODO: Phase 5 - Connect to WebSockets/SSE for real-time chat */}
        <button onClick={onOpenChat} className="flex items-center gap-3 h-full px-4 hover:bg-slate-50 transition-colors border-r border-slate-100 group">
          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="flex flex-col items-start justify-center">
             <span className="text-[10px] font-black text-slate-800 tracking-wide uppercase leading-none mb-0.5">Clinic Chat</span>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Live Comms</span>
          </div>
        </button>
        
        {/* 'No messages yet' removed per user request */}
      </div>

      <div className="flex items-center h-full">
        {/* TODO: Phase 2/3 - Wire up to real billing updates */}
        <button onClick={onOpenPayments} className="flex items-center gap-3 h-full px-6 hover:bg-slate-50 transition-colors border-l border-slate-100 group">
          <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Live Billing</p>
            <p className="text-[11px] font-bold text-slate-600 leading-none">
              {loading ? 'Syncing...' : isPaid ? (
                <span className="text-emerald-600">PAID</span>
              ) : (
                `₹${parseFloat(totalAmount.toString()).toLocaleString()}`
              )}
            </p>
          </div>
          <ChevronUp className="w-4 h-4 text-slate-300 ml-2 group-hover:text-slate-500 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBar;
