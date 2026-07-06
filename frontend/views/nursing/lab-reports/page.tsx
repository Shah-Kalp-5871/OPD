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
  FileIcon,
  ArrowRight
} from 'lucide-react';

const LabReportManagementView = () => {
  const searchParams = useSearchParams();
  const caseId = searchParams?.get('caseId');

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [patientData, setPatientData] = useState<any>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [labValues, setLabValues] = useState<Record<string, { orderId: string, parameterId: string, value: string }>>({});
  const [savingResults, setSavingResults] = useState(false);

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

  const handleValueChange = (orderId: string, parameterId: string, value: string) => {
    setLabValues(prev => ({
      ...prev,
      [orderId]: { orderId, parameterId, value }
    }));
  };

  const handleSaveResults = async () => {
    const resultsToSave = Object.values(labValues).filter(v => v.value.trim() !== '');
    if (resultsToSave.length === 0) return;
    
    try {
      setSavingResults(true);
      // Group by orderId
      const byOrder = resultsToSave.reduce((acc, curr) => {
        if (!acc[curr.orderId]) acc[curr.orderId] = [];
        acc[curr.orderId].push({ parameterId: curr.parameterId, value: curr.value });
        return acc;
      }, {} as Record<string, any[]>);

      for (const [orderId, results] of Object.entries(byOrder)) {
        await api.post(`/consultation/investigations/${orderId}/results`, { results });
      }

      toast.success('Lab results saved successfully');
      setLabValues({});
      fetchCaseDetails();
    } catch (error) {
      console.error('Failed to save results', error);
      toast.error('Failed to save lab results');
    } finally {
      setSavingResults(false);
    }
  };

  const isAbnormal = (value: string, parameter: any) => {
    if (!value || isNaN(Number(value)) || !parameter) return false;
    const num = Number(value);
    
    if (parameter.criticalHigh && num > parameter.criticalHigh) return true;
    if (parameter.criticalLow && num < parameter.criticalLow) return true;

    if (parameter.referenceRanges && parameter.referenceRanges.length > 0) {
      const patientGender = patientData?.gender;
      const matchingRange = parameter.referenceRanges.find((r: any) => !r.gender || r.gender === patientGender) || parameter.referenceRanges[0];
      
      if (matchingRange) {
        if (matchingRange.minValue && num < matchingRange.minValue) return true;
        if (matchingRange.maxValue && num > matchingRange.maxValue) return true;
      }
    }
    
    return false;
  };

  const [globalPending, setGlobalPending] = useState<any[]>([]);

  useEffect(() => {
    if (caseId) {
      fetchCaseDetails();
    } else {
      fetchGlobalPending();
    }
  }, [caseId]);

  const fetchGlobalPending = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/consultation/investigations/pending');
      setGlobalPending(res.data || res);
    } catch (err) {
      toast.error('Failed to load pending lab reports');
    } finally {
      setIsLoading(false);
    }
  };

  const getNormalRangeString = (parameter: any) => {
    if (!parameter) return 'N/A';
    const patientGender = patientData?.gender;
    const range = parameter.referenceRanges?.find((r: any) => !r.gender || r.gender === patientGender) || parameter.referenceRanges?.[0];
    if (range && (range.minValue || range.maxValue)) {
      return `${range.minValue || 0} - ${range.maxValue || '∞'} ${parameter.unit || ''}`;
    }
    return parameter.normalRange || 'N/A';
  };

  if (isLoading && caseId) {
    return (
      <NursingLayout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
           <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Case Files...</p>
        </div>
      </NursingLayout>
    );
  }

  if (!caseId) {
    return (
      <NursingLayout>
        <div className="max-w-5xl mx-auto py-10 space-y-6">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                    <FlaskConical className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Global Pending Lab Reports</h2>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Select a patient to upload their results</p>
                 </div>
              </div>
              <div className="text-[10px] font-black text-white bg-green-600 px-3 py-1.5 rounded-full uppercase tracking-widest">
                 {globalPending.length} Pending
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                 <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>
              ) : globalPending.length === 0 ? (
                 <div className="col-span-full py-20 text-center text-slate-400 text-xs font-black uppercase tracking-widest">No pending reports</div>
              ) : (
                 globalPending.map((order) => {
                    const patient = order.patientCase?.patient;
                    return (
                       <button
                         key={order.id}
                         onClick={() => window.location.href = `/nursing/lab-reports?caseId=${order.patientCase?.id}`}
                         className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left hover:border-green-500 hover:shadow-md transition-all group"
                       >
                         <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-widest">{order.status}</span>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                         </div>
                         <h3 className="text-lg font-black text-slate-800 tracking-tight">{patient?.firstName} {patient?.lastName}</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">MRD: {patient?.mrdNumber}</p>
                         <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.1em]">{order.testName || 'Investigation'}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
                         </div>
                       </button>
                    );
                 })
              )}
           </div>
        </div>
      </NursingLayout>
    );
  }

  return (
    <NursingLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
        
        {/* 🔷 PREMIUM PAGE HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-[2rem] p-10 border border-green-500/20 shadow-2xl shadow-green-900/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-10 pointer-events-none">
             <FlaskConical className="w-64 h-64 text-white" />
           </div>
           
           <div className="relative z-10 flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center text-white shadow-inner border border-white/30">
                 <FlaskConical className="w-10 h-10" />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-white tracking-tight uppercase drop-shadow-sm">
                    Lab Report Management
                 </h1>
                 <p className="text-xs font-bold text-green-100 uppercase tracking-[0.2em] mt-2 flex items-center gap-2 flex-wrap">
                    Patient: <span className="text-white bg-white/20 px-2 py-0.5 rounded-md">{patientData?.firstName} {patientData?.lastName}</span>
                    <span className="opacity-50">|</span>
                    MRD: <span className="text-white">{patientData?.mrdNumber}</span> 
                    <span className="opacity-50">|</span>
                    Case ID: <span className="text-white">{caseId.split('-').pop()}</span>
                 </p>
              </div>
           </div>
           <div className="relative z-10 flex items-center gap-3">
              <div className="px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center gap-3 shadow-lg">
                 <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping absolute" />
                 <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full relative" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Enterprise Sync Active</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* LEFT: PENDING ORDERS */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
                 <div className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Activity className="w-4 h-4 text-green-500" />
                       Investigations
                    </h3>
                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full shadow-inner">
                       {orders.filter(o => o.status !== 'RESULT_READY').length} Pending
                    </span>
                 </div>
                 <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar p-3">
                    {orders.length === 0 ? (
                       <div className="p-12 flex flex-col items-center justify-center text-center opacity-60">
                          <Beaker className="w-12 h-12 text-slate-300 mb-4" />
                          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">No investigations ordered</span>
                       </div>
                    ) : (
                       orders.map((order) => {
                          const testName = order.testName || order.test?.name || 'Lab Investigation';
                          const isSelected = selectedOrderId === order.id;
                          return (
                             <button 
                                key={order.id}
                                onClick={() => setSelectedOrderId(order.id)}
                                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 mb-2 ${
                                   isSelected 
                                   ? 'bg-gradient-to-br from-green-50 to-emerald-50/30 border border-green-200 shadow-md translate-x-1' 
                                   : 'bg-white hover:bg-slate-50 border border-transparent hover:border-slate-200'
                                }`}
                             >
                                <div className="flex justify-between items-start mb-3 gap-2">
                                   <span className={`text-[11px] font-black uppercase tracking-widest ${isSelected ? 'text-green-800' : 'text-slate-700'}`}>
                                      {testName}
                                   </span>
                                   <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase shadow-sm shrink-0 ${
                                      order.status === 'RESULT_READY' 
                                      ? 'bg-emerald-500 text-white' 
                                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                                   }`}>
                                      {order.status}
                                   </span>
                                </div>
                                <p className={`text-[9px] font-bold uppercase tracking-widest line-clamp-2 ${isSelected ? 'text-green-600/80' : 'text-slate-400'}`}>
                                   {order.notes || 'Routine checkup requested by physician'}
                                </p>
                                {order.files?.length > 0 && (
                                   <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors ${
                                      isSelected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                   }`}>
                                      <FileIcon className="w-3 h-3" />
                                      {order.files.length} Report(s) Linked
                                   </div>
                                )}
                             </button>
                          );
                       })
                    )}
                 </div>
              </div>
           </div>

           {/* RIGHT: UPLOAD & PREVIEW */}
           <div className="lg:col-span-8 space-y-5">
              {selectedOrderId ? (
                 <>
                    {/* UPLOAD BOX */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden relative group">
                       <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                       
                       <div className="p-8 border-b border-slate-100 flex items-center justify-between relative z-10">
                          <h2 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                               <CloudUpload className="w-4 h-4" />
                             </div>
                             Upload Report For: <span className="text-green-600 ml-1">{orders.find(o => o.id === selectedOrderId)?.testName || orders.find(o => o.id === selectedOrderId)?.test?.name || 'Lab Investigation'}</span>
                          </h2>
                       </div>

                       <div className="p-8 relative z-10">
                          <div className="relative">
                              <input 
                                 id={`file-upload-${selectedOrderId}`}
                                 type="file" 
                                 accept="application/pdf"
                                 onChange={handleFileUpload}
                                 disabled={isUploading}
                                 className="hidden"
                              />
                              <label 
                                 htmlFor={`file-upload-${selectedOrderId}`}
                                 className={`border-2 border-dashed rounded-[1.5rem] p-10 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer ${
                                    isUploading ? 'bg-green-50 border-green-300 scale-[0.98] cursor-not-allowed' : 'bg-slate-50/80 border-slate-300 hover:bg-green-50/80 hover:border-green-400 hover:shadow-lg hover:shadow-green-100/50'
                                 }`}
                              >
                                {isUploading ? (
                                   <div className="flex flex-col items-center gap-6 w-full max-w-md">
                                      <div className="relative">
                                        <div className="w-16 h-16 border-4 border-green-100 rounded-full animate-pulse" />
                                        <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin" />
                                      </div>
                                      <div className="w-full text-center space-y-3">
                                        <p className="text-[10px] font-black text-green-800 uppercase tracking-[0.2em]">Uploading Report... {uploadProgress}%</p>
                                        <div className="h-3 w-full overflow-hidden rounded-full bg-green-100 shadow-inner">
                                           <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300 relative" style={{ width: `${uploadProgress}%` }}>
                                             <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                           </div>
                                        </div>
                                      </div>
                                   </div>
                                ) : (
                                   <div className="flex flex-col items-center gap-5">
                                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-md shadow-green-900/5 group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500">
                                         <Upload className="w-8 h-8" />
                                      </div>
                                      <div className="text-center space-y-2">
                                         <p className="text-sm font-black text-slate-700 uppercase tracking-widest">Click or Drag PDF Here</p>
                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-3 py-1 rounded-full inline-block">Validated Clinical PDF Format Only</p>
                                      </div>
                                   </div>
                                )}
                              </label>
                              {uploadError && (
                                 <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-center gap-2 text-rose-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                       {uploadError}
                                    </p>
                                 </div>
                              )}
                          </div>
                       </div>
                    </div>

                    {/* ENTER LAB VALUES */}
                     {(() => {
                        const order = orders.find(o => o.id === selectedOrderId);
                        if (!order || order.status === 'COMPLETED') return null;
                        const param = order.results?.[0]?.parameter;
                        if (!param) return null;
                        
                        const currentVal = labValues[order.id]?.value || '';
                        const abnormal = isAbnormal(currentVal, param);

                        return (
                           <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
                              <div className="p-8 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
                                 <h2 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                                      <Activity className="w-4 h-4" />
                                    </div>
                                    Manual Value Entry
                                 </h2>
                              </div>
                              <div className="p-8">
                                 <div className="bg-slate-50/50 border border-slate-100 rounded-2xl overflow-hidden">
                                    <table className="w-full text-left">
                                       <thead className="bg-slate-100/50">
                                          <tr>
                                             <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Parameter</th>
                                             <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Value</th>
                                             <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Master Range</th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-slate-100">
                                          <tr className="hover:bg-white transition-colors">
                                             <td className="py-6 px-6 text-[11px] font-black text-slate-700 tracking-wider uppercase">{param.name}</td>
                                             <td className="py-6 px-6 relative">
                                                <input 
                                                   type="text"
                                                   placeholder="Value" 
                                                   className={`h-12 px-4 border-2 rounded-xl text-xs font-black tracking-widest w-36 pr-10 transition-all outline-none focus:ring-4 ${
                                                      abnormal 
                                                      ? 'border-rose-300 text-rose-700 bg-rose-50/50 focus:border-rose-500 focus:ring-rose-500/20' 
                                                      : 'border-slate-200 focus:border-green-500 focus:ring-green-500/20 bg-white'
                                                   }`} 
                                                   value={currentVal}
                                                   onChange={(e) => handleValueChange(order.id, param.id, e.target.value)}
                                                />
                                                {abnormal && (
                                                   <div className="absolute right-10 top-1/2 -translate-y-1/2 text-rose-500 drop-shadow-sm" title="Abnormal value">
                                                      <AlertCircle className="w-5 h-5 animate-pulse" />
                                                   </div>
                                                )}
                                             </td>
                                             <td className="py-6 px-6">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                   {getNormalRangeString(param)}
                                                </span>
                                             </td>
                                          </tr>
                                       </tbody>
                                    </table>
                                 </div>
                                 <div className="mt-8 flex justify-end">
                                    <button 
                                       onClick={handleSaveResults} 
                                       disabled={!currentVal.trim() || savingResults}
                                       className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center gap-2"
                                    >
                                       {savingResults ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                       Save Verified Values
                                    </button>
                                 </div>
                              </div>
                           </div>
                        );
                     })()}

                    {/* ATTACHED FILES LIST */}
                    {orders.find(o => o.id === selectedOrderId)?.files?.length > 0 && (
                       <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden animate-in slide-in-from-bottom-8 duration-700 delay-100">
                          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                               <FileText className="w-4 h-4" />
                             </div>
                             <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em]">Linked Clinical Documents</h3>
                          </div>
                          <div className="divide-y divide-slate-100 p-2">
                             {orders.find(o => o.id === selectedOrderId).files.map((file: any) => (
                                <div key={file.id} className="p-4 m-2 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-white border border-slate-100 shadow-sm text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                         <FileText className="w-6 h-6" />
                                      </div>
                                      <div>
                                         <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{file.fileName}</p>
                                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Uploaded: {new Date(file.uploadedAt).toLocaleString()} • Size: {file.fileSize}</p>
                                      </div>
                                   </div>
                                   <a 
                                      href={secureFileUrl(file.fileUrl)} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-700 transition-all hover:shadow-lg"
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
                 <div className="h-[600px] bg-slate-50/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-white shadow-sm rounded-3xl flex items-center justify-center text-slate-300">
                       <Beaker className="w-12 h-12" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">No Investigation Selected</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase mt-3 tracking-widest max-w-xs mx-auto leading-relaxed">Select an order from the left panel to upload results</p>
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
