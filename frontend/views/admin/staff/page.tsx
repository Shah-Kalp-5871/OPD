'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import Link from 'next/link';
import { 
  UserPlus, 
  Mail, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Search,
  Filter,
  MoreVertical,
  Briefcase,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const StaffManagementView = () => {
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/staff');
      setStaffMembers(response.data);
    } catch (error) {
      console.error('Staff fetch error:', error);
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const getProfile = (staff: any) => {
    return staff.receptionProfile || staff.nurseProfile || staff.medicalProfile || {};
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight text-[28px]">Staff Administration</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Workforce, Payroll & Role Management</p>
          </div>
          <Link 
            href="/admin/staff/add"
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-widest"
          >
            <UserPlus className="w-4 h-4" />
            Add Staff Member
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Staff', value: staffMembers.length.toString(), icon: UserPlus, color: 'blue' },
            { label: 'Active Now', value: staffMembers.filter(s => s.isActive).length.toString(), icon: ShieldCheck, color: 'emerald' },
            { label: 'Avg Salary', value: '20k', icon: DollarSign, color: 'amber' },
            { label: 'On Leave', value: '02', icon: Clock, color: 'rose' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</span>
              </div>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME, EMAIL OR ROLE..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex-1 md:flex-none px-5 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">
              Export CSV
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
              <Loader2 className="w-10 h-10 text-slate-300 animate-spin mb-4" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Workforce Data...</p>
            </div>
          ) : staffMembers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <Briefcase className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No staff records found</p>
              <p className="text-[10px] text-slate-300 mt-2 font-medium">Add your first employee to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-8 py-5">Employee</th>
                    <th className="px-8 py-5">Department/Role</th>
                    <th className="px-8 py-5">Salary (■)</th>
                    <th className="px-8 py-5">Joined Date</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {staffMembers.map((staff) => {
                    const profile = getProfile(staff);
                    return (
                      <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800">{staff.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 lowercase">{staff.email}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200/50`}>
                            <Briefcase className="w-3 h-3" />
                            {staff.role}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-black text-slate-700">{profile.salary || 0}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-bold text-slate-500">{new Date(staff.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            staff.isActive 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}>
                            {staff.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Link 
                            href={`/admin/staff/edit?id=${staff.id}`}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-all inline-block text-slate-400 hover:text-slate-900"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default StaffManagementView;
