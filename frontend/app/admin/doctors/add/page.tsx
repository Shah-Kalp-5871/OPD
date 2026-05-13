import React from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import DoctorForm from '@/components/doctors/doctor-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AddDoctorPage() {
  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Add New Doctor</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Create a new professional profile</p>
          </div>
          <Link 
            href="/admin/doctors"
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all border border-slate-200 uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Link>
        </div>

        <DoctorForm mode="add" />
      </div>
    </AdminLayout>
  );
}
