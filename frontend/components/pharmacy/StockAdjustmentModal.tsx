'use client';

import React, { useState } from 'react';
import { X, Save, Loader2, AlertTriangle, Scale } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  batchData: any;
}

const StockAdjustmentModal = ({ isOpen, onClose, onSuccess, batchData }: StockAdjustmentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    batchId: batchData?.id || '',
    quantity: 0,
    type: 'DECREMENT' as 'INCREMENT' | 'DECREMENT',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason || formData.quantity <= 0) {
      toast.error('Please provide a quantity and a reason for adjustment');
      return;
    }

    try {
      setLoading(true);
      await api.post('/pharmacy/inventory/adjust', formData);
      toast.success('Inventory adjusted successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to adjust inventory');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Adjust Stock</h2>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-1">Manual correction for batch: {batchData?.batchNumber}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-10 space-y-8">
           <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <div className="text-xs font-bold text-amber-800 leading-relaxed">
                 Adjustments are permanent and tracked in the movement ledger. Please ensure the adjustment type and quantity are correct.
              </div>
           </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Adjustment Type */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Adjustment Type</label>
              <div className="grid grid-cols-2 gap-4">
                 <button
                   type="button"
                   onClick={() => setFormData({ ...formData, type: 'DECREMENT' })}
                   className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                     formData.type === 'DECREMENT' 
                       ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-100' 
                       : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                   }`}
                 >
                    Deduct Stock
                 </button>
                 <button
                   type="button"
                   onClick={() => setFormData({ ...formData, type: 'INCREMENT' })}
                   className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                     formData.type === 'INCREMENT' 
                       ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                       : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                   }`}
                 >
                    Add Stock
                 </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quantity to Adjust</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Reason */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Reason for Adjustment *</label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all appearance-none"
              >
                <option value="">Select a reason...</option>
                <option value="Damaged Stock">Damaged Stock</option>
                <option value="Expired Stock">Expired Stock</option>
                <option value="Audit Correction">Audit Correction</option>
                <option value="Returned to Supplier">Returned to Supplier</option>
                <option value="Dispensing Error">Dispensing Error</option>
              </select>
            </div>
          </form>
        </div>

        <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-4 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-4 bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
            Confirm Adjustment
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;
