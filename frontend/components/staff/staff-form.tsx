'use client';

import React, { useEffect } from 'react';
import { Save, Info, Clock, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface StaffFormProps {
  initialData?: any;
  mode?: 'add' | 'edit';
}

const StaffForm: React.FC<StaffFormProps> = ({ initialData, mode = 'add' }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const getProfile = (data: any) => {
    return data?.receptionProfile || data?.nurseProfile || data?.medicalProfile || {};
  };

  const profile = getProfile(initialData);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      role: initialData?.role || '',
      salary: profile?.salary || 0,
      overtimeRate: profile?.overtimeRate || 200,
      isActive: initialData?.isActive ?? true
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (mode === 'add') {
        if (!data.password) {
          toast.error('Password is required for new staff');
          setIsSubmitting(false);
          return;
        }
        await api.post('/staff', data);
        toast.success('Staff member added successfully');
      } else {
        const { password, ...updateData } = data;
        const payload = password ? data : updateData;
        await api.put(`/staff/${initialData.id}`, payload);
        toast.success('Staff profile updated successfully');
      }
      router.push('/admin/staff');
    } catch (error: any) {
      console.error('Staff save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save staff');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden scroll-mt-24">
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
          {mode === 'edit' ? 'Edit Staff Profile' : 'Add New Staff Form'}
        </h3>
        <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-lg flex items-center gap-3">
          <Clock className="w-4 h-4 text-amber-500" />
          <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider leading-tight">
            Overtime auto-calc based on<br/>admin-set hourly rate.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Name *</label>
            <input 
              {...register('name', { required: true })}
              type="text" 
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address *</label>
            <input 
              {...register('email', { required: true })}
              type="email" 
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Role *</label>
            <select 
              {...register('role', { required: true })}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold appearance-none"
            >
              <option value="">Select Role</option>
              <option value="RECEPTION">Reception</option>
              <option value="NURSING">Nursing</option>
              <option value="MEDICAL">Medical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              {mode === 'add' ? 'Password *' : 'Change Password (optional)'}
            </label>
            <input 
              {...register('password')}
              type="password" 
              placeholder={mode === 'edit' ? 'Leave blank to keep' : 'Min 6 chars'}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Monthly Salary (■) *</label>
            <input 
              {...register('salary', { valueAsNumber: true })}
              type="number" 
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Overtime Rate / hr (■) *</label>
            <input 
              {...register('overtimeRate', { valueAsNumber: true })}
              type="number" 
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Status *</label>
            <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="relative inline-flex items-center cursor-pointer">
                <input {...register('isActive')} type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active / Inactive</span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-20 py-4 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] flex items-center gap-3 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {mode === 'edit' ? 'UPDATE STAFF' : 'SAVE STAFF'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;
