'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Package, Calendar, Truck, CreditCard } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ReceiveStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ReceiveStockModal = ({ isOpen, onClose, onSuccess }: ReceiveStockModalProps) => {
  const [loading, setLoading] = useState(false);
  const [drugs, setDrugs] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    drugId: '',
    batchNumber: '',
    expiryDate: '',
    manufacturingDate: '',
    quantity: 0,
    mrp: 0,
    purchasePrice: 0,
    supplierId: '',
    location: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    try {
      const [drugsRes, suppliersRes] = await Promise.all([
        api.get('/admin/drugs'), // Assuming this exists from Master Data phase
        api.get('/pharmacy/suppliers') // We should handle if this 404s
      ]);
      setDrugs(drugsRes.data);
      setSuppliers(suppliersRes.data || []);
    } catch (error) {
      console.error('Failed to fetch drugs/suppliers', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.drugId || !formData.batchNumber || !formData.expiryDate || formData.quantity <= 0) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/pharmacy/inventory/receive', formData);
      toast.success('Stock received successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to receive stock');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Stock Inward</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Receive new batch or purchase</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Drug Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Package className="w-3 h-3 text-emerald-500" />
              Select Medication *
            </label>
            <select
              value={formData.drugId}
              onChange={(e) => setFormData({ ...formData, drugId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none"
            >
              <option value="">Choose a drug...</option>
              {drugs.map((drug) => (
                <option key={drug.id} value={drug.id}>{drug.drugName} ({drug.strength})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Batch Number */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Batch Number *</label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                placeholder="e.g. B-10293"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quantity Received *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Expiry Date */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Calendar className="w-3 h-3 text-red-500" />
                Expiry Date *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Mfg Date */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mfg Date</label>
              <input
                type="date"
                value={formData.manufacturingDate}
                onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Purchase Price */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <CreditCard className="w-3 h-3 text-slate-500" />
                Purchase Price (Unit)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* MRP */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">MRP (Unit Selling Price)</label>
              <input
                type="number"
                step="0.01"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Supplier */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Truck className="w-3 h-3 text-blue-500" />
              Supplier / Vendor
            </label>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none"
            >
              <option value="">Select Supplier...</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </form>

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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Confirm Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveStockModal;
