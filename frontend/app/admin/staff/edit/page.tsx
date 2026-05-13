'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/views/layouts/AdminLayout';
import StaffForm from '@/components/staff/staff-form';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function EditStaffPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStaff();
    }
  }, [id]);

  const fetchStaff = async () => {
    try {
      const response = await api.get(`/staff/${id}`);
      setStaff(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Edit Staff Profile</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Update payroll and role administration</p>
          </div>
          <Link 
            href="/admin/staff"
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all border border-slate-200 uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-slate-300 animate-spin mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Loading Profile Data...</p>
          </div>
        ) : staff ? (
          <StaffForm mode="edit" initialData={staff} />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-20 flex flex-col items-center justify-center">
            <p className="text-xs font-black text-red-400 uppercase tracking-[0.2em]">Staff member not found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
