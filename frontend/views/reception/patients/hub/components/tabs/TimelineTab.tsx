import React from 'react';
import { Clock, CheckCircle2, Circle, ArrowRight, Stethoscope, Activity, FileText } from 'lucide-react';
import { Patient } from '../../types';

interface TimelineTabProps {
  patient: Patient;
  hasOpenCase: boolean;
  onStartVisit: () => void;
}

const TimelineTab: React.FC<TimelineTabProps> = ({
  patient,
  hasOpenCase,
  onStartVisit
}) => {
  // Combine cases and registration into a single clinical journey
  const clinicalJourney = [
    ...(patient.cases || []).map(c => ({
      id: c.id,
      date: new Date(c.createdAt),
      type: 'visit',
      title: `Clinical Consultation - ${c.caseNumber}`,
      subtitle: `Dr. ${c.doctor?.name || 'Assigned Consultant'}`,
      status: c.status,
      icon: Stethoscope,
      details: c.complaint
    })),
    {
      id: 'reg',
      date: new Date(), // Placeholder for registration date
      type: 'registration',
      title: 'Initial Patient Registration',
      subtitle: 'Patient file created in system',
      status: 'CLOSED',
      icon: FileText,
      details: `MRD Number: ${patient.mrdNumber}`
    }
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            Chronological Patient Story
          </h3>
          {!hasOpenCase && (
            <button 
              onClick={onStartVisit}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
            >
              Log New Visit
            </button>
          )}
        </div>

        <div className="p-8">
          <div className="relative space-y-8">
            {/* Timeline Line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

            {clinicalJourney.map((event, index) => (
              <div key={event.id} className="relative flex gap-6 group">
                <div className={`z-10 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                  event.status === 'OPEN' ? 'bg-teal-500 text-white animate-pulse' : 'bg-slate-200 text-slate-500'
                }`}>
                  <event.icon className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className={`text-[11px] font-black uppercase tracking-tight ${
                        event.status === 'OPEN' ? 'text-teal-700' : 'text-slate-800'
                      }`}>
                        {event.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {event.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 tabular-nums">
                        {event.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {event.details && (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">
                        "{event.details}"
                      </p>
                    </div>
                  )}

                  {index < clinicalJourney.length - 1 && (
                    <div className="flex items-center gap-2 pt-2">
                      <div className="h-px flex-1 bg-slate-100"></div>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Previous Interaction</span>
                      <div className="h-px flex-1 bg-slate-100"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-900 rounded-xl flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-teal-400" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Journey Summary</p>
            <p className="text-xs font-bold uppercase tracking-tight">Systematic Review Complete</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-teal-400 transition-colors">
          View Detailed Analytics <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default TimelineTab;
