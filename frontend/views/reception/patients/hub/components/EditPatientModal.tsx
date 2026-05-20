import React from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Patient } from '../types';

const basicInfoSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  mobile: z.string().min(10, 'Invalid mobile'),
  gender: z.string(),
});

const profileSchema = z.object({
  dob: z.string().optional(),
  age: z.coerce.number().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  occupation: z.string().optional(),
  maritalStatus: z.string().optional(),
  allergies: z.string().optional(),
  emergencyContact: z.string().optional(),
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditPatientModalProps {
  isOpen: boolean;
  mode: 'basic' | 'profile';
  onClose: () => void;
  onSaveBasic?: (data: BasicInfoFormValues) => void;
  onSaveProfile?: (data: ProfileFormValues) => void;
  isSubmitting: boolean;
  initialData: Patient;
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSaveBasic,
  onSaveProfile,
  isSubmitting,
  initialData
}) => {
  const basicForm = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      mobile: initialData.mobile,
      gender: initialData.gender,
    }
  });

  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      dob: initialData.profile?.dob?.split('T')[0],
      age: initialData.profile?.age,
      bloodGroup: initialData.profile?.bloodGroup,
      address: initialData.profile?.address,
      city: initialData.profile?.city,
      state: initialData.profile?.state,
      occupation: initialData.profile?.occupation,
      maritalStatus: initialData.profile?.maritalStatus,
      allergies: initialData.profile?.allergies,
      emergencyContact: initialData.profile?.emergencyContact,
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className={`bg-white rounded-[3rem] w-full ${mode === 'basic' ? 'max-w-xl' : 'max-w-3xl'} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar`}>
        <div className="p-10 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            {mode === 'basic' ? 'Edit Basic Information' : 'Complete Extended Profile'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <Plus className="w-8 h-8 text-slate-400 rotate-45" />
          </button>
        </div>

        {mode === 'basic' ? (
          <form onSubmit={basicForm.handleSubmit(onSaveBasic!)}>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</label>
                  <input {...basicForm.register('firstName')} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                  <input {...basicForm.register('lastName')} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
                <input {...basicForm.register('mobile')} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                <select {...basicForm.register('gender')} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600">
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>
            <div className="p-10 bg-slate-50 flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={profileForm.handleSubmit(onSaveProfile!)}>
            <div className="p-10 grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                <input 
                  type="date" 
                  {...profileForm.register('dob')} 
                  onChange={(e) => {
                    profileForm.setValue('dob', e.target.value);
                    if (e.target.value) {
                      const birthDate = new Date(e.target.value);
                      const today = new Date();
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const m = today.getMonth() - birthDate.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                      }
                      profileForm.setValue('age', age);
                    }
                  }}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age (Auto)</label>
                <input 
                  type="number" 
                  {...profileForm.register('age')} 
                  readOnly 
                  className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold outline-none text-slate-500 cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Group</label>
                <select {...profileForm.register('bloodGroup')} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600">
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marital Status</label>
                <select {...profileForm.register('maritalStatus')} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600">
                  <option value="">Select</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential Address</label>
                <textarea {...profileForm.register('address')} rows={3} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600" placeholder="Full home address..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</label>
                <input {...profileForm.register('city')} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State</label>
                <input {...profileForm.register('state')} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600" placeholder="e.g. Gujarat" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupation</label>
                <input {...profileForm.register('occupation')} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600" placeholder="e.g. Engineer, Student" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact</label>
                <input {...profileForm.register('emergencyContact')} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600" placeholder="Name / Phone" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Known Allergies</label>
                <input {...profileForm.register('allergies')} className="w-full px-5 py-4 bg-rose-50 border border-rose-100 rounded-2xl font-bold outline-none focus:border-rose-400" placeholder="e.g. Penicillin, Peanuts" />
              </div>
            </div>
            <div className="p-10 bg-slate-50 flex gap-4 sticky bottom-0 border-t border-slate-100">
              <button type="button" onClick={onClose} className="flex-1 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
                {isSubmitting ? 'Saving Profile...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPatientModal;
