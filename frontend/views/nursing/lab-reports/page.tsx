'use client';

import React, { useState, useEffect } from 'react';
import NursingLayout from '@/views/layouts/NursingLayout';
import { useSearchParams } from 'next/navigation';
import api, { secureFileUrl } from '@/lib/api';
import { toast } from 'sonner';
import { 
  FileText, 
  Upload, 
  Search, 
  Calendar, 
  Beaker, 
  AlertCircle, 
  CheckCircle2, 
  MoreHorizontal, 
  CloudUpload,
  FlaskConical,
  Activity,
  Loader2,
  FileIcon
} from 'lucide-react';

const LabReportManagementView = () => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId');

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [patientData, setPatientData] = useState<any>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (caseId) {
      fetchCaseDetails();
    }
  }, [caseId]);

  const fetchCaseDetails = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, caseRes] = await Promise.all([
        api.get(`/consultation/${caseId}/investigations`),
        api.get(`/consultation/${caseId}`),
      ]);

      const loadedOrders = Array.isArray(ordersRes) ? ordersRes : (ordersRes as any).data || [];
      const loadedCase = (caseRes as any).data || caseRes;

      setOrders(loadedOrders);
      setPatientData(loadedCase.case?.patient || loadedCase.patient || loadedCase || null);

      const firstPending = loadedOrders.find((o: any) => o.status !== 'RESULT_READY');
      if (firstPending) setSelectedOrderId(firstPending.id);
    } catch (error) {
      toast.error('Failed to load investigation details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedOrderId) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed');
      toast.error('Only PDF files are allowed');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      await api.post(
        `/consultation/investigations/${selectedOrderId}/upload`,
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
      fetchCaseDetails();
    } catch (error: any) {
      console.error('Upload failed', error);
      const message = error?.response?.data?.message || 'Failed to upload report';
      setUploadError(Array.isArray(message) ? message.join(', ') : message);
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  if (isLoading && caseId) {
    return (
      <NursingLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
           <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Case Files...</p>
        </div>
      </NursingLayout>
    );
  }

  if (!caseId) {
    return (
      <NursingLayout>
        <div className="max-w-4xl mx-auto py-20 text-center space-y-8">
           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <FlaskConical className="w-10 h-10" />
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">No Active Case Selected</h2>
              <p className="text-xs font-bold text-slate-400 uppercase mt-2 tracking-widest">Please select a patient from the queue to manage lab reports</p>
           </div>
           <button 
             onClick={() => window.location.href = '/nursing/dashboard'}
             className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all"
           >
             Go to Nursing Dashboard
           </button>
        </div>
      </NursingLayout>
    );
  }

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
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                    Lab Report Management – <span className="text-blue-600">{patientData?.firstName} {patientData?.lastName}</span>
                 </h1>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 ml-1">
                    MRD: <span className="text-slate-800 font-black">{patientData?.mrdNumber}</span> | Linked to Case ID: <span className="text-slate-800 font-black">{caseId.split('-').pop()}</span>
                 </p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Enterprise Lab Sync Active</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* LEFT: PENDING ORDERS */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Activity className="w-4 h-4 text-blue-500" />
                       Pending Investigations
                    </h3>
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                       {orders.filter(o => o.status !== 'RESULT_READY').length}
                    </span>
                 </div>
                 <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {orders.length === 0 ? (
                       <div className="p-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No investigations ordered for this case</div>
                    ) : (
                       orders.map((order) => (
                          <button 
                             key={order.id}
                             onClick={() => setSelectedOrderId(order.id)}
                             className={`w-full text-left p-6 transition-all border-l-4 ${
                                selectedOrderId === order.id 
                                ? 'bg-blue-50/50 border-blue-600' 
                                : 'hover:bg-slate-50 border-transparent'
                             }`}
                          >
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{order.testName || order.test?.name}</span>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                                   order.status === 'RESULT_READY' 
                                   ? 'bg-emerald-100 text-emerald-700' 
                                   : 'bg-amber-100 text-amber-700'
                                }`}>
                                   {order.status}
                                </span>
                             </div>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{order.notes || 'Routine checkup requested by physician'}</p>
                             {order.files?.length > 0 && (
                                <div className="mt-3 flex items-center gap-2 text-emerald-600">
                                   <FileIcon className="w-3 h-3" />
                                   <span className="text-[9px] font-black uppercase">{order.files.length} Report(s) Linked</span>
                                </div>
                             )}
                          </button>
                       ))
                    )}
                 </div>
              </div>
           </div>

           {/* RIGHT: UPLOAD & PREVIEW */}
           <div className="lg:col-span-8 space-y-8">
              {selectedOrderId ? (
                 <>
                    {/* UPLOAD BOX */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                       <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                          <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                             <CloudUpload className="w-5 h-5 text-blue-600" />
                             Upload PDF Report for {orders.find(o => o.id === selectedOrderId)?.testName || orders.find(o => o.id === selectedOrderId)?.test?.name}
                          </h2>
                       </div>

                       <div className="p-10">
                          <div className="relative group">
                             <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                             />
                             <div className={`border-2 border-dashed rounded-[2.5rem] p-16 text-center transition-all duration-300 ${
                                isUploading ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300 group-hover:shadow-lg'
                             }`}>
                                {isUploading ? (
                                   <div className="flex flex-col items-center gap-4">
                                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Uploading Report... {uploadProgress}%</p>
                                      <div className="h-2 w-64 overflow-hidden rounded-full bg-slate-200">
                                         <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                                      </div>
                                   </div>
                                ) : (
                                   <div className="flex flex-col items-center gap-4">
                                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-md group-hover:scale-110 transition-transform">
                                         <Upload className="w-10 h-10" />
                                      </div>
                                      <div className="space-y-1">
                                         <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Click to Upload or Drag & Drop PDF</p>
                                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Validated Clinical PDF Format Only</p>
                                      </div>
                                   </div>
                                )}
                             </div>
                             {uploadError && (
                                <p className="mt-4 text-center text-[10px] font-black uppercase tracking-widest text-rose-600">
                                   {uploadError}
                                </p>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* ATTACHED FILES LIST */}
                    {orders.find(o => o.id === selectedOrderId)?.files?.length > 0 && (
                       <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                             <FileText className="w-4 h-4 text-slate-400" />
                             <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Linked Clinical Documents</h3>
                          </div>
                          <div className="divide-y divide-slate-50">
                             {orders.find(o => o.id === selectedOrderId).files.map((file: any) => (
                                <div key={file.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all">
                                   <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                         <FileText className="w-5 h-5" />
                                      </div>
                                      <div>
                                         <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{file.fileName}</p>
                                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Uploaded: {new Date(file.uploadedAt).toLocaleString()} | Size: {file.fileSize}</p>
                                      </div>
                                   </div>
                                   <a 
                                      href={secureFileUrl(file.fileUrl)} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                   >
                                      View Report
                                   </a>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </>
              ) : (
                 <div className="h-[600px] border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-20 text-center space-y-6 opacity-40 bg-white">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                       <Beaker className="w-12 h-12" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">No Investigation Selected</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase mt-2 tracking-widest">Select an order from the left panel to upload results</p>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </NursingLayout>
  );
};

export default LabReportManagementView;
