'use client';

import React from 'react';
import { 
  Printer, 
  ChevronLeft, 
  Download, 
  MapPin, 
  Phone, 
  Globe, 
  Calendar,
  User,
  Stethoscope,
  Pill,
  FileText,
  AlertCircle,
  Activity,
  ClipboardList
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PrescriptionPrintViewProps {
  data: any; // The full consultation record
}

const PrescriptionPrintView: React.FC<PrescriptionPrintViewProps> = ({ data }) => {
  const router = useRouter();
  
  if (!data) return null;

  const { case: patientCase, complaint, isFinalized, finalizedAt, finalizedBy, doctor } = data;
  const patient = patientCase?.patient;
  const prescriptions = patientCase?.prescriptions || [];
  const investigations = patientCase?.investigationOrders || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10 print:p-0 print:bg-white font-sans">
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
               <span className="text-[10px] font-black uppercase tracking-wider">Draft / Not Finalized</span>
             </div>
           )}
           <button 
             onClick={handlePrint}
             disabled={!isFinalized}
             className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all ${
               isFinalized 
               ? 'bg-slate-900 text-white hover:bg-black shadow-slate-200' 
               : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
             }`}
           >
              <Printer className="w-4 h-4" />
              PRINT PRESCRIPTION
           </button>
        </div>
      </div>

      {/* Warning Banner for Print (Visible if not finalized) */}
      {!isFinalized && (
        <div className="max-w-[800px] mx-auto mb-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-center gap-4 print:flex hidden">
          <AlertCircle className="w-8 h-8 text-amber-600" />
          <div>
            <h3 className="text-sm font-black text-amber-900 uppercase">UNOFFICIAL COPY - NOT FINALIZED</h3>
            <p className="text-[10px] font-bold text-amber-700 uppercase">This document is a draft and not for clinical use.</p>
          </div>
        </div>
      )}

      {/* The Actual Prescription - A4 Aspect Ratio */}
      <div className="max-w-[800px] mx-auto bg-white shadow-2xl print:shadow-none min-h-[1100px] flex flex-col p-12 border border-slate-100 print:border-none relative overflow-hidden">
        
        {/* Watermark for non-finalized */}
        {!isFinalized && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-45 select-none">
            <span className="text-[150px] font-black uppercase">DRAFT ONLY</span>
          </div>
        )}

        {/* Header - Clinic Branding */}
        <div className="flex items-start justify-between border-b-4 border-slate-900 pb-10">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                 <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">MedFlow OPD</h1>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Precision Healthcare</p>
              </div>
           </div>
           
           <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-slate-900 mb-1">
                 <p className="text-[10px] font-black uppercase tracking-wider">Medical District, Phase II</p>
                 <MapPin className="w-3 h-3" />
              </div>
              <div className="flex items-center justify-end gap-2 text-slate-600 mb-1">
                 <p className="text-[10px] font-bold">+91 98765 43210</p>
                 <Phone className="w-3 h-3" />
              </div>
              <div className="flex items-center justify-end gap-2 text-slate-600">
                 <p className="text-[10px] font-bold underline">support@medflow-system.com</p>
                 <Globe className="w-3 h-3" />
              </div>
           </div>
        </div>

        {/* Patient Details Row */}
        <div className="grid grid-cols-4 gap-6 py-6 border-b border-slate-100 bg-slate-50/50 px-4 mt-4 rounded-xl">
           <div className="flex flex-col gap-1 border-r border-slate-200">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Patient Name</p>
              <p className="text-xs font-black text-slate-900 uppercase truncate">
                {patient?.firstName} {patient?.lastName}
              </p>
           </div>
           <div className="flex flex-col gap-1 border-r border-slate-200 px-2">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ID / MRD</p>
              <p className="text-xs font-bold text-slate-700 uppercase">
                {patient?.mrdNumber || patient?.id?.split('-')[0]}
              </p>
           </div>
           <div className="flex flex-col gap-1 border-r border-slate-200 px-2">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Age / Gender</p>
              <p className="text-xs font-bold text-slate-700 uppercase">
                {patient?.profile?.dob ? `${Math.floor((new Date().getTime() - new Date(patient.profile.dob).getTime()) / 31536000000)}Y` : 'N/A'} / {patient?.gender}
              </p>
           </div>
           <div className="flex flex-col gap-1 px-2">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Visit Date</p>
              <p className="text-xs font-bold text-slate-700 uppercase">
                {new Date(data.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
           </div>
        </div>

        {/* Doctor Details */}
        <div className="flex justify-between items-center py-4 text-[10px]">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-slate-500 uppercase tracking-wider">Doctor:</span>
            <span className="font-black text-slate-900 uppercase">Dr. {doctor?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider">Reg No:</span>
            <span className="font-black text-slate-900 uppercase">MC-2026-X</span>
          </div>
        </div>

        {/* Clinical Section */}
        <div className="mt-6 space-y-8">
          {/* Complaints & History */}
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                <Activity className="w-4 h-4 text-slate-400" />
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Chief Complaints</h4>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-800 uppercase leading-relaxed">
                  {complaint?.chiefComplaint || 'No complaints recorded.'}
                </p>
                {complaint?.duration && (
                  <p className="text-[9px] font-black text-slate-400 uppercase">
                    Duration: {complaint.duration} {complaint.durationType}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
                <ClipboardList className="w-4 h-4 text-slate-400" />
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Diagnosis</h4>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black text-red-600 uppercase">
                  {data.finalDiagnosis || data.provisionalDiagnosis || 'Clinical investigation pending.'}
                </p>
              </div>
            </div>
          </div>

          {/* Rx Section */}
          <div className="relative pt-6">
            <div className="absolute left-[-40px] top-4">
              <span className="text-6xl font-serif italic text-slate-900 opacity-10 select-none">Rx</span>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1">
                <Pill className="w-4 h-4 text-slate-900" />
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Medications</h4>
              </div>
              
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest w-10">#</th>
                    <th className="py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Drug Name / Dosage</th>
                    <th className="py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Frequency</th>
                    <th className="py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Duration</th>
                    <th className="py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescriptions.flatMap((p: any) => p.items).map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-3 text-[10px] font-black text-slate-300">{idx + 1}</td>
                      <td className="py-3">
                        <p className="text-xs font-black text-slate-900 uppercase">{item.drugName}</p>
                        <p className="text-[9px] font-bold text-slate-500">{item.dosage}</p>
                      </td>
                      <td className="py-3 text-center text-[10px] font-black text-slate-700 uppercase">{item.frequency}</td>
                      <td className="py-3 text-center text-[10px] font-black text-slate-700 uppercase">{item.duration} Days</td>
                      <td className="py-3 text-right text-[9px] font-bold text-slate-500 uppercase max-w-[150px] italic">
                        {item.instructions || '-'}
                      </td>
                    </tr>
                  ))}
                  {prescriptions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        No active medications prescribed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Investigations Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
              <ClipboardList className="w-4 h-4 text-slate-400" />
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Suggested Investigations</h4>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-2">
              {investigations.map((order: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    {order.results?.[0]?.parameter?.name || 'Unknown Test'}
                  </span>
                </div>
              ))}
              {investigations.length === 0 && (
                <p className="text-[10px] font-bold text-slate-400 uppercase">No lab investigations ordered.</p>
              )}
            </div>
          </div>

          {/* Plan & Advice */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
              <FileText className="w-4 h-4 text-slate-400" />
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Advice & Follow-up</h4>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-700 font-bold leading-relaxed whitespace-pre-wrap uppercase">
                {data.advice || 'Follow general healthcare advice. Stay hydrated and rest.'}
              </p>
              {data.nextVisitDate && (
                <div className="mt-4 flex items-center gap-2 text-slate-900">
                  <Calendar className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase">Next Review Date: {new Date(data.nextVisitDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Finalized Data & Signature */}
        <div className="mt-auto pt-20 border-t border-slate-100 flex justify-between items-end">
           <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Finalized At</p>
                <p className="text-[10px] font-bold text-slate-900 uppercase">
                  {isFinalized ? new Date(finalizedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'NOT FINALIZED'}
                </p>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                 <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[8px] font-black text-slate-400 border border-slate-200 uppercase">
                    Scan
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Digital Auth</p>
                    <p className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter">ID: {data.id}</p>
                 </div>
              </div>
           </div>
           
           <div className="text-center w-64">
              {isFinalized && (
                <div className="mb-2">
                  <p className="font-serif italic text-slate-900 text-lg opacity-80">Dr. {doctor?.name}</p>
                </div>
              )}
              <div className="h-px bg-slate-900 mb-3"></div>
              <p className="text-xs font-black text-slate-900 uppercase">Dr. {doctor?.name}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Medical Officer</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPrintView;
