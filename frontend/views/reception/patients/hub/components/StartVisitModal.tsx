import React from 'react';
import { Stethoscope, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const visitSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  visitType: z.string().min(1, 'Visit type is required'),
  priority: z.string().min(1, 'Required'),
  complaint: z.string().min(1, 'Complaint is required'),
});

type VisitFormValues = z.infer<typeof visitSchema>;

interface StartVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VisitFormValues) => void;
  isSubmitting: boolean;
  doctors: any[];
}

const StartVisitModal: React.FC<StartVisitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  doctors
}) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      doctorId: '',
      visitType: 'CONSULTATION',
      priority: 'NORMAL',
      complaint: '',
    }
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: VisitFormValues) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-teal-600">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl text-white">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Initialize Clinical Visit</h2>
              <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mt-1">Assign Doctor & Record Complaint</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-10 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Doctor</label>
                <select 
                  {...register('doctorId')}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600 appearance-none"
                >
                  <option value="">Choose a Doctor</option>
                  {doctors.map((doc: any) => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
                {errors.doctorId && (
                  <p className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.doctorId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visit Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['CONSULTATION', 'FOLLOW_UP'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setValue('visitType', type)}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                        watch('visitType') === type
                          ? 'bg-teal-50 border-teal-600 text-teal-600 shadow-sm'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chief Complaint</label>
                <span className="text-[10px] font-bold text-slate-300">Detailed symptoms or reason for visit</span>
              </div>
              <textarea 
                {...register('complaint')}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-teal-600 h-32 resize-none"
                placeholder="e.g. Severe headache for 2 days, persistent fever..."
              />
              {errors.complaint && (
                <p className="text-rose-500 text-[10px] font-bold uppercase mt-1">{errors.complaint.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority Level</label>
              <div className="flex gap-4">
                {['NORMAL', 'URGENT', 'EMERGENCY'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setValue('priority', lvl)}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      watch('priority') === lvl
                        ? lvl === 'EMERGENCY' ? 'bg-rose-50 border-rose-600 text-rose-600' : 
                          lvl === 'URGENT' ? 'bg-amber-50 border-amber-600 text-amber-600' :
                          'bg-teal-50 border-teal-600 text-teal-600'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10 bg-slate-50 flex gap-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-teal-500/20">
              {isSubmitting ? 'Initializing...' : 'Confirm & Open Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartVisitModal;
