'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  History,
  Activity,
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { analyticsApi } from '@/lib/api/analytics';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const InventoryAnalyticsView = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await analyticsApi.getInventoryAnalytics();
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch inventory analytics:', error);
        toast.error('Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading && !data) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Intelligence</h1>
            <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wider">Supply Chain Performance & Valuation</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock Value</p>
                <p className="text-xl font-black text-indigo-600">{formatCurrency(data?.stockValuation || 0)}</p>
             </div>
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Layers className="w-6 h-6" />
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all">
              <div className="p-2 w-10 h-10 rounded-xl bg-blue-50 text-blue-600 mb-4">
                 <Package className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">124</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Active SKUs</p>
           </div>
           
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all">
              <div className="p-2 w-10 h-10 rounded-xl bg-rose-50 text-rose-600 mb-4">
                 <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-rose-600">{data?.nearExpiryBatches?.length || 0}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Expiry Risks</p>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all">
              <div className="p-2 w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                 <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-emerald-600">82%</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Turnover Rate</p>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all">
              <div className="p-2 w-10 h-10 rounded-xl bg-amber-50 text-amber-600 mb-4">
                 <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-amber-600">14</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Reorder Alerts</p>
           </div>
        </div>

        {/* Near Expiry List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Expiring Batches (90 Days)</h3>
                 <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Urgent</span>
              </div>
              <div className="p-4">
                 <div className="space-y-3">
                    {data?.nearExpiryBatches?.map((batch: any, i: number) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-rose-500 shadow-sm">
                                <History className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-900 uppercase">{batch.drug.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BATCH: {batch.batchNumber} • QTY: {batch.stockQuantity}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-rose-600">
                                {new Date(batch.expiryDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                             </p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Value: {formatCurrency(batch.stockQuantity * batch.purchasePrice)}</p>
                          </div>
                       </div>
                    ))}
                    {data?.nearExpiryBatches?.length === 0 && (
                       <div className="py-20 text-center text-slate-400">
                          <ShieldCheck className="w-12 h-12 mx-auto opacity-20 mb-4" />
                          <p className="text-xs font-black uppercase tracking-widest">No Expiry Risks Detected</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Inventory Movement Chart Placeholder */}
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Stock Movements (OUT)</h3>
                 <Package className="w-5 h-5 text-slate-400" />
              </div>
              <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.topMovingDrugs || []} layout="vertical" margin={{ left: 60 }}>
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                       <XAxis type="number" hide />
                       <YAxis 
                         type="category" 
                         dataKey="inventoryId" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b' }} 
                         width={60}
                       />
                       <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', fontSize: '12px' }} />
                       <Bar dataKey="_sum.quantity" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InventoryAnalyticsView;
