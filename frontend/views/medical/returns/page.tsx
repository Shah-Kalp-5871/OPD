'use client';

import React, { useState, useEffect } from 'react';
import MedicalLayout from '@/views/layouts/MedicalLayout';
import { 
  Undo2, 
  Search, 
  User, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Pill,
  Database,
  FileText
} from 'lucide-react';
import api from '@/lib/api';

const ReturnsView = () => {
  const [caseId, setCaseId] = useState('');
  const [loadingCase, setLoadingCase] = useState(false);
  const [patientCase, setPatientCase] = useState<any>(null);
  
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedDrug, setSelectedDrug] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/pharmacy/inventory');
      setInventory(res.data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  const handleSearchCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId) return;
    
    try {
      setLoadingCase(true);
      setPatientCase(null);
      // Wait, there is no generic case fetch endpoint in pharmacy controller except getCasePrescriptions.
      // Let's use getCasePrescriptions to verify the case exists.
      const res = await api.get(`/pharmacy/prescriptions/${caseId}`);
      setPatientCase(res.data);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Case not found');
    } finally {
      setLoadingCase(false);
    }
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId || !selectedDrug || !selectedBatch || !quantity || !reason) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/pharmacy/return', {
        caseId,
        drugId: selectedDrug,
        batchId: selectedBatch,
        quantity: parseInt(quantity, 10),
        reason
      });
      
      setSuccess(true);
      setSelectedDrug('');
      setSelectedBatch('');
      setQuantity('');
      setReason('');
      
      // Auto-hide success after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Return failed:', error);
      alert(error.response?.data?.message || 'Failed to process return');
    } finally {
      setSubmitting(false);
    }
  };

  const activeBatches = inventory.find(i => i.drugId === selectedDrug)?.batches || [];

  return (
    <MedicalLayout>
      <div className="max-w-[1000px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-rose-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-rose-200">
                 <Undo2 className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">Process Returns</h1>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                    Patient Medication Returns & Refunds
                 </p>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[3rem] border-4 border-slate-100 shadow-xl overflow-hidden relative">
           <div className="p-10 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
                 <AlertCircle className="w-5 h-5 text-amber-500" />
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                   Returning items will automatically restock the selected batch and adjust patient billing.
                 </p>
              </div>
           </div>

           <div className="p-12 space-y-12">
              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Return processed successfully! Inventory & Billing updated.</span>
                </div>
              )}

              <form onSubmit={handleSearchCase} className="space-y-4">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Find Patient Case <span className="text-rose-500">*</span></label>
                 <div className="flex gap-4">
                   <div className="relative group flex-1">
                      <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" />
                      <input 
                        type="text" 
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                        placeholder="Enter Case ID (e.g. C003-001-XXXX)" 
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-rose-600 focus:bg-white transition-all shadow-inner" 
                        required
                      />
                   </div>
                   <button type="submit" disabled={loadingCase} className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-colors flex items-center justify-center min-w-[120px]">
                     {loadingCase ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                   </button>
                 </div>
              </form>

              {patientCase && (
                <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800">{patientCase.patient?.firstName} {patientCase.patient?.lastName}</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Doctor: Dr. {patientCase.doctor?.firstName}</p>
                  </div>
                </div>
              )}

              {patientCase && (
                <form onSubmit={handleReturn} className="space-y-8 pt-8 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Drug to Return <span className="text-rose-500">*</span></label>
                        <div className="relative group">
                          <Pill className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors pointer-events-none" />
                          <select 
                            value={selectedDrug}
                            onChange={(e) => setSelectedDrug(e.target.value)}
                            required
                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-rose-600 focus:bg-white transition-all shadow-inner appearance-none"
                          >
                            <option value="">Select Drug...</option>
                            {inventory.map(item => (
                              <option key={item.drugId} value={item.drugId}>{item.drug.drugName}</option>
                            ))}
                          </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Batch <span className="text-rose-500">*</span></label>
                        <div className="relative group">
                          <Database className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors pointer-events-none" />
                          <select 
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            required
                            disabled={!selectedDrug}
                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-rose-600 focus:bg-white transition-all shadow-inner appearance-none disabled:opacity-50"
                          >
                            <option value="">Select Batch...</option>
                            {activeBatches.map((batch: any) => (
                              <option key={batch.id} value={batch.id}>{batch.batchNumber} (Expires: {new Date(batch.expiryDate).toLocaleDateString()})</option>
                            ))}
                          </select>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Quantity <span className="text-rose-500">*</span></label>
                        <div className="relative group">
                          <input 
                            type="number" 
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            placeholder="Enter units to return"
                            className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-rose-600 focus:bg-white transition-all shadow-inner" 
                          />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Reason <span className="text-rose-500">*</span></label>
                        <div className="relative group">
                          <FileText className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors pointer-events-none" />
                          <input 
                            type="text" 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            placeholder="e.g. Patient allergy, wrong drug"
                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[14px] font-black outline-none focus:border-rose-600 focus:bg-white transition-all shadow-inner" 
                          />
                        </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full py-6 bg-rose-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Undo2 className="w-5 h-5" />}
                      Process Return & Refund
                    </button>
                  </div>
                </form>
              )}
           </div>
        </div>
      </div>
    </MedicalLayout>
  );
};

export default ReturnsView;
