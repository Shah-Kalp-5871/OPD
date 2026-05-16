'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  IndianRupee, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon,
  Search,
  Filter,
  FileText,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { analyticsApi } from '@/lib/api/analytics';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const FinancialReportsView = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await analyticsApi.getFinancialAnalytics(startDate, endDate);
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch financial reports:', error);
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleExport = async () => {
    try {
      toast.info('Generating CSV report...');
      // Note: In a real app, this would be a direct download link
      // For now, I'll simulate it by calling the API and creating a blob
      const res = await (analyticsApi as any).exportFinancialReport(startDate, endDate);
      const blob = new Blob([res.data.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MedFlow_Financial_Report_${startDate}_to_${endDate}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

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
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Intelligence</h1>
            <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wider">Revenue Analysis & Reconciliation</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs font-bold text-slate-600 bg-transparent border-none focus:ring-0 p-0"
                />
             </div>
             <span className="text-slate-300 font-bold text-xs">TO</span>
             <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xs font-bold text-slate-600 bg-transparent border-none focus:ring-0 p-0"
                />
             </div>
             <div className="h-6 w-px bg-slate-100 mx-2" />
             <button 
               onClick={handleExport}
               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
             >
                <Download className="w-3 h-3" />
                Export CSV
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Revenue (Selected Range)</p>
              <h2 className="text-4xl font-black text-slate-900">{formatCurrency(data?.revenueByDay?.reduce((acc: number, curr: any) => acc + Number(curr._sum.amount), 0) || 0)}</h2>
              <div className="flex items-center gap-2 mt-4 text-emerald-500">
                 <ArrowUpRight className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase">Healthy Growth</span>
              </div>
           </div>
           
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Outstanding Balances</p>
              <h2 className="text-4xl font-black text-rose-600">{formatCurrency(data?.totalOutstanding || 0)}</h2>
              <div className="flex items-center gap-2 mt-4 text-rose-500">
                 <ArrowDownRight className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase">Requires Action</span>
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <IndianRupee className="w-24 h-24" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Avg Daily Collection</p>
              <h2 className="text-4xl font-black relative z-10">
                 {formatCurrency((data?.revenueByDay?.reduce((acc: number, curr: any) => acc + Number(curr._sum.amount), 0) || 0) / (data?.revenueByDay?.length || 1))}
              </h2>
              <div className="flex items-center gap-2 mt-4 text-indigo-400 relative z-10">
                 <Activity className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase">Operational Stability</span>
              </div>
           </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Revenue Area Chart */}
           <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-black text-slate-900 uppercase tracking-tight">Revenue Progression</h3>
                 <BarChartIcon className="w-5 h-5 text-slate-400" />
              </div>
              <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.revenueByDay || []}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis 
                         dataKey="paymentDate" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                         tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                       />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                       <Tooltip 
                         cursor={{ fill: '#f8fafc' }}
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                         formatter={(val: any) => [formatCurrency(val), 'Collected']}
                       />
                       <Bar dataKey="_sum.amount" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={32} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Payment Mode Pie */}
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-black text-slate-900 uppercase tracking-tight">Payment Sources</h3>
                 <PieChartIcon className="w-5 h-5 text-slate-400" />
              </div>
              <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                         data={data?.paymentModeBreakdown || []}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={100}
                         paddingAngle={8}
                         dataKey="_sum.amount"
                         nameKey="paymentMode"
                       >
                          {(data?.paymentModeBreakdown || []).map((entry: any, index: number) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontSize: '12px' }} />
                       <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Top Services Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Top Performing Services</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">By Revenue Generation</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                 <FileText className="w-5 h-5 text-slate-500" />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                       <th className="px-8 py-5">Rank</th>
                       <th className="px-8 py-5">Service / Procedure Name</th>
                       <th className="px-8 py-5 text-right">Unit Load</th>
                       <th className="px-8 py-5 text-right">Total Revenue</th>
                       <th className="px-8 py-5 text-right">Contribution</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {(data?.topRevenueDoctors || []).map((item: any, idx: number) => (
                       <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                             <span className="text-sm font-black text-slate-300">#{idx + 1}</span>
                          </td>
                          <td className="px-8 py-5">
                             <p className="text-sm font-black text-slate-900 uppercase">{item.serviceName}</p>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <span className="text-xs font-bold text-slate-600">-- Units</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <span className="text-sm font-black text-slate-900">{formatCurrency(item._sum.totalPrice)}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-3">
                                <span className="text-xs font-black text-indigo-600">
                                   {((item._sum.totalPrice / (data?.topRevenueDoctors?.reduce((a: any, b: any) => a + Number(b._sum.totalPrice), 0) || 1)) * 100).toFixed(1)}%
                                </span>
                                <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                   <div 
                                     className="h-full bg-indigo-500" 
                                     style={{ width: `${(item._sum.totalPrice / (data?.topRevenueDoctors[0]?._sum.totalPrice || 1)) * 100}%` }}
                                   />
                                </div>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FinancialReportsView;
