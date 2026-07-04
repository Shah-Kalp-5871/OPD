import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, CalendarClock, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const QueueStatusBadge = ({ entry, onCancel }: { entry: any, onCancel: (apptId: string) => void }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'WAITING':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'IN_SESSION':
        return 'bg-sky-100 text-[#094861] border-sky-200 animate-pulse';
      case 'COMPLETED':
        return 'bg-sky-100 text-sky-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'SCHEDULED_APPOINTMENT':
      case 'SCHEDULED':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getBadgeLabel = (status: string) => {
    if (status === 'SCHEDULED_APPOINTMENT') return 'SCHEDULED APPT';
    if (status === 'IN_SESSION') return 'IN PROGRESS';
    return status;
  };

  const isScheduled = entry.status === 'SCHEDULED_APPOINTMENT' || entry.status === 'SCHEDULED';

  return (
    <div className="relative inline-flex flex-col items-center gap-1" ref={menuRef}>
      <div 
        className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border inline-flex items-center ${getBadgeStyle(entry.status)} ${isScheduled ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
        onClick={(e) => {
          if (isScheduled) {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }
        }}
      >
        {getBadgeLabel(entry.status)}
        {isScheduled && <MoreVertical className="w-3 h-3 ml-0.5" />}
      </div>

      {isOpen && isScheduled && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-32 bg-white rounded-lg shadow-xl shadow-slate-200/50 border border-slate-200 z-50 overflow-hidden py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              router.push(`/reception/appointments/reschedule/${entry.appointmentId}`);
            }}
            className="w-full text-left px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors border-b border-slate-100"
          >
            <CalendarClock className="w-3.5 h-3.5" />
            Reschedule
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onCancel(entry.appointmentId);
            }}
            className="w-full text-left px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
