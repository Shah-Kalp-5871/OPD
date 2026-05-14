import React from 'react';
import { Activity, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const vitalsSchema = z.object({
  temp: z.string().min(1, 'Required'),
  pulse: z.string().min(1, 'Required'),
  bpSys: z.string().min(1, 'Required'),
  bpDia: z.string().min(1, 'Required'),
  spo2: z.string().min(1, 'Required'),
  weight: z.string().optional(),
  height: z.string().optional(),
});

type VitalsFormValues = z.infer<typeof vitalsSchema>;

interface AddVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VitalsFormValues) => void;
  isSubmitting: boolean;
}

const AddVitalsModal: React.FC<AddVitalsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting 
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VitalsFormValues>({
    resolver: zodResolver(vitalsSchema),
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: VitalsFormValues) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Record Vitals</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Patient Assessment Phase</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
            <Plus className="w-8 h-8 text-slate-400 rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-10 grid grid-cols-2 gap-8">
            {[
              { id: 'temp', label: 'Temperature (°F)', placeholder: '98.6' },
              { id: 'pulse', label: 'Pulse Rate (BPM)', placeholder: '72' },
              { id: 'bpSys', label: 'BP Systolic (mmHg)', placeholder: '120' },
              { id: 'bpDia', label: 'BP Diastolic (mmHg)', placeholder: '80' },
              { id: 'spo2', label: 'SPO2 Oxygen (%)', placeholder: '98' },
              { id: 'weight', label: 'Body Weight (Kg)', placeholder: '70' },
              { id: 'height', label: 'Height (cm)', placeholder: '170' }
            ].map((field) => (
              <div key={field.id} className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                <input 
                  {...register(field.id as any)}
                  type="text" 
                  className={`w-full px-6 py-4 bg-slate-50 border ${errors[field.id as keyof VitalsFormValues] ? 'border-rose-500' : 'border-slate-200'} rounded-2xl text-base font-bold outline-none focus:border-teal-600 focus:bg-white transition-all`} 
                  placeholder={field.placeholder} 
                />
              </div>
            ))}
          </div>
          <div className="p-10 bg-slate-50 flex gap-6">
            <button type="button" onClick={onClose} className="flex-1 py-5 bg-white text-slate-600 border border-slate-200 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 py-5 bg-teal-600 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-teal-500/30 hover:bg-teal-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Complete Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVitalsModal;
