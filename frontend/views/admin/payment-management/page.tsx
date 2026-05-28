'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { QRCodeCanvas } from 'qrcode.react';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Wallet,
  QrCode,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Info,
  Eye,
  Smartphone,
} from 'lucide-react';

const PaymentManagementView = () => {
  const [upiId, setUpiId] = useState('');
  const [upiPayeeName, setUpiPayeeName] = useState('');
  const [previewAmount, setPreviewAmount] = useState('100');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Build the UPI deep-link for preview QR
  const upiString =
    upiId
      ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiPayeeName || 'Clinic')}&am=${previewAmount}&cu=INR&tn=OPD+Payment`
      : '';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/payment-settings');
        setUpiId(res.data.upiId || '');
        setUpiPayeeName(res.data.upiPayeeName || '');
      } catch (e) {
        toast.error('Failed to load payment settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!upiId.trim()) {
      toast.error('UPI ID is required');
      return;
    }
    setIsSaving(true);
    try {
      await api.put('/admin/payment-settings', { upiId, upiPayeeName });
      toast.success('Payment settings saved successfully');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-28 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
            Payment Management
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            Configure UPI & Direct Payment Options
          </p>
        </div>

        {/* UPI Configuration Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-violet-200 transition-all">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
                UPI Payment Configuration
              </h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100 text-[10px] font-black text-amber-600 uppercase tracking-tighter">
              <Info className="w-3.5 h-3.5" />
              Admin Only
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  UPI ID *
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. hospital@sbi or 9876543210@paytm"
                  disabled={isLoading}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-violet-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-normal"
                />
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed pl-1">
                  This is your clinic's registered UPI Virtual Payment Address.
                  All direct UPI payments will go directly to this account.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Payee Display Name
                </label>
                <input
                  type="text"
                  value={upiPayeeName}
                  onChange={(e) => setUpiPayeeName(e.target.value)}
                  placeholder="e.g. MedFlow OPD, City Hospital"
                  disabled={isLoading}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-violet-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-normal"
                />
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed pl-1">
                  This name will appear in the patient's UPI app when they scan.
                </p>
              </div>

              {/* Info Banner */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
                    How it works
                  </p>
                  <p className="text-[10px] font-medium text-blue-600 leading-relaxed">
                    When the receptionist selects <strong>UPI</strong> as the payment mode, a QR
                    code will be auto-generated with the patient's bill amount pre-filled. The
                    patient scans with any UPI app (GPay, PhonePe, Paytm) and pays directly to
                    your clinic account — zero fees, instant settlement.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Live QR Preview */}
            <div className="flex flex-col items-center gap-5">
              <div className="flex items-center gap-2 self-start">
                <Eye className="w-4 h-4 text-slate-400" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Live Preview
                </p>
              </div>

              <div className="space-y-2 w-full">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Preview with amount (₹)
                </label>
                <input
                  type="number"
                  value={previewAmount}
                  onChange={(e) => setPreviewAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-slate-50 to-violet-50 border border-violet-100 rounded-3xl w-full">
                {upiId ? (
                  <>
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <QRCodeCanvas
                        value={upiString}
                        size={180}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-black text-slate-800">
                        {upiPayeeName || 'Payee Name'}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400">{upiId}</p>
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" />
                        UPI QR Ready
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-8 text-slate-300">
                    <QrCode className="w-12 h-12" />
                    <p className="text-[11px] font-black uppercase tracking-widest">
                      Enter UPI ID to preview
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <Smartphone className="w-3.5 h-3.5" />
                  Scan with GPay · PhonePe · Paytm · BHIM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Footer */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${saved ? 'bg-emerald-500' : 'bg-amber-400'} animate-pulse`} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {saved ? 'Settings Saved Successfully' : 'Unsaved Changes'}
              </span>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="flex items-center gap-3 px-12 py-4 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-violet-100 uppercase tracking-[0.15em] disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PaymentManagementView;
