'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Calendar, 
  Users, 
  Filter, 
  MessageSquare, 
  XCircle, 
  RefreshCcw, 
  Clock, 
  CheckCircle2, 
  ChevronDown,
  LayoutDashboard,
  Search,
  MoreVertical,
  Save,
  Info
} from 'lucide-react';

const AppointmentManagementView = () => {
  const [selectedAll, setSelectedAll] = useState(false);

  const appointments = [
    { id: 'C001-001-130426', patient: 'Rameshbhai Patel', time: '09:00', checkIn: '09:05', purpose: 'Consultation', doctor: 'Dr. Valaki', status: 'In Progress' },
    { id: 'C002-001-130426', patient: 'Sneha Shah', time: '09:10', checkIn: '09:12', purpose: 'Follow-up', doctor: 'Dr. Vasaki', status: 'Done' },
    { id: 'C003-001-130426', patient: 'Mahesh Kumar', time: '09:20', checkIn: '—', purpose: 'Procedure', doctor: 'Dr. Valaki', status: 'Waiting' },
    { id: 'C004-001-130426', patient: 'Priya Desai', time: '09:30', checkIn: '—', purpose: 'Procedure', doctor: 'Dr. Shah', status: 'Waiting' },
    { id: 'C005-001-130426', patient: 'Kishore Joshi', time: '09:40', checkIn: '—', purpose: 'Inquiry', doctor: 'Dr. Valaki', status: 'Cancelled' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Waiting': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Done': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Appointment Management</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 text-blue-600">Daily Operations Control Centre</p>
        </div>

        {/* 🔷 TOP FILTER BAR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" defaultValue="13/04/2026" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-600 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</label>
            <div className="relative">
              <select className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer">
                <option>All Doctors</option>
                <option>Dr. Valaki</option>
                <option>Dr. Shah</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
            <div className="relative">
              <select className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer">
                <option>All Status</option>
                <option>Waiting</option>
                <option>In Progress</option>
                <option>Done</option>
                <option>Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purpose</label>
            <div className="relative">
              <select className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer">
                <option>All Purpose</option>
                <option>Consultation</option>
                <option>Follow-up</option>
                <option>Procedure</option>
                <option>Inquiry</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 🔷 BULK ACTION BAR */}
        <div className="bg-slate-100/80 border border-slate-200 p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 px-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                checked={selectedAll}
                onChange={() => setSelectedAll(!selectedAll)}
              />
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Select All</span>
            </label>
            <div className="h-6 w-[1px] bg-slate-300 hidden md:block" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden lg:block">
              Actions apply to selected date and patient unit only.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Bulk Send SMS/WhatsApp
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5" />
              Bulk Cancel
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2">
              <RefreshCcw className="w-3.5 h-3.5" />
              Bulk Reschedule
            </button>
          </div>
        </div>

        {/* APPOINTMENT TABLE */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-6 py-5 w-12">
                    {/* Placeholder for header checkbox if needed */}
                  </th>
                  <th className="px-6 py-5">Case ID</th>
                  <th className="px-6 py-5">Patient</th>
                  <th className="px-6 py-5">Appt Time</th>
                  <th className="px-6 py-5 text-center">Check-In</th>
                  <th className="px-6 py-5">Purpose</th>
                  <th className="px-6 py-5">Doctor</th>
                  <th className="px-6 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.map((apt, idx) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                        checked={selectedAll}
                        readOnly
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">{apt.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-extrabold text-slate-800">{apt.patient}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700 font-black text-sm">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        {apt.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold ${apt.checkIn === '—' ? 'text-slate-300' : 'text-emerald-600'}`}>
                        {apt.checkIn}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {apt.purpose}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600">{apt.doctor}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TIME SLOT CONFIGURATION (BOTTOM SECTION) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-12">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
              Time Slot Configuration (Per Doctor)
            </h3>
            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg flex items-center gap-3">
              <Info className="w-4 h-4 text-blue-500" />
              <p className="text-[10px] text-blue-700 font-bold uppercase leading-tight tracking-wider">
                Slot changes apply to all<br/>future appointments only.
              </p>
            </div>
          </div>

          <div className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <div className="space-y-2 lg:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Doctor</label>
                <div className="relative">
                  <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 transition-all text-sm font-bold appearance-none">
                    <option>Select Doctor</option>
                    <option>Dr. Valaki</option>
                    <option>Dr. Shah</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Morning Start</label>
                <input type="time" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="10:00" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Morning End</label>
                <input type="time" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="14:00" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Evening Start</label>
                <input type="time" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="17:00" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Evening End</label>
                <input type="time" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="20:00" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Gap (minutes)</label>
                <input type="number" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" defaultValue="10" />
              </div>
              <div className="flex justify-end">
                <button className="px-16 py-4 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em]">
                  SAVE SLOT CONFIG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AppointmentManagementView;
