'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Users, 
  CalendarDays, 
  IndianRupee, 
  UserPlus, 
  ClipboardList, 
  AlertTriangle,
  MoreVertical,
  Activity,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  Stethoscope,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { analyticsApi } from '@/lib/api/analytics';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const SummaryCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string | number, icon: any, color: string, trend?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all group cursor-default relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500`} />
    
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">
          {trend}
        </span>
      )}
    </div>
    
    <div className="relative z-10">
      <h3 className="text-3xl font-black text-slate-900 tracking-tight group-hover:translate-x-1 transition-transform">{value}</h3>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 leading-none">{title}</p>
    </div>
  </motion.div>
);

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AdminDashboardView = () => {
  const [stats, setStats] = useState<any>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, finRes] = await Promise.all([
          analyticsApi.getDashboardStats(),
          analyticsApi.getFinancialAnalytics()
        ]);
        setStats(statsRes.data);
        setFinancials(finRes.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        toast.error('Failed to load real-time analytics');
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

  const summaryCards = [
    { title: "Today's Revenue", value: stats ? formatCurrency(stats.revenueToday) : '₹0', icon: IndianRupee, color: 'emerald' },
    { title: "Today's Patients", value: stats?.patientsToday || 0, icon: Users, color: 'blue' },
    { title: "Active Queue", value: stats?.activeQueue || 0, icon: Clock, color: 'indigo' },
    { title: "Consultations", value: stats?.completedConsultations || 0, icon: CheckCircle2, color: 'violet' },
    { title: "Pending Bills", value: stats?.pendingBills || 0, icon: ClipboardList, color: 'orange' },
    { title: "Stock Alerts", value: stats?.lowStockCount || 0, icon: AlertTriangle, color: 'rose' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8 pb-12 animate-pulse">
           <div className="h-12 w-64 bg-slate-100 rounded-xl" />
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-slate-50 rounded-3xl border border-slate-100" />
              ))}
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-slate-50 rounded-3xl border border-slate-100" />
              <div className="h-80 bg-slate-50 rounded-3xl border border-slate-100" />
           </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-indigo-600" />
              Operational Intelligence
            </h1>
            <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-wider">Clinic Performance & Real-time Metrics</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                <Filter className="w-3 h-3" />
                Filters
             </button>
             <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200">
                Refresh Stats
             </button>
          </div>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {summaryCards.map((s) => (
            <SummaryCard key={s.title} {...s} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Area Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Revenue Trends</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 30 Days Performance</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financials?.revenueByDay || []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="paymentDate" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(val: any) => [formatCurrency(val), 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="_sum.amount" 
                    stroke="#10b981" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Payment Mode Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Payment Distribution</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Collection Channel Analysis</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="h-72 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financials?.paymentModeBreakdown || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="_sum.amount"
                    nameKey="paymentMode"
                  >
                    {(financials?.paymentModeBreakdown || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Collected</p>
                 <p className="text-xl font-black text-slate-900">{formatCurrency(financials?.paymentModeBreakdown?.reduce((acc: number, curr: any) => acc + Number(curr._sum.amount), 0) || 0)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section - Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
           {/* Top Doctors by Revenue */}
           <div className="xl:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Department Performance</h3>
                 <button className="text-[10px] font-black text-blue-600 hover:underline tracking-widest uppercase">View All</button>
              </div>
              <div className="p-4">
                 <div className="space-y-4">
                    {(financials?.topRevenueDoctors || []).map((doc: any, i: number) => (
                       <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black">
                                {i + 1}
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-900 uppercase">{doc.serviceName}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Service Unit</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black text-slate-900">{formatCurrency(doc._sum.totalPrice)}</p>
                             <div className="w-32 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500 rounded-full" 
                                  style={{ width: `${(doc._sum.totalPrice / financials?.topRevenueDoctors[0]?._sum.totalPrice) * 100}%` }}
                                />
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Stock Alerts Widget */}
           <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Package className="w-32 h-32" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight relative z-10">Inventory Health</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 relative z-10">Critical Stock Alerts</p>
              
              <div className="mt-10 space-y-6 relative z-10">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
                       <span className="text-xs font-bold uppercase tracking-wider">Low Stock Items</span>
                    </div>
                    <span className="text-xl font-black">{stats?.lowStockCount || 0}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                       <span className="text-xs font-bold uppercase tracking-wider">Expiring Soon</span>
                    </div>
                    <span className="text-xl font-black">{stats?.nearExpiryCount || 0}</span>
                 </div>
                 
                 <div className="pt-6 border-t border-white/10 mt-6">
                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                       Audit Inventory
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardView;
