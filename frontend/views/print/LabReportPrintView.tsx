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
  Stethoscope,
  Beaker,
  AlertTriangle,
  FileText,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LabReportPrintViewProps {
  data: any; // The full investigation order from getInvestigationOrderById
}

const LabReportPrintView: React.FC<LabReportPrintViewProps> = ({ data }) => {
  const router = useRouter();
  
  if (!data) return null;

  const { consultation, results = [], files = [], status, notes, id } = data;
  const patient = consultation?.case?.patient;
  const isCompleted = status === 'COMPLETED';

  const handlePrint = () => {
    window.print();
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
           {!isCompleted && (
             <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
               <AlertCircle className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-wider">Status: {status}</span>
             </div>
           )}
           <button 
             onClick={handlePrint}
             className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
           >
              <Printer className="w-4 h-4" />
              PRINT REPORT
           </button>
        </div>
      </div>

      {/* The Actual Report - A4 Aspect Ratio */}
      <div className="max-w-[800px] mx-auto bg-white shadow-2xl print:shadow-none min-h-[1100px] flex flex-col p-12 border border-slate-100 print:border-none relative overflow-hidden">
        
        {/* Watermark for non-completed */}
        {!isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-45 select-none">
            <span className="text-[150px] font-black uppercase italic">INCOMPLETE</span>
          </div>
        )}

        {/* Header - Clinic Branding (Matching Prescription) */}
        <div className="flex items-start justify-between border-b-4 border-slate-900 pb-10">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                 <Beaker className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">MedFlow Lab</h1>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Precision Diagnostics</p>
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
                 <p className="text-[10px] font-bold underline">lab@medflow-system.com</p>
                 <Globe className="w-3 h-3" />
              </div>
           </div>
        </div>

        {/* Patient Details Row (Standardized) */}
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
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Report Date</p>
              <p className="text-xs font-bold text-slate-700 uppercase">
                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
           </div>
        </div>

        {/* Report Identification */}
        <div className="flex justify-between items-center py-4 text-[10px] border-b border-slate-100 mb-8">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider">Order ID:</span>
            <span className="font-black text-slate-900 uppercase">#{id?.split('-')[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider">Lab ID:</span>
            <span className="font-black text-slate-900 uppercase">DX-2026-L</span>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1">
          <h2 className="text-center text-lg font-black uppercase tracking-[0.2em] mb-10 text-slate-900 border-b-2 border-slate-900 inline-block mx-auto w-full pb-2">
            Investigation Report
          </h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Test Parameter</th>
                <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Result</th>
                <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Ref. Range</th>
                <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((res: any, idx: number) => (
                <tr key={idx} className="group">
                  <td className="py-5">
                    <p className="text-sm font-black text-slate-900 uppercase">{res.parameter?.name}</p>
                  </td>
                  <td className="py-5 text-center">
                    <span className={`text-base font-black ${res.isAbnormal ? 'text-red-600' : 'text-slate-900'}`}>
                      {res.numericValue !== null ? res.numericValue : res.textValue}
                      {res.isAbnormal && ' (H)'}
                    </span>
                  </td>
                  <td className="py-5 text-center">
                    <p className="text-xs font-bold text-slate-500">
                      {res.parameter?.minValue} - {res.parameter?.maxValue}
                    </p>
                  </td>
                  <td className="py-5 text-right">
                    <p className="text-xs font-black text-slate-400 uppercase">{res.parameter?.unit}</p>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                    Analytical results pending...
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Abnormal Indicator Note */}
          <div className="mt-6 flex items-center gap-2 text-slate-400 italic">
            <AlertTriangle className="w-3 h-3" />
            <p className="text-[8px] font-bold uppercase tracking-wider">(H) / Red indicates values outside biological reference intervals.</p>
          </div>

          {/* Notes Section */}
          {notes && (
            <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FileText className="w-3 h-3" />
                Technician Observations
              </h4>
              <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase whitespace-pre-wrap">
                {notes}
              </p>
            </div>
          )}

          {/* Attachments Section (Visual Evidence) */}
          {files.length > 0 && (
            <div className="mt-10">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ImageIcon className="w-3 h-3" />
                Attached Records / Evidence
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {files.map((file: any, idx: number) => (
                  <div key={idx} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between bg-slate-50/30">
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] font-black text-slate-900 uppercase truncate max-w-[200px]">
                        {file.fileName}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">
                        Uploaded by: {file.uploadedBy?.name || 'Lab System'}
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Signatures */}
        <div className="mt-auto pt-20 border-t border-slate-100 flex justify-between items-end">
           <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Report Verified At</p>
                <p className="text-[10px] font-bold text-slate-900 uppercase">
                  {isCompleted ? new Date(data.updatedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'PENDING'}
                </p>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                 <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[8px] font-black text-slate-400 border border-slate-200 uppercase">
                    BARCODE
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Digital Audit</p>
                    <p className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter">TRN: {id?.split('-')[0]}</p>
                 </div>
              </div>
           </div>
           
           <div className="text-center w-64">
              <div className="mb-2 h-10 flex items-center justify-center">
                 <span className="font-serif italic text-slate-300 text-sm">System Verified Signature</span>
              </div>
              <div className="h-px bg-slate-900 mb-3"></div>
              <p className="text-xs font-black text-slate-900 uppercase">
                {files[0]?.uploadedBy?.name || 'Chief Lab Technician'}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Laboratory In-Charge</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportPrintView;
