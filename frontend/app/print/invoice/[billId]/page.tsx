'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { billingApi } from '@/lib/api/billing';
import InvoicePrintView from '@/views/print/InvoicePrintView';
import { Loader2, AlertCircle } from 'lucide-react';

export default function InvoicePrintPage() {
  const params = useParams();
  const billId = params?.billId as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        setLoading(true);
        const response = await billingApi.getBillById(billId);
        setData(response.data || response);
      } catch (err: any) {
        console.error('Failed to fetch bill:', err);
        setError(err.response?.data?.message || 'Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };

    if (billId) {
      fetchBill();
    }
  }, [billId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Secure Invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full p-8 bg-white shadow-2xl rounded-3xl border border-slate-100 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-900 uppercase">Access Error</h1>
            <p className="text-sm font-bold text-slate-500 uppercase leading-relaxed">{error || 'Invoice record not found'}</p>
          </div>
          <button 
            onClick={() => window.close()}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return <InvoicePrintView data={data} />;
}
