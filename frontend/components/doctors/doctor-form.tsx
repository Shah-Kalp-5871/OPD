'use client';

import React, { useEffect } from 'react';
import { Save, Info, Clock, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ShiftBuilder from './shift-builder';

interface DoctorFormProps {
  initialData?: any;
  mode?: 'add' | 'edit';
}

const DoctorForm: React.FC<DoctorFormProps> = ({ initialData, mode = 'add' }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      consultationFee: initialData?.doctorProfile?.consultationFee || 0,
      specialization: initialData?.doctorProfile?.specialization || 'General',
      licenseNumber: initialData?.doctorProfile?.licenseNumber || '',
      isActive: initialData?.isActive ?? true,
      shifts: initialData?.doctorProfile?.shifts || []
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (mode === 'add') {
        if (!data.password) {
          toast.error('Password is required for new doctors');
          setIsSubmitting(false);
          return;
        }
        await api.post('/doctors', data);
        toast.success('Doctor created successfully');
      } else {
        const { password, ...updateData } = data;
        const payload = password ? data : updateData;
        await api.put(`/doctors/${initialData.id}`, payload);
        toast.success('Doctor updated successfully');
      }
      router.push('/admin/doctors');
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to save doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-4 scroll-mt-24">
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
          {mode === 'edit' ? 'Edit Doctor Form' : 'Add New Doctor Form'}
        </h3>
        <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-lg flex items-center gap-3">
          <Info className="w-4 h-4 text-amber-500" />
          <p className="text-[10px] text-amber-700 font-bold uppercase leading-tight tracking-wider">
            Disable = doctor hidden from booking.<br/>History retained.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-10">
        {/* Row 1: Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Doctor Full Name *</label>
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
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              {mode === 'add' ? 'Password *' : 'Change Password (optional)'}
            </label>
            <input 
              {...register('password')}
              type="password" 
              placeholder={mode === 'edit' ? 'Leave blank to keep same' : 'Minimum 6 chars'}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
            />
          </div>
        </div>

        {/* New Row: Professional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Specialization *</label>
            <input 
              {...register('specialization', { required: true })}
              type="text" 
              placeholder="e.g. Cardiologist, General Physician"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">License Number *</label>
            <input 
              {...register('licenseNumber', { required: true })}
              type="text" 
              placeholder="Medical License ID"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
            />
          </div>
        </div>

        {/* Row 2: Availability & Slots via Shift Builder */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <ShiftBuilder 
            shifts={watch('shifts')} 
            onChange={(s) => setValue('shifts', s, { shouldDirty: true })} 
          />
        </div>

        {/* Row 3: Configurations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Default Consult Fee (■) *</label>
            <input 
              {...register('consultationFee', { valueAsNumber: true })}
              type="number" 
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</label>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input {...register('isActive')} type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active / Disabled</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 flex justify-center">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-16 py-4 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] flex items-center gap-3 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {mode === 'edit' ? 'UPDATE DOCTOR' : 'SAVE DOCTOR'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
