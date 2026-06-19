import React, { useState } from 'react';
import { 
  FileCheck, 
  Printer, 
  Download, 
  Send, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  ClipboardList, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Stethoscope,
  Clock,
  User,
  Heart
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, Button, Badge, SectionHeader } from './ClinicalDesignSystem';

interface FinalReportTabProps {
  caseId: string;
  data: any;
  onFinalized?: () => void;
}

const FinalReportTab: React.FC<FinalReportTabProps> = ({ caseId, data, onFinalized }) => {
  const router = useRouter();
  const [finalizing, setFinalizing] = useState(false);
  const isCompleted = data?.status === 'COMPLETED';

  const handleFinalize = async () => {
    // Clinical validation
    const hasComplaint = data?.consultation?.complaint?.chiefComplaint;
    const hasProvisional = data?.consultation?.provisionalDiagnosis;
    const hasFinal = data?.consultation?.finalDiagnosis;

    if (!hasComplaint && !hasProvisional && !hasFinal) {
      toast.error('Cannot finalize: At least a Chief Complaint or Diagnosis is required.');
      return;
    }

    if (!window.confirm('Are you sure you want to finalize and sign this consultation? This will lock the record for editing.')) return;

    try {
      setFinalizing(true);
      await api.post(`/consultation/${caseId}/finalize`, { nextStage: 'BILLING' });
      toast.success('Consultation finalized and signed successfully');
      if (onFinalized) onFinalized();
      router.push('/doctor/dashboard');
    } catch (error: any) {
      console.error('Finalization failed', error);
      const message = error.response?.data?.message || 'Failed to finalize consultation';
      toast.error(message);
    } finally {
      setFinalizing(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8 pb-12 overflow-hidden">
      {/* Main Report Preview */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between">
          <SectionHeader 
            title="Final Discharge Summary" 
            subtitle="Comprehensive clinical review for documentation & legal archival."
          />
          <div className="flex items-center gap-3">
             <button 
               onClick={() => window.open(`/print/prescription/${caseId}`, '_blank')}
               className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all"
               title="Print Prescription"
             >
               <Printer className="w-5 h-5" />
             </button>
             <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all">
               <Download className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 p-12 relative overflow-hidden">
          {isCompleted && (
            <div className="absolute top-20 right-20 opacity-[0.03] pointer-events-none rotate-12">
               <ShieldCheck className="w-96 h-96 text-emerald-600" />
            </div>
          )}

          <div className="max-w-3xl mx-auto space-y-12">
            {/* Report Letterhead */}
            <div className="flex justify-between items-start border-b-2 border-slate-100 pb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white fill-white" />
                   </div>
                   <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">MedFlow <span className="font-light">Clinic</span></h1>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reg No: MH/2026/001452</p>
                <p className="text-[10px] font-medium text-slate-400 max-w-[200px]">123 Healthcare Boulevard, Medical District, City Center</p>
              </div>
              <div className="text-right">
                <Badge variant="blue" className="mb-2 uppercase tracking-widest text-[9px] px-3">Discharge Summary</Badge>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Outpatient Record</h2>
                <p className="text-[11px] font-bold text-slate-500 mt-1">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Patient Context Grid */}
            <div className="grid grid-cols-4 gap-4 p-8 bg-slate-50/50 rounded-[32px] border border-slate-100">
               <ReportInfoItem label="Patient Name" value={data?.patient?.name} />
               <ReportInfoItem label="MRD Number" value={data?.patient?.mrdNumber} />
               <ReportInfoItem label="Age / Gender" value={`${data?.patient?.age}Y / ${data?.patient?.gender}`} />
               <ReportInfoItem label="Clinician" value={`Dr. ${data?.doctor?.name}`} />
            </div>

            {/* Findings Section */}
            <div className="space-y-10">
              <ReportSection 
                title="Clinical Presentation" 
                content={data?.consultation?.complaint?.description || 'No specific complaints recorded.'} 
              />
              
              <ReportSection 
                title="Diagnosis (Confirmed)" 
                content={data?.consultation?.finalDiagnosis || data?.consultation?.provisionalDiagnosis || 'Clinical diagnosis pending final review.'} 
                isHighlighted 
              />

              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                   Medication Plan (Rx)
                </h3>
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Medicine</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Dosage</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Schedule</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {data?.prescriptions?.[0]?.items?.length > 0 ? (
                        data.prescriptions[0].items.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.drugName}</div>
                              <div className="text-[9px] font-medium text-slate-400 mt-0.5 uppercase italic">{item.instructions}</div>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-600">{item.dosage}</td>
                            <td className="px-6 py-4 text-xs font-black text-blue-600">{item.frequency}</td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500 text-right">{item.duration} Days</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-xs font-medium text-slate-400 italic">No medications prescribed.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {data?.investigationOrders?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Investigations Ordered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.investigationOrders.map((order: any, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {order.test?.name || 'Lab Test'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <ReportSection 
                title="Clinical Advice & Follow-up" 
                content={data?.consultation?.advice || 'Monitor symptoms and follow up if symptoms persist.'} 
                isItalic
              />

              {/* Digital Footer */}
              <div className="pt-20 flex justify-end">
                <div className="text-center space-y-1">
                   <div className="w-48 h-0.5 bg-slate-900 mb-4 mx-auto" />
                   <h4 className="text-sm font-black text-slate-900 uppercase">Dr. {data?.doctor?.name}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Officer - Clinical Services</p>
                   {isCompleted && (
                     <div className="flex items-center justify-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase mt-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Digital Signature Verified
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Actions Panel */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <Card title="Clinical Workflow" subtitle="Status of current consultation">
           <div className="space-y-4">
              <WorkflowStatusItem label="Vitals Captured" status="completed" />
              <WorkflowStatusItem label="Diagnosis Finalized" status="completed" />
              <WorkflowStatusItem label="Prescription Generated" status="completed" />
              <WorkflowStatusItem label="Financial Clearance" status="completed" />
              <WorkflowStatusItem label="Clinical Sign-off" status={isCompleted ? 'completed' : 'pending'} />
           </div>

           <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                 <AlertTriangle className="w-4 h-4 text-amber-600" />
                 <span className="text-[10px] font-black uppercase text-amber-800">Finalization Notice</span>
              </div>
              <p className="text-[11px] font-medium text-amber-700/80 leading-relaxed italic">
                Finalizing this record will move the patient to the Pharmacy & Billing queue. No further clinical edits will be possible after digital signing.
              </p>
           </div>
        </Card>

        <Card className="bg-slate-900 border-none shadow-2xl shadow-slate-200">
           <h3 className="text-white font-black text-xs uppercase tracking-widest mb-6">Record Actions</h3>
           <div className="space-y-4">
             <Button 
                onClick={handleFinalize}
                disabled={finalizing || isCompleted}
                loading={finalizing}
                variant="primary"
                className={`w-full h-14 rounded-2xl text-[10px] tracking-[0.2em] font-black uppercase shadow-xl ${isCompleted ? 'bg-emerald-600/20 text-emerald-400' : 'bg-blue-600 text-white'}`}
                icon={isCompleted ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
             >
                {finalizing ? 'Signing Record...' : isCompleted ? 'Legally Signed' : 'SIGN & FINALIZE CASE'}
             </Button>
             
             <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-white group">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all">
                      <Send className="w-4 h-4" />
                   </div>
                   <div className="text-left">
                      <h4 className="text-[11px] font-black uppercase tracking-tight">Handoff Instructions</h4>
                      <p className="text-[9px] font-medium text-slate-500 uppercase">Notify Reception / Staff</p>
                   </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-all" />
             </button>
           </div>
        </Card>

        <div className="p-8 bg-blue-600 rounded-[32px] text-white relative overflow-hidden group cursor-pointer shadow-2xl shadow-blue-200">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Stethoscope className="w-32 h-32" />
           </div>
           <h4 className="text-xs font-black uppercase tracking-widest mb-2">Internal Referral</h4>
           <p className="text-white/70 text-[11px] font-medium leading-relaxed mb-6">Send clinical notes to another specialist for a secondary consultation or procedure.</p>
           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-lg border border-white/20 hover:bg-white hover:text-blue-600 transition-all">
              Initiate Referral <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};

const ReportInfoItem = ({ label, value }: { label: string, value: string }) => (
  <div>
    <div className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">{label}</div>
    <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{value || 'N/A'}</div>
  </div>
);

const ReportSection = ({ title, content, isHighlighted = false, isItalic = false }: { title: string, content: string, isHighlighted?: boolean, isItalic?: boolean }) => (
  <section className="space-y-4">
    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
       <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
       {title}
    </h3>
    <div className={`p-6 rounded-2xl border ${isHighlighted ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-slate-50/50 border-slate-100'} transition-all`}>
      <p className={`text-sm leading-relaxed font-medium ${isHighlighted ? 'text-white' : 'text-slate-700'} ${isItalic ? 'italic' : ''}`}>
        {content}
      </p>
    </div>
  </section>
);

const WorkflowStatusItem = ({ label, status }: { label: string, status: 'completed' | 'pending' }) => (
  <div className="flex items-center justify-between group">
     <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'} transition-all group-hover:scale-150 shadow-lg ${status === 'completed' ? 'shadow-emerald-500/20' : ''}`} />
        <span className={`text-xs font-bold ${status === 'completed' ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
     </div>
     {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
  </div>
);

export default FinalReportTab;
