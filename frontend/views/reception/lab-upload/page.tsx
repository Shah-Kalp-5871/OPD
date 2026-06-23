'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import api, { secureFileUrl } from '@/lib/api';
import { toast } from 'sonner';
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
  Beaker,
  Loader2
} from 'lucide-react';

const LabUploadView = () => {
  const searchParams = useSearchParams();
  const caseId = searchParams?.get('caseId');

  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<any>(null);
  const [investigationOrders, setInvestigationOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (caseId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [caseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Patient/Case Data
      const caseRes = await api.get(`/consultation/${caseId}`);
      const data = (caseRes as any).data || caseRes;
      setPatientData(data);

      // 2. Fetch Investigation Orders
      const ordersRes = await api.get(`/consultation/${caseId}/investigations`);
      const ordersData = Array.isArray(ordersRes) ? ordersRes : (ordersRes as any).data || [];
      setInvestigationOrders(ordersData);
      
      // Select first pending order if available
      const pendingOrder = ordersData.find((o: any) => o.status === 'ORDERED');
      if (pendingOrder) {
        setSelectedOrder(pendingOrder.id);
      }
    } catch (error) {
      console.error('Error fetching lab data:', error);
      toast.error('Failed to load investigation data');
    } finally {
      setLoading(false);
    }
  };

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
    if (files.length > 0) validateAndSetFile(files[0]);
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF files are accepted');
      toast.error('Only PDF files are accepted');
      return;
    }

    setUploadedFile(file);
    setUploadProgress(0);
    setUploadError(null);
  };

  const handleSave = async () => {
    if (!selectedOrder) {
      toast.error('Please select an investigation order');
      return;
    }
    if (!uploadedFile) {
      toast.error('Please select a PDF file to upload');
      return;
    }

    try {
      setSaving(true);
      setUploadProgress(0);
      setUploadError(null);
      const formData = new FormData();
      formData.append('file', uploadedFile);

      await api.post(
        `/consultation/investigations/${selectedOrder}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (event) => {
            if (event.total) {
              setUploadProgress(Math.round((event.loaded * 100) / event.total));
            }
          },
        }
      );

      toast.success('Lab report uploaded and linked successfully');
      setUploadedFile(null);
      fetchData();
    } catch (error: any) {
      console.error('Error uploading lab report:', error);
      const message = error?.response?.data?.message || 'Failed to upload report';
      setUploadError(Array.isArray(message) ? message.join(', ') : message);
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ReceptionLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Initialising Lab Engine...</p>
        </div>
      </ReceptionLayout>
    );
  }

  if (!caseId) {
    return (
      <ReceptionLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <AlertCircle className="w-12 h-12 text-amber-500" />
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">No Patient Context</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Please select a patient from the queue to upload reports.</p>
        </div>
      </ReceptionLayout>
    );
  }

  const patientInfo = patientData?.case?.patient;
  const patientProfile = patientInfo?.profile;

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20">
        
        {/* PAGE HEADER */}
        <div>
           <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
              Lab Report Upload — <span className="text-orange-600 uppercase tracking-tight">{patientProfile?.firstName} {patientProfile?.lastName}</span>
           </h1>
           <div className="flex items-center gap-4 mt-3">
              <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                 Case: {patientData?.case?.caseNumber}
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
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Investigation Order</label>
                       <select 
                         className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-orange-600 transition-all"
                         value={selectedOrder}
                         onChange={(e) => setSelectedOrder(e.target.value)}
                       >
                          <option value="">Select an Order</option>
                          {investigationOrders.map((order) => (
                            <option key={order.id} value={order.id}>
                              {order.results.map((r: any) => r.parameter.name).join(', ') || 'General Investigation'} ({order.status})
                            </option>
                          ))}
                       </select>
                    </div>
                    <div className="space-y-2 relative group">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                          Report Date
                          <Info className="w-2.5 h-2.5 text-orange-600" />
                       </label>
                       <input 
                         type="date" 
                         className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-orange-600 transition-all" 
                         value={reportDate}
                         onChange={(e) => setReportDate(e.target.value)}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lab Name / Source</label>
                       <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-orange-600 transition-all shadow-inner" placeholder="Enter Lab Name" />
                    </div>
                 </div>

                 {/* 🔷 SECTION 2: PDF UPLOAD AREA */}
                 <div 
                   onDragOver={handleDragOver}
                   onDragLeave={handleDragLeave}
                   onDrop={handleDrop}
                   className={`relative border-2 border-dashed rounded-3xl p-16 transition-all flex flex-col items-center justify-center gap-4 group ${isDragging ? 'border-orange-500 bg-orange-50/50 scale-[1.01]' : uploadedFile ? 'border-orange-500 bg-orange-50/20 shadow-inner' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}`}
                 >
                    {uploadedFile ? (
                      <div className="text-center space-y-4">
                         <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mx-auto">
                            <FileText className="w-8 h-8" />
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{uploadedFile.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
                         </div>
                         {saving && (
                           <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-slate-200">
                              <div className="h-full bg-orange-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                           </div>
                         )}
                         <button onClick={() => setUploadedFile(null)} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline">Remove & Replace</button>
                      </div>
                    ) : (
                      <>
                         <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8" />
                         </div>
                         <div className="text-center">
                            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">[ Click to Upload PDF / Drag & Drop ]</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Accepted: PDF only | Max size: 10MB</p>
                         </div>
                      </>
                    )}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="application/pdf,.pdf"
                      disabled={saving}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) validateAndSetFile(file);
                        e.target.value = '';
                      }}
                    />
                 </div>
                 {uploadError && (
                   <p className="mt-4 text-center text-[10px] font-black uppercase tracking-widest text-rose-600">
                     {uploadError}
                   </p>
                 )}
              </div>
           </div>

           {/* MAIN ACTION */}
           <div className="flex justify-center md:justify-start">
              <button 
                onClick={handleSave}
                disabled={saving || !uploadedFile || !selectedOrder}
                className="px-16 py-5 bg-slate-900 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                 {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-orange-400" />}
                 {saving ? `Uploading ${uploadProgress}%` : 'Save & Link to Case'}
                 <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              </button>
           </div>

           {/* 🔷 SECTION 4: PREVIOUS REPORTS */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mt-10">
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                 <History className="w-4 h-4 text-slate-400" />
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Investigation History for this Case</h3>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/50">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Investigation</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Files</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {investigationOrders.map((order, idx) => (
                         <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5">
                               <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${order.status === 'RESULT_READY' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {order.status}
                               </span>
                            </td>
                            <td className="px-8 py-5 text-xs font-black text-slate-800 uppercase tracking-widest">
                               {order.results.map((r: any) => r.parameter.name).join(', ') || 'General Investigation'}
                            </td>
                            <td className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                               {order.files?.length || 0} File(s)
                            </td>
                            <td className="px-8 py-5 text-right">
                               <div className="flex justify-end gap-2">
                                  {order.files?.map((file: any) => (
                                    <a 
                                      key={file.id}
                                      href={secureFileUrl(file.fileUrl)}
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                    >
                                       <Eye className="w-3 h-3" /> View {file.fileName}
                                    </a>
                                  ))}
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

        </div>
      </div>
    </ReceptionLayout>
  );
};

export default LabUploadView;
