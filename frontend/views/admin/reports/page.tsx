'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Pill, 
  Wallet, 
  Stethoscope, 
  FileText, 
  Download, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  LineChart,
  Activity,
  BriefcaseMedical,
  IndianRupee,
  Info
} from 'lucide-react';

const ReportsAnalyticsView = () => {
  const [activeTab, setActiveTab] = useState('1 Month');

  const timeFilters = ['Today', '1 Week', '1 Month', 'Yearly', 'Custom Range'];

  const reportCategories = [
    {
      title: 'Patient Reports',
      color: 'bg-blue-600',
      icon: Users,
      items: ['New Patients', 'Follow-Up Visits', 'Missed Follow-Ups', 'Inquiries', 'Cancelled Appts']
    },
    {
      title: 'Income Reports',
      color: 'bg-emerald-600',
      icon: Wallet,
      items: ['Consultation Income', 'Procedure Income', 'Total Revenue', 'Discounts', 'FOC / Pending Due']
    },
    {
      title: 'Drug Reports',
      color: 'bg-rose-600',
      icon: Pill,
      items: ['Drug Dispensing History', 'Drug Not Taken', 'Low Stock Alerts', 'Near Expiry Drugs', 'Drug Returns']
    },
    {
      title: 'Staff Reports',
      color: 'bg-amber-600',
      icon: BriefcaseMedical,
      items: ['Attendance', 'Working Hours', 'Salary Summary', 'Performance KPIs']
    },
    {
      title: 'Expense Reports',
      color: 'bg-slate-600',
      icon: TrendingDown,
      items: ['Electricity', 'Rent', 'Salaries', 'Drug Purchase', 'Equipment', 'P&L Summary']
    },
    {
      title: 'Procedure Reports',
      color: 'bg-indigo-600',
      icon: Stethoscope,
      items: ['Sessions Done', 'Advised Not Taken', 'Procedure Income', 'Pending Sessions']
    }
  ];

  const financialKPIs = [
    { label: 'Total Income', value: '4,85,000', icon: TrendingUp, trend: '+12%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Expense', value: '1,20,000', icon: TrendingDown, trend: '-2%', color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Net Profit', value: '3,65,000', icon: IndianRupee, trend: '+15%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Discounts', value: '12,400', icon: PieChart, trend: '+5%', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'FOC / Pending', value: '8,200', icon: Activity, trend: '-10%', color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Reports & Analytics</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Clinic Intelligence & Performance Dashboard</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-blue-300 transition-all shadow-sm">
                <Download className="w-4 h-4" />
                Export PDF
             </button>
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-blue-300 transition-all shadow-sm">
                <Download className="w-4 h-4" />
                Export CSV
             </button>
          </div>
        </div>

        {/* 🔷 Time Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit self-start overflow-x-auto max-w-full">
          {timeFilters.map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveTab(filter)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === filter 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-100' 
                : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* 🔷 Financial Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
           {financialKPIs.map((kpi, idx) => (
             <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
                <div className="flex flex-col gap-4">
                   <div className={`w-10 h-10 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <kpi.icon className="w-5 h-5" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{kpi.label}</p>
                      <h3 className={`text-xl font-black ${kpi.color} tracking-tight`}>
                        {idx !== 4 && <span className="text-xs mr-1 opacity-40 italic font-black">■</span>}
                        {kpi.value}
                      </h3>
                      <div className="flex items-center gap-1">
                         {kpi.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-rose-500" />}
                         <span className={`text-[10px] font-black ${kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{kpi.trend}</span>
                         <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">vs Last Month</span>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* 🔷 Report Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reportCategories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 transition-all">
               <div className={`px-6 py-4 ${cat.color} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                     <cat.icon className="w-4 h-4 text-white" />
                     <h3 className="text-[11px] font-black text-white uppercase tracking-widest leading-none">{cat.title}</h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
               </div>
               <div className="p-6">
                  <ul className="space-y-4">
                     {cat.items.map((item, i) => (
                       <li key={i} className="flex items-center justify-between group/item cursor-pointer">
                          <span className="text-xs font-bold text-slate-600 group-hover/item:text-blue-600 transition-colors flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/item:bg-blue-400 transition-colors"></span>
                             {item}
                          </span>
                          <span className="text-[10px] font-black text-slate-300 opacity-0 group-hover/item:opacity-100 transition-all uppercase tracking-tighter">View Report →</span>
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                  All reports export as PDF or CSV
               </div>
            </div>
          ))}
        </div>

        {/* 🔷 Chart Section (Placeholders Only) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 bg-slate-50 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em] flex items-center gap-2">
                 <BarChart3 className="w-4 h-4 text-blue-500" />
                 Chart View – Patient Volume & Income
              </h3>
           </div>
           <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Bar Chart Placeholder */}
              <div className="aspect-[16/9] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group">
                 <div className="flex items-end gap-2 h-32">
                    {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className={`w-8 rounded-t-lg transition-all duration-500 ${i % 2 === 0 ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-slate-300 group-hover:bg-slate-400'}`}></div>
                    ))}
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bar Chart: Patient Volume (New vs F/U vs Missed)</p>
                    <p className="text-xs font-bold text-slate-300 italic mt-1">[ Chart Placeholder ]</p>
                 </div>
              </div>

              {/* Line Chart Placeholder */}
              <div className="aspect-[16/9] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-6 group">
                 <div className="relative w-full max-w-[200px] h-32 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-500 stroke-[4] fill-none drop-shadow-lg transition-all duration-500 group-hover:scale-105">
                       <path d="M0,80 Q25,20 50,50 T100,10" className="transition-all duration-500" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50/50 to-transparent"></div>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Line Graph: Revenue Trend (Consult + Procedure)</p>
                    <p className="text-xs font-bold text-slate-300 italic mt-1">[ Chart Placeholder ]</p>
                 </div>
              </div>
           </div>
           
           <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-start gap-4">
              <Info className="w-4 h-4 text-blue-500 mt-1" />
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
                   P&L = Total Income minus Total Expense = Net Profit (auto calculated logic enabled).
                 </p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                   Data refresh frequency: Every 15 minutes. Advanced AI forecasting enabled for patient load predictions.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsAnalyticsView;
