'use client';

import React from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Users, 
  CalendarDays, 
  IndianRupee, 
  UserPlus, 
  ClipboardList, 
  AlertTriangle,
  MoreVertical,
  ArrowUpRight
} from 'lucide-react';

const SummaryCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-default">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <button className="text-slate-300 hover:text-slate-600 transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{title}</p>
  </div>
);

const AdminDashboardView = () => {
  const summaries = [
    { title: 'Total Patients', value: '1,248', icon: Users, color: 'blue' },
    { title: "Today's Appts", value: '34', icon: CalendarDays, color: 'indigo' },
    { title: "Today's Revenue", value: '₹ 18,500', icon: IndianRupee, color: 'emerald' },
    { title: 'Active Staff', value: '6', icon: UserPlus, color: 'violet' },
    { title: 'Pending F/U', value: '12', icon: ClipboardList, color: 'orange' },
    { title: 'Drug Alerts', value: '3', icon: AlertTriangle, color: 'rose' },
  ];

  const appointments = [
    { id: 'C001-001', name: 'Rameshbhai Patel', doctor: 'Dr. Valaki', status: 'Completed', payment: 'Paid', time: '09:00' },
    { id: 'C002-001', name: 'Sneha Shah', doctor: 'Dr. Valaki', status: 'In Progress', payment: 'Pending', time: '09:10' },
    { id: 'C003-001', name: 'Mahesh Kumar', doctor: 'Dr. Valaki', status: 'Waiting', payment: '-', time: '09:20' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Overview - Today's Summary</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Real-time pulse of your clinic operations.</p>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {summaries.map((s) => (
            <SummaryCard key={s.title} {...s} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Volume Bar Chart Placeholder */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800">Patient Volume - Last 7 Days</h3>
              <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">Details</button>
            </div>
            <div className="h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 p-4">
              <div className="flex items-end gap-2 w-full max-w-[200px] h-32">
                <div className="flex-1 bg-blue-200 h-[40%] rounded-t-sm"></div>
                <div className="flex-1 bg-blue-400 h-[70%] rounded-t-sm"></div>
                <div className="flex-1 bg-blue-300 h-[50%] rounded-t-sm"></div>
                <div className="flex-1 bg-blue-600 h-[90%] rounded-t-sm"></div>
                <div className="flex-1 bg-blue-400 h-[60%] rounded-t-sm"></div>
                <div className="flex-1 bg-blue-500 h-[80%] rounded-t-sm"></div>
                <div className="flex-1 bg-blue-200 h-[30%] rounded-t-sm"></div>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-4">[ Bar Chart Placeholder ]</p>
            </div>
          </div>

          {/* Revenue Breakdown Pie Chart Placeholder */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800">Revenue Breakdown</h3>
              <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">Reports</button>
            </div>
            <div className="h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
              <div className="w-32 h-32 rounded-full border-8 border-blue-500 border-t-emerald-500 border-r-indigo-500 relative flex items-center justify-center">
                <div className="absolute inset-4 bg-slate-50 rounded-full border-2 border-dashed border-slate-200"></div>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">[ Pie Chart Placeholder ]</p>
            </div>
          </div>
        </div>

        {/* Recent Appointments Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Recent Appointments</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded border border-slate-100 shadow-sm">Today's List</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                  <th className="px-6 py-4">Case No.</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-600">{apt.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-extrabold text-slate-800">{apt.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-500">{apt.time}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          <Stethoscope className="w-3 h-3 text-indigo-500" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{apt.doctor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        apt.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-xs font-bold ${apt.payment === 'Paid' ? 'text-emerald-600' : apt.payment === 'Pending' ? 'text-amber-600' : 'text-slate-400'}`}>
                        {apt.payment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50/30 border-t border-slate-50 text-center">
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
              View All Appointments
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Internal icon for Table since I need Stethoscope
const Stethoscope = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2.8l2.7.7a5.1 5.1 0 0 0 1.5 8 2.5 2.5 0 0 1 1.2 2.2V16"/><path d="M12.9 3.5a2.1 2.1 0 1 1 4.1.8 2.1 2.1 0 1 1-4.1-.8Z"/><path d="M15 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M12 16v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-5"/><path d="M18 16h-6"/><path d="M15 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
  </svg>
);

export default AdminDashboardView;
