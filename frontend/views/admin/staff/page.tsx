'use client';

import React, { useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Briefcase, 
  Calendar, 
  Clock, 
  DollarSign, 
  ClipboardList, 
  Edit3, 
  Info,
  CheckCircle2,
  XCircle,
  MoreVertical
} from 'lucide-react';

const StaffManagementView = () => {
  const [editingStaff, setEditingStaff] = useState<any>(null);

  const staffList = [
    { name: 'Kavita Patel', role: 'Reception', email: 'kavita@clinic.com', attendance: '22/26', hours: '200 hrs', salary: '18,000' },
    { name: 'Bhavna Desai', role: 'Nursing', email: 'bhavna@clinic.com', attendance: '20/26', hours: '190 hrs', salary: '20,000' },
    { name: 'Suresh Shah', role: 'Medical', email: 'suresh@clinic.com', attendance: '20/26', hours: '158 hrs', salary: '16,000' },
  ];

  const attendanceLog = [
    { date: '13/04/2026', clockIn: '09:02', clockOut: '17:05', total: '8.0 hrs', status: 'Present' },
    { date: '12/04/2026', clockIn: '08:55', clockOut: '17:10', total: '8.2 hrs', status: 'Present' },
    { date: '11/04/2026', clockIn: '—', clockOut: '—', total: '—', status: 'Absent' },
  ];

  const handleEdit = (staff: any) => {
    setEditingStaff(staff);
    document.getElementById('staff-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdd = () => {
    setEditingStaff(null);
    document.getElementById('staff-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AdminLayout>
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Staff Management</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Workforce & Payroll Administration</p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase tracking-widest"
          >
            <UserPlus className="w-4 h-4" />
            + Add Staff
          </button>
        </div>

        {/* 🔷 Staff Summary Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-5">Name</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Email</th>
                  <th className="px-8 py-5">Attendance</th>
                  <th className="px-8 py-5">This Month Hrs</th>
                  <th className="px-8 py-5">Salary</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staffList.map((staff, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-sm font-extrabold text-slate-800">{staff.name}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-bold text-sm">
                      {staff.email}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-700">{staff.attendance} <span className="text-slate-400 font-medium ml-1">days</span></span>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit">
                          Manual Entry Available
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-700 font-black text-sm">
                      {staff.hours}
                    </td>
                    <td className="px-8 py-5 text-slate-800 font-black text-sm">
                      <span className="inline-flex items-center gap-1">
                        <span className="text-slate-400 font-medium">■</span> {staff.salary}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleEdit(staff)}
                        className="px-4 py-1.5 bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest border border-slate-100"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-50">
             <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-blue-500" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Biometric attendance optional — manual entry available for all roles.
                </p>
             </div>
          </div>
        </div>

        {/* 🔷 Add / Edit Staff Form */}
        <div id="staff-form" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden scroll-mt-24">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
              {editingStaff ? 'Edit Staff Profile' : 'Add / Edit Staff Form'}
            </h3>
            <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-lg flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-500" />
              <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider leading-tight">
                Overtime auto-calc based on<br/>admin-set hourly rate.
              </p>
            </div>
          </div>

          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Name *</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                  defaultValue={editingStaff?.name}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address *</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                  defaultValue={editingStaff?.email}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Role *</label>
                <select 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold appearance-none"
                  defaultValue={editingStaff?.role || "Select Role"}
                >
                  <option>Select Role</option>
                  <option>Reception</option>
                  <option>Nursing</option>
                  <option>Medical</option>
                  <option>Pharmacy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Monthly Salary (■) *</label>
                <input 
                  type="number" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                  defaultValue={editingStaff?.salary?.replace(',', '')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Overtime Rate / hr (■) *</label>
                <input 
                  type="number" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
                  defaultValue="200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Status *</label>
                <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active / Inactive</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button className="px-20 py-4 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em]">
                SAVE STAFF
              </button>
            </div>
          </div>
        </div>

        {/* 🔷 Attendance Log Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <ClipboardList className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Attendance Log (This Month)</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Clock In</th>
                    <th className="px-8 py-5">Clock Out</th>
                    <th className="px-8 py-5">Total Hours</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {attendanceLog.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-slate-700">{log.date}</td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500">{log.clockIn}</td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500">{log.clockOut}</td>
                      <td className="px-8 py-5 text-sm font-black text-slate-800">{log.total}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          log.status === 'Present' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StaffManagementView;
