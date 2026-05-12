'use client';

import React, { useState } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  FileUp, 
  Upload, 
  FileText, 
  Search, 
  History, 
  Eye, 
  Download, 
  ClipboardList, 
  Database, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  FileSearch,
  Plus,
  Beaker
} from 'lucide-react';

const LabUploadView = () => {
  const [reportDate, setReportDate] = useState('2026-04-13');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const previousReports = [
    { date: '01/04/2026', type: 'CBC, Blood Sugar', by: 'Reception – Kavita', case: 'C008-008-010426' },
    { date: '15/03/2026', type: 'Thyroid Panel', by: 'Nursing – Bhavna', case: 'C005-007-150326' }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setUploadedFile(files[0]);
    }
  };

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        {/* PAGE HEADER */}
        <div>
           <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
              Lab Report Upload — <span className="text-teal-600 uppercase tracking-tight">MAHESH K. KUMAR</span>
           </h1>
           <div className="flex items-center gap-4 mt-3">
              <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                 Case: C003-001-130426
              </span>
              <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-100">
                 <Database className="w-3.5 h-3.5" />
                 Linked to Investigation Tab
              </span>
           </div>
        </div>

        <div className="space-y-10">
           
           {/* 🔷 SECTION 1 & 2: REPORT DETAILS & UPLOAD */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                 <FileSearch className="w-4 h-4 text-slate-400" />
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Upload Scanned Lab Report (PDF)</h3>
              </div>
              <div className="p-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient (Auto-linked)</label>
                       <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-500 uppercase">
                          Mahesh K. Kumar
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case ID (Auto-linked)</label>
                       <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-500 tracking-widest uppercase">
                          C003-001-130426
                       </div>
                    </div>
                    <div className="space-y-2 relative group">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                          Report Date
                          <Info className="w-2.5 h-2.5 text-teal-600" />
                       </label>
                       <input 
                         type="date" 
                         className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-teal-600 transition-all" 
                         value={reportDate}
                         onChange={(e) => setReportDate(e.target.value)}
                       />
                       <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-900 text-white p-3 rounded-xl text-[9px] font-bold leading-relaxed opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 shadow-xl">
                          Uploaded reports automatically visible in Doctor's Investigation Tab.
                       </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lab Name / Source</label>
                       <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-teal-600 transition-all shadow-inner" placeholder="Enter Lab Name (e.g. Apollo Diagnostics)" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Type</label>
                       <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-teal-600 transition-all shadow-inner">
                          <option>Select Type</option>
                          <option>CBC / Blood Panel</option>
                          <option>Thyroid Markers</option>
                          <option>Lipid Profile</option>
                          <option>Radiology / Scan</option>
                       </select>
                    </div>
                 </div>

                 {/* 🔷 SECTION 2: PDF UPLOAD AREA */}
                 <div 
                   onDragOver={handleDragOver}
                   onDragLeave={handleDragLeave}
                   onDrop={handleDrop}
                   className={`relative border-2 border-dashed rounded-3xl p-16 transition-all flex flex-col items-center justify-center gap-4 group ${isDragging ? 'border-teal-500 bg-teal-50/50 scale-[1.01]' : uploadedFile ? 'border-teal-500 bg-teal-50/20 shadow-inner' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}`}
                 >
                    {uploadedFile ? (
                      <div className="text-center space-y-4">
                         <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mx-auto">
                            <FileText className="w-8 h-8" />
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{uploadedFile.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
                         </div>
                         <button onClick={() => setUploadedFile(null)} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline">Remove & Replace</button>
                      </div>
                    ) : (
                      <>
                         <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8" />
                         </div>
                         <div className="text-center">
                            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">[ Click to Upload PDF / Drag & Drop ]</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Accepted: PDF only | Max size: As configured by Admin</p>
                         </div>
                      </>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf" onChange={(e) => e.target.files && setUploadedFile(e.target.files[0])} />
                 </div>
              </div>
           </div>

           {/* 🔷 SECTION 3: MANUAL VALUE ENTRY */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                    <Beaker className="w-4 h-4 text-slate-400" />
                    Manual Value Entry (Optional – Key Parameters)
                 </h3>
                 <div className="group relative">
                    <AlertCircle className="w-4 h-4 text-amber-500 cursor-help" />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 text-white p-3 rounded-xl text-[9px] font-bold leading-relaxed opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 shadow-xl">
                       Manual values appear in structured view alongside the PDF in Doctor's Investigation Tab.
                    </div>
                 </div>
              </div>
              <div className="p-8 space-y-6">
                 <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                    Enter key values alongside the PDF for direct visibility in Doctor's Investigation Tab:
                 </p>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {[
                      { label: 'Haemoglobin (Hb)', unit: 'g/dL' },
                      { label: 'WBC', unit: 'cells/mcL' },
                      { label: 'Platelet', unit: 'lakhs' },
                      { label: 'SGPT', unit: 'U/L' },
                      { label: 'SGOT', unit: 'U/L' },
                      { label: 'TSH', unit: 'mIU/L' },
                      { label: 'HbA1c', unit: '%' },
                      { label: 'Creatinine', unit: 'mg/dL' },
                    ].map((param, idx) => (
                      <div key={idx} className="space-y-1.5">
                         <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate block" title={param.label}>
                            {param.label}
                         </label>
                         <input 
                           type="text" 
                           className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-teal-600 focus:bg-white transition-all text-center shadow-inner" 
                           placeholder="0.0" 
                         />
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* MAIN ACTION */}
           <div className="flex justify-center md:justify-start">
              <button className="px-16 py-5 bg-slate-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 group">
                 <CheckCircle2 className="w-5 h-5 text-teal-400" />
                 Save & Link to Case
                 <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              </button>
           </div>

           {/* 🔷 SECTION 4: PREVIOUS REPORTS */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mt-10">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                 <History className="w-4 h-4 text-slate-400" />
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Previously Uploaded Reports for this Patient</h3>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/50">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Report Date</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Report Type</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Uploaded By</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Linked Case</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {previousReports.map((report, idx) => (
                         <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5">
                               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{report.date}</span>
                            </td>
                            <td className="px-8 py-5 text-xs font-black text-slate-800 uppercase tracking-widest">{report.type}</td>
                            <td className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{report.by}</td>
                            <td className="px-8 py-5 text-[10px] font-black text-teal-600 uppercase tracking-widest">{report.case}</td>
                            <td className="px-8 py-5 text-right">
                               <div className="flex justify-end gap-2">
                                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">View</button>
                                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all shadow-sm">Download</button>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="p-6 bg-slate-50/50 text-center border-t border-slate-50">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">End of previous investigation documents for this patient context</p>
              </div>
           </div>

        </div>
      </div>
    </ReceptionLayout>
  );
};

export default LabUploadView;
