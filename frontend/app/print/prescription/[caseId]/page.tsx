'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PrescriptionPrintView from '@/views/print/PrescriptionPrintView';
import { Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function PrescriptionPrintPage() {
  const params = useParams();
  const caseId = params?.caseId as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch the full consultation record for this case
        const response = await api.get(`/consultation/case/${caseId}`);
        setData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch prescription data:', err);
        setError(err.response?.data?.message || 'Failed to load prescription data.');
      } finally {
        setLoading(false);
      }
    };

    if (caseId) {
      fetchData();
    }
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Retrieving Clinical Record...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-6">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 border border-red-100 shadow-xl">
           <AlertCircle className="w-10 h-10" />
        </div>
        <div className="text-center">
           <h1 className="text-xl font-black text-slate-900 uppercase mb-2">Access Denied / Not Found</h1>
           <p className="text-xs font-bold text-slate-500 uppercase max-w-xs mx-auto leading-relaxed">
             {error}
           </p>
        </div>
        <button 
          onClick={() => window.close()}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
        >
          Close Window
        </button>
      </div>
    );
  }

  return <PrescriptionPrintView data={data} />;
}
