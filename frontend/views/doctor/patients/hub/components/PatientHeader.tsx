import React from 'react';
import { User, Phone, Activity, Stethoscope, Printer, Droplet, Calendar, Hash, ShieldAlert } from 'lucide-react';
import { Patient } from '../types';
import { toast } from 'sonner';

interface PatientHeaderProps {
  patient: Patient;
  completion: number;
  hasOpenCase: boolean;
  activeCase?: any;
  onCheckIn?: () => void;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ 
  patient, 
  completion, 
  hasOpenCase,
  activeCase,
  onCheckIn
}) => {
  const regDate = patient.createdAt
    ? new Date(patient.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '--';

  const lastVisitDate = patient.cases && patient.cases.length > 0
    ? (() => {
        const dates = patient.cases.map((c: any) => new Date(c.createdAt).getTime());
        const maxDate = Math.max(...dates);
        return new Date(maxDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      })()
    : '--';

  const handlePrintSticker = () => {
    const printWindow = window.open('about:blank', `pw_${Date.now()}`, 'left=50,top=50,width=400,height=400');
    if (!printWindow) { toast.error('Allow popups to print.'); return; }
    printWindow.document.write(`<html><head><title>Sticker</title><style>@page{size:80mm 50mm;margin:0}body{font-family:monospace;padding:10px;margin:0;width:80mm;height:50mm;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between}.t{font-size:8px;text-transform:uppercase;color:#666;margin-bottom:2px}.v{font-size:11px;font-weight:bold;margin-bottom:8px}.g{display:grid;grid-template-columns:1fr 1fr;gap:8px}.bc{border-top:1px dashed #ccc;padding-top:6px;display:flex;flex-direction:column;align-items:center}.bl{display:flex;gap:1px;height:30px;align-items:flex-end;margin-bottom:2px}.bline{background:#000;height:100%}.bt{font-size:8px;letter-spacing:2px;color:#333}</style></head><body><div><div class="t">Patient Full Name</div><div class="v">${patient.firstName || '---'} ${patient.lastName || '---'}</div><div class="g"><div><div class="t">MRD Number</div><div class="v" style="color:#0d9488">${patient.mrdNumber}</div></div><div><div class="t">Gender | Age</div><div class="v">${patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : patient.gender} | ${patient.profile?.age ? patient.profile.age + ' Yrs' : '-- Yrs'}</div></div></div></div><div class="bc"><div class="bl">${[2,4,1,3,2,5,2,4,1,6,2,4,2,3,1,5,2,4].map(w=>`<div class="bline" style="width:${w}px"></div>`).join('')}</div><div class="bt">${patient.mrdNumber}</div></div><script>window.onload=function(){window.print();setTimeout(function(){window.close()},500)}</script></body></html>`);
    printWindow.document.close();
  };

  return (
    <div className="bg-white border border-sky-100 rounded-[2rem] relative z-10 overflow-hidden" style={{boxShadow: '0 4px 6px -1px rgba(249,115,22,0.08), 0 10px 30px -5px rgba(249,115,22,0.12), 0 2px 0 0 rgba(249,115,22,0.2), inset 0 1px 0 rgba(255,255,255,0.9)'}}>
      {/* Orange accent top strip */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400" />
      {/* Top Identity Block */}
      <div className="px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border border-sky-100 shadow-[0_4px_12px_rgba(249,115,22,0.15)] flex items-center justify-center text-orange-300">
            <User className="w-12 h-12" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {patient.firstName} {patient.lastName}
              </h1>
              <span className="px-3 py-1 bg-sky-50 text-[#0d6282] border border-sky-200 rounded-lg text-[10px] font-black uppercase tracking-widest">
                Patient File
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-900 font-bold uppercase tracking-tight">MRD-{patient.mrdNumber}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient.profile?.age || '--'} Yrs / {patient.gender === 'M' ? 'Male' : 'Female'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{patient.mobile}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{patient.profile?.allergies || 'No Known Allergies'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {hasOpenCase && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-sky-200 px-6 py-3 rounded-2xl flex flex-col items-end text-right" style={{boxShadow: '0 2px 8px rgba(249,115,22,0.15)'}}>
              <span className="text-[10px] font-black text-[#0d6282] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                <Activity className="w-3.5 h-3.5" /> Active Consultation
              </span>
              <span className="text-sm font-black text-sky-900">Dr. {activeCase?.doctor?.name || 'Unassigned'}</span>
              <span className="text-[11px] font-bold text-sky-700/80">Case #{activeCase?.caseNumber}</span>
            </div>
          )}
          <button 
            onClick={handlePrintSticker}
            className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 rounded-2xl transition-all shadow-sm h-full print:hidden"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Secondary Meta Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 bg-gradient-to-r from-orange-50/60 to-amber-50/40 border-t border-sky-100 divide-x divide-orange-100">
        <div className="px-6 py-4 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Group</p>
          <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-rose-500" /> {patient.profile?.bloodGroup || '--'}
          </p>
        </div>
        <div className="px-6 py-4 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reg. Date</p>
          <p className="text-sm font-bold text-slate-800">{regDate}</p>
        </div>
        <div className="px-6 py-4 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Visit</p>
          <p className="text-sm font-bold text-slate-800">{lastVisitDate}</p>
        </div>
        <div className="px-6 py-4 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Visits</p>
          <p className="text-sm font-bold text-slate-800">{patient.cases?.length || 0}</p>
        </div>
        <div className="px-6 py-4 space-y-2 bg-white border-l border-sky-100">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">File Status</p>
            <span className="text-[10px] font-bold text-[#0d6282] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">{completion}%</span>
          </div>
          <div className="w-full bg-sky-100/60 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-orange-400 to-amber-400 h-full transition-all duration-1000 shadow-sm" 
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
