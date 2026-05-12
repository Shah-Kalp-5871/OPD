'use client';

import React, { useState } from 'react';
import NursingLayout from '@/views/layouts/NursingLayout';
import { 
  FileText, 
  Upload, 
  Search, 
  Calendar, 
  Beaker, 
  AlertCircle, 
  CheckCircle2, 
  MoreHorizontal, 
  ArrowRight,
  Database,
  CloudUpload,
  User,
  FlaskConical,
  Activity
} from 'lucide-react';

const LabReportManagementView = () => {
  const [reportDate, setReportDate] = useState('');
  const [labSource, setLabSource] = useState('');
  const [reportType, setReportType] = useState('CBC');

  const investigationResults = [
    { parameter: 'Haemoglobin', value: '12.8', unit: 'g/dL', range: '13.5-17.5', flag: 'LOW', collectedBy: 'Bhavna (Nursing)' },
    { parameter: 'WBC Count', value: '7.2', unit: 'K/uL', range: '4.5-11', flag: 'Normal', collectedBy: 'Bhavna (Nursing)' },
    { parameter: 'Fasting Glucose', value: '118', unit: 'mg/dL', range: '70-100', flag: 'HIGH', collectedBy: 'Bhavna (Nursing)' },
    { parameter: 'TSH', value: '3.2', unit: 'mIU/L', range: '0.4-4.0', flag: 'Normal', collectedBy: 'Bhavna (Nursing)' },
  ];

  const getFlagBadge = (flag: string) => {
    switch (flag) {
      case 'LOW': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'HIGH': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Normal': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const reportTypes = ['CBC', 'Thyroid', 'Blood Sugar', 'LFT', 'RFT', 'Urine Routine'];

  return (
    <NursingLayout>
      <div className="max-w-[1600px] mx-auto space-y-10 pb-32 animate-in fade-in duration-500">
        
        {/* 🔷 PAGE HEADER */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-400 shadow-xl shadow-slate-200">
                 <FlaskConical className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Lab Report Management – MAHESH K. KUMAR</h1>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-2 ml-1">
                    Linked to Case: <span className="text-slate-800 font-black">C003-001-130426</span>
                 </p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lab Sync Active</span>
              </div>
           </div>
        </div>

        {/* 🔷 PDF UPLOAD SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                 <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Upload Lab Report PDF</h2>
           </div>

           <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Report Date *</label>
                    <div className="relative group">
                       <Calendar className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" />
                       <input 
                         type="date" 
                         value={reportDate}
                         onChange={(e) => setReportDate(e.target.value)}
                         className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                       />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lab / Source *</label>
                    <div className="relative group">
                       <Database className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" />
                       <input 
                         type="text" 
                         placeholder="e.g. Apex Pathology"
                         value={labSource}
                         onChange={(e) => setLabSource(e.target.value)}
                         className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
                       />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Report Type *</label>
                    <select 
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner appearance-none cursor-pointer"
                    >
                       {reportTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                 </div>
              </div>

              {/* PDF UPLOAD AREA */}
              <div className="group cursor-pointer">
                 <div className="relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all duration-300 group-hover:shadow-lg shadow-inner">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-md group-hover:scale-110 transition-transform">
                          <CloudUpload className="w-10 h-10" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Click to Upload or Drag & Drop PDF file</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">PDF only | Linked to Case: C003-001-130426</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 🔷 MANUAL RESULT ENTRY SECTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400">
                    <Beaker className="w-5 h-5" />
                 </div>
                 <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Manual Result Entry (Doctor-Requested Investigations)</h2>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                 <Activity className="w-4 h-4 text-blue-500" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">4 Parameters Pending</span>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parameter</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Result Value</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Normal Range</th>
                       <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Flag</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Collected By</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {investigationResults.map((row, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <span className="text-[13px] font-black text-slate-800 tracking-tight">{row.parameter}</span>
                         </td>
                         <td className="px-6 py-6">
                            <input 
                              type="text" 
                              defaultValue={row.value}
                              className={`px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-black outline-none focus:border-blue-600 focus:bg-white transition-all w-24 text-center ${
                                row.flag === 'HIGH' ? 'text-rose-600' : row.flag === 'LOW' ? 'text-amber-600' : 'text-slate-800'
                              }`}
                            />
                         </td>
                         <td className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{row.unit}</td>
                         <td className="px-6 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest italic">{row.range}</td>
                         <td className="px-6 py-6">
                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getFlagBadge(row.flag)}`}>
                               {row.flag}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{row.collectedBy}</span>
                               <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                                  <MoreHorizontal className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* ACTION BUTTON SECTION */}
           <div className="p-12 bg-slate-50/50 border-t border-slate-100 flex flex-col items-center gap-8">
              <div className="bg-white px-8 py-4 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 max-w-2xl">
                 <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                    Uploaded PDFs and manual results will be immediately visible in the <span className="text-blue-600">Doctor's Investigation Tab</span>. 
                    Clinical abnormal flags are emphasized visually for priority review.
                 </p>
              </div>

              <button className="px-20 py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-200 flex items-center gap-4 group">
                 <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                 SAVE RESULTS & SYNC WITH DOCTOR
              </button>
           </div>
        </div>

      </div>
    </NursingLayout>
  );
};

export default LabReportManagementView;
