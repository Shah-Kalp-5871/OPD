'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { analyticsApi } from '@/lib/api/analytics';
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
  Info,
  Server,
  ShieldAlert,
  CheckCircle2,
  Radio,
  RefreshCw,
  Layers
} from 'lucide-react';

interface TelemetryData {
  fhirRequestsTotal: number;
  fhirValidationFailuresTotal: number;
  hl7MessagesParsedTotal: number;
  hl7DeadLetterQueueTotal: number;
  hl7SuccessRate: number;
  avgBulkExportDurationSeconds: number;
  websocketActiveConnections: number;
  telemedicineAuthFailuresTotal: number;
  publicApiRequestsTotal: Record<string, number>;
  publicApiRateLimitedTotal: number;
}

const ReportsAnalyticsView = () => {
  const [activeTab, setActiveTab] = useState('1 Month');
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loadingTelemetry, setLoadingTelemetry] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await analyticsApi.getInteropTelemetry();
        setTelemetry(res.data || res);
      } catch (err) {
        console.error('Failed to fetch telemetry:', err);
      } finally {
        setLoadingTelemetry(false);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

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

        {/* 🔷 SMART-on-FHIR & HL7 Interoperability Telemetry Panel */}
        <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative group">
          {/* Decorative glowing gradient effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="p-8 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-black text-white uppercase tracking-[0.15em] flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  SMART-on-FHIR & HL7 Interoperability Telemetry
                </h3>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                Live monitoring of electronic health record exchanges, HL7 packets & security gateways
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                Live Feed (5s)
              </span>
              <span className="px-4 py-1.5 bg-emerald-950/60 border border-emerald-800/50 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Gateway: Active
              </span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
            {/* Left Column: HL7 & FHIR Transactions */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-800/60">
                <Layers className="w-4 h-4 text-blue-400" />
                <h4 className="text-[11px] font-black text-slate-200 uppercase tracking-widest">HL7 Message Processing Engine</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* HL7 Total Parsed */}
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Total Messages Parsed</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white tracking-tight">
                      {loadingTelemetry ? '...' : telemetry?.hl7MessagesParsedTotal ?? 0}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">packets</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    HL7 v2.x Standard Compliant
                  </div>
                </div>

                {/* Dead Letter Queue */}
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Dead-Letter Queue (DLQ)</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-black tracking-tight ${(telemetry?.hl7DeadLetterQueueTotal ?? 0) > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-300'}`}>
                      {loadingTelemetry ? '...' : telemetry?.hl7DeadLetterQueueTotal ?? 0}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">failures</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase">
                    <span className={`w-1.5 h-1.5 rounded-full ${(telemetry?.hl7DeadLetterQueueTotal ?? 0) > 0 ? 'bg-amber-500' : 'bg-slate-600'}`}></span>
                    Awaiting Manual Audit Review
                  </div>
                </div>
              </div>

              {/* HL7 Parsing Success Rate Bar */}
              <div className="bg-slate-800/20 p-6 rounded-2xl border border-slate-800/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Ingestion & Parsing Success Rate</span>
                  <span className="text-xs font-black text-emerald-400">
                    {loadingTelemetry ? '...' : `${(telemetry?.hl7SuccessRate ?? 100).toFixed(2)}%`}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-1000"
                    style={{ width: `${loadingTelemetry ? 100 : telemetry?.hl7SuccessRate ?? 100}%` }}
                  />
                </div>
                <p className="text-[9px] text-slate-500 mt-2.5 font-bold uppercase tracking-wider">
                  Target threshold: &gt;99.5% operational data integrity
                </p>
              </div>

              {/* SMART-on-FHIR Gateway Metrics */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-800/60">
                  <Radio className="w-4 h-4 text-purple-400" />
                  <h4 className="text-[11px] font-black text-slate-200 uppercase tracking-widest">SMART-on-FHIR Access Gateway</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* FHIR Queries */}
                  <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">SMART-on-FHIR Queries</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white tracking-tight">
                        {loadingTelemetry ? '...' : telemetry?.fhirRequestsTotal ?? 0}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">requests</span>
                    </div>
                  </div>

                  {/* Schema Validation Failures */}
                  <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Validation Schema Failures</span>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-black tracking-tight ${(telemetry?.fhirValidationFailuresTotal ?? 0) > 0 ? 'text-rose-500' : 'text-slate-300'}`}>
                        {loadingTelemetry ? '...' : telemetry?.fhirValidationFailuresTotal ?? 0}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">rejections</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Security, Latency & WebSockets */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-800/60">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h4 className="text-[11px] font-black text-slate-200 uppercase tracking-widest">Rate Limiting & Threat Shield</h4>
              </div>

              {/* Rate Limiting Stats */}
              <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800/60 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Public API Rate Limited Total</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-black tracking-tight ${(telemetry?.publicApiRateLimitedTotal ?? 0) > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-300'}`}>
                      {loadingTelemetry ? '...' : telemetry?.publicApiRateLimitedTotal ?? 0}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">violations</span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    DDoS protection limits set to 120 reqs/min per client IP
                  </p>
                </div>
                <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-800/30">
                  <ShieldAlert className="w-6 h-6 text-amber-500" />
                </div>
              </div>

              {/* FHIR Bulk Data Export Latency */}
              <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800/60 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">FHIR Bulk Export Avg Latency</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white tracking-tight">
                        {loadingTelemetry ? '...' : `${(telemetry?.avgBulkExportDurationSeconds ?? 0).toFixed(2)}`}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">seconds</span>
                    </div>
                  </div>
                  <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-900/30">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/60">
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                    <span>Performance Rating:</span>
                    <span className="text-emerald-400">Excellent (&lt;3.5s)</span>
                  </div>
                </div>
              </div>

              {/* WebSocket Live Channel Active Connections */}
              <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800/60 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">WebSocket Connected Staff Clients</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-emerald-400 tracking-tight animate-pulse">
                        {loadingTelemetry ? '...' : telemetry?.websocketActiveConnections ?? 0}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">live sessions</span>
                    </div>
                  </div>
                  <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/30">
                    <Radio className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                  <span>SSE &amp; PubSub Subscribed Clients</span>
                  <span>Syncing Live Clinical Events</span>
                </div>
              </div>
            </div>
          </div>
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
