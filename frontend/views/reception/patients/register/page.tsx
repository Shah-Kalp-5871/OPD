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
  Briefcase,
  CheckCircle,
  Loader2,
  AlertCircle
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
  ageMonths: z.any().optional(),
  ageDays: z.any().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

const PatientRegistrationView = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'PATIENT' | 'MR'>('PATIENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mrdPreview, setMrdPreview] = useState('MRD-2026-XXXX');

  // MR State
  const [mrFirstName, setMrFirstName] = useState('');
  const [mrLastName, setMrLastName] = useState('');
  const [mrMobile, setMrMobile] = useState('');
  const [mrCompanyName, setMrCompanyName] = useState('');
  const [mrDoctorId, setMrDoctorId] = useState('');
  const [mrSelectedSlot, setMrSelectedSlot] = useState<string>('');
  const [isMrSlotsLoading, setIsMrSlotsLoading] = useState(false);
  const [mrAvailableSlots, setMrAvailableSlots] = useState<any[]>([]);
  const [isMrSubmitting, setIsMrSubmitting] = useState(false);
  const [mrError, setMrError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors');
      setDoctors(res.data);
    } catch { toast.error('Failed to load doctors'); }
  };

  useEffect(() => {
    if (mrDoctorId) fetchMrSlots(mrDoctorId);
    else { setMrAvailableSlots([]); setMrSelectedSlot(''); }
  }, [mrDoctorId]);

  const fetchMrSlots = async (docId: string) => {
    setIsMrSlotsLoading(true);
    try {
      const today = new Date();
      const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const res = await api.get(`/appointments/slots`, { params: { doctorId: docId, date: dateString } });
      setMrAvailableSlots(res.data);
      setMrSelectedSlot('');
    } catch (error) {
      console.error('Failed to load slots', error);
    } finally {
      setIsMrSlotsLoading(false);
    }
  };

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: { gender: 'M' },
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
      let yrs = today.getFullYear() - birthDate.getFullYear();
      let mos = today.getMonth() - birthDate.getMonth();
      let dys = today.getDate() - birthDate.getDate();
      if (dys < 0) { mos--; dys += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
      if (mos < 0) { yrs--; mos += 12; }
      if (yrs >= 0) {
        setValue('age', yrs, { shouldValidate: true, shouldDirty: true });
        setValue('ageMonths', mos, { shouldValidate: true, shouldDirty: true });
        setValue('ageDays', dys, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [dob, setValue]);

  useEffect(() => { fetchNextMrd(); }, []);

  const fetchNextMrd = async () => {
    try {
      const response = await api.get('/patients/next-mrd');
      setMrdPreview(response.data.mrd);
    } catch { console.error('Failed to fetch next MRD'); }
  };

  const handlePrintSticker = () => {
    const printWindow = window.open('about:blank', `pw_${Date.now()}`, 'left=50,top=50,width=400,height=400');
    if (!printWindow) { toast.error('Allow popups to print.'); return; }
    printWindow.document.write(`<html><head><title>Sticker</title><style>@page{size:80mm 50mm;margin:0}body{font-family:monospace;padding:10px;margin:0;width:80mm;height:50mm;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between}.t{font-size:8px;text-transform:uppercase;color:#666;margin-bottom:2px}.v{font-size:11px;font-weight:bold;margin-bottom:8px}.g{display:grid;grid-template-columns:1fr 1fr;gap:8px}.bc{border-top:1px dashed #ccc;padding-top:6px;display:flex;flex-direction:column;align-items:center}.bl{display:flex;gap:1px;height:30px;align-items:flex-end;margin-bottom:2px}.bline{background:#000;height:100%}.bt{font-size:8px;letter-spacing:2px;color:#333}</style></head><body><div><div class="t">Patient Full Name</div><div class="v">${firstName || '---'} ${middleName} ${lastName || '---'}</div><div class="g"><div><div class="t">MRD Number</div><div class="v" style="color:#0d9488">${mrdPreview}</div></div><div><div class="t">Gender | Age</div><div class="v">${selectedGender} | ${ageVal ? ageVal + ' Yrs' : '-- Yrs'}</div></div></div></div><div class="bc"><div class="bl">${[2,4,1,3,2,5,2,4,1,6,2,4,2,3,1,5,2,4].map(w=>`<div class="bline" style="width:${w}px"></div>`).join('')}</div><div class="bt">${mrdPreview}</div></div><script>window.onload=function(){window.print();setTimeout(function(){window.close()},500)}</script></body></html>`);
    printWindow.document.close();
  };

  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        age: data.age ? Number(data.age) : undefined,
        ageMonths: data.ageMonths ? Number(data.ageMonths) : undefined,
        ageDays: data.ageDays ? Number(data.ageDays) : undefined,
      };
      const response = await api.post('/patients', payload);
      toast.success('Patient registered successfully');
      router.push(`/reception/appointments?patientId=${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:bg-white transition-all";
  const labelCls = "block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <ReceptionLayout>
      <div className="w-full h-full flex flex-col font-sans p-4 md:p-6 bg-slate-50 gap-6">

        {/* ── HEADER WITH TABS ── */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm shrink-0">
          <div>
            <h1 className="text-xl font-black text-slate-800 leading-none">Registration</h1>
            <p className="text-[11px] font-bold text-slate-400 mt-1">Register new patients or medical representatives</p>
          </div>

          {/* Tabs + MRD badge — always same width, MRD just toggles opacity */}
          <div className="flex items-center gap-4">
            {/* MRD badge — always present, hidden when MR tab active */}
            <div className={`bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 text-right transition-opacity ${activeTab === 'PATIENT' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="block text-[9px] font-black text-orange-500 uppercase tracking-widest leading-none">MRD (Auto)</span>
              <span className="block text-base font-black text-slate-800 tracking-wider mt-0.5">{mrdPreview}</span>
            </div>

            {/* Tab Toggle */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('PATIENT')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'PATIENT' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('MR')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'MR' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Briefcase className="w-4 h-4" />
                MR
              </button>
            </div>
          </div>
        </div>

        {/* ── PATIENT REGISTER FORM ── */}
        {activeTab === 'PATIENT' && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* LEFT: Form fields (2 cols on xl) */}
              <div className="xl:col-span-2 space-y-6">

                {/* Name + Contact Row */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Patient Identity
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className={labelCls}>First Name *</label>
                      <input {...register('firstName')} type="text" className={`${inputCls} ${errors.firstName ? 'border-rose-400' : ''}`} placeholder="First" />
                      {errors.firstName && <p className="text-[10px] text-rose-500 mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Middle Name</label>
                      <input {...register('middleName')} type="text" className={inputCls} placeholder="Middle" />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name *</label>
                      <input {...register('lastName')} type="text" className={`${inputCls} ${errors.lastName ? 'border-rose-400' : ''}`} placeholder="Last" />
                      {errors.lastName && <p className="text-[10px] text-rose-500 mt-1">{errors.lastName.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Mobile *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input {...register('mobile')} type="text" maxLength={10} className={`${inputCls} pl-9 ${errors.mobile ? 'border-rose-400' : ''}`} placeholder="10 digits" />
                      </div>
                      {errors.mobile && <p className="text-[10px] text-rose-500 mt-1">{errors.mobile.message}</p>}
                    </div>
                  </div>
                </div>

                {/* DOB + Age + Gender + Language */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Demographics</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className={labelCls}>Date of Birth</label>
                      <input {...register('dob')} type="date" max="9999-12-31" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Age (Y / M / D)</label>
                      <div className="flex gap-1.5">
                        <input {...register('age')} type="number" min="0" className="w-1/3 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center outline-none focus:border-orange-500" placeholder="Yr" />
                        <input {...register('ageMonths')} type="number" min="0" max="11" className="w-1/3 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center outline-none focus:border-orange-500" placeholder="Mo" />
                        <input {...register('ageDays')} type="number" min="0" max="31" className="w-1/3 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center outline-none focus:border-orange-500" placeholder="D" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Gender *</label>
                      <div className="flex gap-1.5 h-[42px]">
                        {['M', 'F', 'Other'].map(opt => (
                          <button key={opt} type="button" onClick={() => setValue('gender', opt)}
                            className={`flex-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${selectedGender === opt ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-100' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-orange-300'}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Language</label>
                      <select className={inputCls}>
                        <option>English</option>
                        <option>Gujarati</option>
                        <option>Hindi</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Info notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4 flex gap-3">
                    <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">Extended history and allergies can be completed from patient's file after registration.</p>
                  </div>
                  <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed font-medium">MRD is permanent. Verify contact number before saving to avoid duplicate records.</p>
                  </div>
                </div>
              </div>

              {/* RIGHT: Sticker preview + actions */}
              <div className="space-y-6">
                {/* Sticker Preview */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sticker Preview</p>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">Live</span>
                  </div>
                  <div id="patient-sticker-card" className="bg-slate-50 rounded-xl p-4 border border-slate-200 font-mono">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Patient Full Name</p>
                        <p className="text-sm font-black text-slate-800 uppercase">
                          {[firstName, middleName, lastName].filter(Boolean).join(' ') || <span className="text-slate-300 italic">Not provided</span>}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">MRD Number</p>
                          <p className="text-sm font-black text-orange-700 tracking-widest">{mrdPreview}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Gender | Age</p>
                          <p className="text-sm font-black text-slate-800">{selectedGender} | {ageVal ? `${ageVal}Y` : '--Y'}</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-dashed border-slate-200 flex flex-col items-center gap-1.5">
                        <div className="flex gap-[1px] h-10 items-end opacity-70">
                          {[2,4,1,3,2,5,2,4,1,6,2,4,2,3,1,5,2,4].map((w, i) => (
                            <div key={i} className="bg-slate-900" style={{ width: `${w}px`, height: '100%' }} />
                          ))}
                        </div>
                        <span className="text-[8px] font-black text-slate-400 tracking-[0.5em]">{mrdPreview}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button type="submit" disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-md shadow-orange-100 disabled:opacity-50">
                    {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CalendarCheck className="w-4 h-4" />Register &amp; Book Appointment</>}
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => router.back()}
                      className="flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase hover:bg-black transition-all shadow-sm">
                      Cancel
                    </button>
                    <button type="button" onClick={handlePrintSticker}
                      className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase hover:border-orange-300 hover:text-orange-600 transition-all shadow-sm">
                      <Printer className="w-4 h-4" /> Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ── MR REGISTER FORM ── */}
        {activeTab === 'MR' && (
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-4">

              {/* LEFT: Form fields (2 cols on xl) */}
              <div className="xl:col-span-2 space-y-6">
                {mrError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-100">{mrError}</div>
                )}

                {/* MR Details */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> MR Identity
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className={labelCls}>First Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" value={mrFirstName} onChange={e => setMrFirstName(e.target.value)} placeholder="John" className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Last Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" value={mrLastName} onChange={e => setMrLastName(e.target.value)} placeholder="Doe" className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Mobile *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" value={mrMobile} onChange={e => setMrMobile(e.target.value.replace(/\D/g, ''))} placeholder="9876543210" maxLength={10} className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Company</label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" value={mrCompanyName} onChange={e => setMrCompanyName(e.target.value)} placeholder="Pharma Inc." className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor + Slot selection */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Appointment Details</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Doctor Selection */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select Doctor *</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {doctors.map(doc => {
                          const profileId = doc.doctorProfile?.id || doc.id;
                          const name = doc.name || doc.user?.name || '';
                          const spec = doc.doctorProfile?.specialization || doc.specialization || 'General';
                          const isActive = mrDoctorId === profileId;
                          return (
                            <button key={doc.id} type="button" onClick={() => setMrDoctorId(profileId)}
                              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${isActive ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-500/20 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-orange-300 hover:bg-white'}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isActive ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className={`text-xs font-bold truncate ${isActive ? 'text-orange-700' : 'text-slate-700'}`}>Dr. {name}</div>
                                <div className="text-[10px] text-slate-500 truncate">{spec}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Slot Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Slots *</p>
                        <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">{mrAvailableSlots.length} slots</span>
                      </div>
                      {isMrSlotsLoading ? (
                        <div className="text-xs text-slate-400 py-3 flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                          Loading slots...
                        </div>
                      ) : !mrDoctorId ? (
                        <div className="text-xs text-slate-400 py-3 italic bg-slate-50 rounded-xl px-4 border border-slate-100">Select a doctor to see slots</div>
                      ) : mrAvailableSlots.length === 0 ? (
                        <div className="text-xs text-slate-400 py-3 italic text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">No slots today</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {mrAvailableSlots.filter(slot => {
                            const now = new Date();
                            const [h, m] = slot.time.split(':').map(Number);
                            return h > now.getHours() || (h === now.getHours() && m > now.getMinutes());
                          }).map((slot, i) => {
                            const isBooked = slot.status === 'booked';
                            const isSel = mrSelectedSlot === slot.time;
                            return (
                              <button key={i} type="button" disabled={isBooked} onClick={() => setMrSelectedSlot(slot.time)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isBooked ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed line-through' : isSel ? 'bg-orange-600 text-white shadow-md shadow-orange-100' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-orange-400 hover:bg-white hover:text-orange-600'}`}>
                                {slot.time}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Sticker preview + actions */}
              <div className="space-y-6">
                {/* Sticker Preview */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MR Pass Preview</p>
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">Pass</span>
                  </div>
                  <div id="mr-sticker-card" className="bg-slate-50 rounded-xl p-4 border border-slate-200 font-mono">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">MR Name</p>
                        <p className="text-sm font-black text-slate-800 uppercase">
                          {[mrFirstName, mrLastName].filter(Boolean).join(' ') || <span className="text-slate-300 italic">Not provided</span>}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Company</p>
                          <p className="text-xs font-black text-slate-700 truncate">{mrCompanyName || '---'}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Time</p>
                          <p className="text-xs font-black text-orange-700 tracking-widest">{mrSelectedSlot || '--:--'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Visiting Doctor</p>
                        <p className="text-xs font-black text-slate-800">
                          {mrDoctorId ? `Dr. ${doctors.find(d => (d.doctorProfile?.id || d.id) === mrDoctorId)?.name || ''}` : '---'}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-dashed border-slate-200 flex flex-col items-center gap-1.5">
                        <div className="flex gap-[1px] h-10 items-end opacity-70">
                          {[2,4,1,3,2,5,2,4,1,6,2,4,2,3,1,5,2,4].map((w, i) => (
                            <div key={i} className="bg-slate-900" style={{ width: `${w}px`, height: '100%' }} />
                          ))}
                        </div>
                        <span className="text-[8px] font-black text-slate-400 tracking-[0.5em]">VISITOR-PASS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button type="button" disabled={isMrSubmitting}
                    onClick={async () => {
                      if (!mrFirstName || !mrLastName || !mrMobile || !mrDoctorId || !mrSelectedSlot) {
                        setMrError('Please fill in all required fields and select a slot'); return;
                      }
                      if (mrMobile.length !== 10) { setMrError('Mobile must be 10 digits'); return; }
                      setIsMrSubmitting(true); setMrError(null);
                      try {
                        await api.post('/medical-representatives/checkin', {
                          firstName: mrFirstName, lastName: mrLastName, mobile: mrMobile,
                          companyName: mrCompanyName, doctorId: mrDoctorId, appointmentTime: mrSelectedSlot
                        });
                        toast.success('MR checked in successfully!');
                        setMrFirstName(''); setMrLastName(''); setMrMobile('');
                        setMrCompanyName(''); setMrDoctorId(''); setMrSelectedSlot('');
                        setActiveTab('PATIENT');
                      } catch (err: any) {
                        setMrError(err.response?.data?.message || err.message || 'Failed to check in MR');
                      } finally { setIsMrSubmitting(false); }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-md shadow-slate-200 disabled:opacity-50">
                    {isMrSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" />Add MR to Queue</>}
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => router.back()}
                      className="flex items-center justify-center gap-2 py-3.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase hover:bg-slate-200 transition-all shadow-sm">
                      Cancel
                    </button>
                    <button type="button" onClick={() => toast.info('MR Pass Printing coming soon')}
                      className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm">
                      <Printer className="w-4 h-4" /> Print Pass
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </ReceptionLayout>
  );
};

export default PatientRegistrationView;
