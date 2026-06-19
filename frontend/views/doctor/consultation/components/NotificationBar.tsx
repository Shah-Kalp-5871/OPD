import React from 'react';
import { MessageSquare, IndianRupee, ChevronUp, Bell } from 'lucide-react';
import { Badge } from './ClinicalDesignSystem';

interface NotificationBarProps {
  onOpenPayments: () => void;
  onOpenChat: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ onOpenPayments, onOpenChat }) => {
  return (
    <div className="bg-slate-900 h-12 flex items-center justify-between px-4 shrink-0 relative z-40">
      <div className="flex items-center h-full">
        <button onClick={onOpenChat} className="flex items-center gap-2 h-full px-4 hover:bg-slate-800 transition-colors border-r border-slate-700/50">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-300 tracking-wide uppercase">Nursing Chat</span>
          <Badge variant="blue" className="bg-blue-500 text-white border-none ml-1 scale-90">2 New</Badge>
        </button>
        
        <div className="flex items-center gap-2 px-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
          <Bell className="w-3.5 h-3.5" />
          <span>System Active</span>
        </div>
      </div>

      <div className="flex items-center h-full">
        <button onClick={onOpenPayments} className="flex items-center gap-3 h-full px-6 bg-emerald-900/30 hover:bg-emerald-900/50 transition-colors border-l border-emerald-800/30 group">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-black text-emerald-500/70 uppercase tracking-widest leading-none mb-0.5">Latest Payment</p>
            <p className="text-[11px] font-bold text-emerald-100 leading-none">Rahul Sharma - ₹500</p>
          </div>
          <ChevronUp className="w-4 h-4 text-emerald-500/50 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBar;
