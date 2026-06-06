'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  UserPlus, 
  Save, 
  Printer, 
  CalendarCheck, 
  Lock, 
  Info, 
  User, 
  Phone, 
  MapPin, 
  Globe, 
  Fingerprint,
  AlertCircle,
  Hash,
  ChevronRight,
  Barcode
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { toast } from 'sonner';

const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  mobile: z.string().min(10, 'Mobile number must be 10 digits').max(10, 'Mobile number must be 10 digits'),
  gender: z.string().min(1, 'Gender is required'),
  dob: z.string().optional(),
  age: z.any().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

const PatientRegistrationView = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mrdPreview, setMrdPreview] = useState('MRD-2026-XXXX');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: 'M',
    },
  });

  const selectedGender = watch('gender');
  const firstName = watch('firstName') || '';
  const middleName = watch('middleName') || '';
  const lastName = watch('lastName') || '';
  const dob = watch('dob');
  const ageVal = watch('age');

  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 0) {
        setValue('age', calculatedAge, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [dob, setValue]);

  useEffect(() => {
    fetchNextMrd();
  }, []);

  const fetchNextMrd = async () => {
    try {
      const response = await api.get('/patients/next-mrd');
      setMrdPreview(response.data.mrd);
    } catch (error) {
      console.error('Failed to fetch next MRD:', error);
    }
  };

  const handlePrintSticker = () => {
    const printContent = document.getElementById('patient-sticker-card');
    if (!printContent) return;

    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = `PrintWindow_${uniqueName}`;
    
    const printWindow = window.open(windowUrl, windowName, 'left=50,top=50,width=400,height=400');
    if (!printWindow) {
      toast.error('Popup blocker enabled. Please allow popups to print.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Patient Sticker</title>
          <style>
            @page {
              size: 80mm 50mm; /* Standard thermal sticker size */
              margin: 0;
            }
            body {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              padding: 10px;
              margin: 0;
              background: #fff;
              color: #000;
              width: 80mm;
              height: 50mm;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .title {
              font-size: 8px;
              text-transform: uppercase;
              color: #666;
              margin-bottom: 2px;
            }
            .value {
              font-size: 11px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 8px;
            }
            .barcode-container {
              border-top: 1px dashed #ccc;
              padding-top: 6px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .barcode {
              display: flex;
              gap: 1px;
              height: 30px;
              align-items: flex-end;
              margin-bottom: 2px;
            }
            .barcode-line {
              background: #000;
              height: 100%;
            }
            .barcode-text {
              font-size: 8px;
              letter-spacing: 2px;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div>
            <div class="title">Patient Full Name</div>
            <div class="value">${firstName || '---'} ${middleName} ${lastName || '---'}</div>
            
            <div class="grid">
              <div>
                <div class="title">MRD Number</div>
                <div class="value" style="color: #0d9488;">${mrdPreview}</div>
              </div>
              <div>
                <div class="title">Gender | Age</div>
                <div class="value">${selectedGender} | ${ageVal ? ageVal + ' Yrs' : '-- Yrs'}</div>
              </div>
            </div>
          </div>
          
          <div class="barcode-container">
            <div class="barcode">
              ${[2, 4, 1, 3, 2, 5, 2, 4, 1, 6, 2, 4, 2, 3, 1, 5, 2, 4].map(w => `<div class="barcode-line" style="width: ${w}px;"></div>`).join('')}
            </div>
            <div class="barcode-text">${mrdPreview}</div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        age: data.age ? Number(data.age) : undefined,
      };
      const response = await api.post('/patients', payload);
      toast.success('Patient registered successfully');
      router.push(`/reception/patients/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReceptionLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto space-y-10 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">New Patient Registration</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-teal-500" />
              Fields marked with * are mandatory for registration
            </p>
          </div>
          
          {/* MRD Display Box */}
          <div className="bg-teal-50 px-6 py-4 rounded-2xl border border-teal-100 flex flex-col items-end">
             <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none mb-1">MRD No. (Auto-generated)</span>
             <h3 className="text-xl font-black text-slate-800 tracking-widest">{mrdPreview}</h3>
          </div>
        </div>

        <div className="space-y-10">
          {/* 🔷 SECTION 1: BASIC REGISTRATION DETAILS */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                   <User className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">Basic Registration Details</h3>
             </div>
             
             <div className="p-8 space-y-8">
                {/* Name Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">First Name *</label>
                      <input 
                        {...register('firstName')}
                        type="text" 
                        className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.firstName ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all`} 
                        placeholder="Enter First Name" 
                      />
                      {errors.firstName && <p className="text-[10px] font-black text-rose-500 uppercase">{errors.firstName.message}</p>}
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Middle Name</label>
                      <input 
                        {...register('middleName')}
                        type="text" 
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all" 
                        placeholder="Enter Middle Name" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Last Name *</label>
                      <input 
                        {...register('lastName')}
                        type="text" 
                        className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.lastName ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all`} 
                        placeholder="Enter Last Name" 
                      />
                      {errors.lastName && <p className="text-[10px] font-black text-rose-500 uppercase">{errors.lastName.message}</p>}
                   </div>
                </div>

                 {/* Contact & Gender Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                       <input 
                         {...register('dob')}
                         type="date" 
                         max="9999-12-31"
                         className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Age (Years)</label>
                       <input 
                         {...register('age')}
                         type="number" 
                         min="0"
                         className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-teal-600 focus:bg-white transition-all" 
                         placeholder="e.g. 30"
                       />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact Number *</label>
                      <div className="relative">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                         <input 
                           {...register('mobile')}
                           type="text" 
                           maxLength={10}
                           className={`w-full pl-12 pr-5 py-3.5 bg-slate-50 border ${errors.mobile ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm font-bold outline-none focus:border-teal-600 transition-all`} 
                           placeholder="10-digit Mobile" 
                         />
                      </div>
                      {errors.mobile && <p className="text-[10px] font-black text-rose-500 uppercase">{errors.mobile.message}</p>}
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Gender *</label>
                      <div className="flex gap-2">
                         {['M', 'F', 'Other'].map(opt => (
                           <button 
                             key={opt} 
                             type="button"
                             onClick={() => setValue('gender', opt)}
                             className={`flex-1 py-3.5 border rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedGender === opt ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-100' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-teal-300'}`}
                           >
                              {opt}
                           </button>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Language (Optional)</label>
                      <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer">
                         <option>English</option>
                         <option>Gujarati</option>
                         <option>Hindi</option>
                      </select>
                   </div>
                </div>
             </div>
          </div>

          {/* 🔷 BOTTOM SECTION: ACTIONS & STICKER PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Action Buttons Column */}
             <div className="space-y-6">
                <div className="flex flex-col gap-4">
                   <button 
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full flex items-center justify-center gap-3 py-5 bg-teal-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 disabled:opacity-50"
                   >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CalendarCheck className="w-4 h-4" />
                          COMPLETE REGISTRATION & OPEN FILE
                        </>
                      )}
                   </button>
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                      >
                         CANCEL
                      </button>
                      <button 
                        type="button"
                        onClick={handlePrintSticker}
                        className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-teal-300 transition-all shadow-sm"
                      >
                         <Printer className="w-4 h-4" />
                         PRINT STICKER
                      </button>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                      <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                         <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">Extended Profile</h4>
                         <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
                            Full patient history, allergies, and clinical details can be completed from the patient's file after registration.
                         </p>
                      </div>
                   </div>

                   <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                         <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Clinic Policy</h4>
                         <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
                            Registration is the first gate. MRD is permanent. 
                            Ensure contact number is verified to avoid duplicate records.
                         </p>
                      </div>
                   </div>
                </div>
             </div>

             {/* 🔷 PATIENT STICKER PREVIEW CARD */}
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Sticker Preview</h4>
                   <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[8px] font-black uppercase tracking-widest">Live Preview</div>
                </div>

                <div id="patient-sticker-card" className="bg-slate-50 rounded-2xl p-6 border border-slate-100 font-mono relative overflow-hidden group max-w-sm mx-auto">
                   <div className="space-y-4 relative z-10">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Patient Full Name</p>
                         <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">
                            {firstName || '---'} {middleName} {lastName || '---'}
                         </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">MRD Number</p>
                            <p className="text-sm font-black text-teal-700 tracking-widest">{mrdPreview}</p>
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Gender | Age</p>
                            <p className="text-xs font-black text-slate-800">{selectedGender} | {ageVal ? `${ageVal} Yrs` : '-- Yrs'}</p>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 border-dashed flex flex-col items-center gap-2">
                         <div className="w-full h-12 flex items-center justify-center opacity-70">
                            <div className="flex gap-[1px] h-full items-end">
                               {[2, 4, 1, 3, 2, 5, 2, 4, 1, 6, 2, 4, 2, 3, 1, 5, 2, 4].map((w, i) => (
                                 <div key={i} className="bg-slate-900" style={{ width: `${w}px`, height: '100%' }}></div>
                               ))}
                            </div>
                         </div>
                         <span className="text-[8px] font-black text-slate-400 tracking-[0.5em]">{mrdPreview}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </form>
    </ReceptionLayout>
  );
};

export default PatientRegistrationView;
