import React from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import StaffForm from '@/components/staff/staff-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AddStaffPage() {
  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Add New Staff</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Register a new workforce member</p>
          </div>
          <Link 
            href="/admin/staff"
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all border border-slate-200 uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Link>
        </div>

        <StaffForm mode="add" />
      </div>
    </AdminLayout>
  );
}
