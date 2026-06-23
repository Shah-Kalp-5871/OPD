import React, { useState, useEffect } from 'react';
import { Stethoscope, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
  appointmentId?: string;
  onSuccess?: () => void;
}

const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  patient,
  appointmentId,
  onSuccess
}) => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [visitType, setVisitType] = useState('CONSULTATION');
  const [priority, setPriority] = useState('NORMAL');
  const [complaint, setComplaint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [paymentOption, setPaymentOption] = useState<'NOW' | 'LATER'>('NOW');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI'>('CASH');
  const [totalAmount, setTotalAmount] = useState<number>(500);
  const [paymentAmount, setPaymentAmount] = useState<number>(500);


  useEffect(() => {
    if (isOpen && patient) {
      fetchDoctors();
      fetchPatientAppointments();
    }
  }, [isOpen, patient, appointmentId]);


  useEffect(() => {
    if (selectedDoctorId && !selectedAppointment) {
      fetchSlots();
    }
  }, [selectedDoctorId, selectedAppointment]);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors');
      setDoctors(res.data);
      if (res.data.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(res.data[0].doctorProfile?.id || res.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load doctors');
    }
  };

  const fetchPatientAppointments = async () => {
    try {
      const res = await api.get(`/patients/${patient.id}/appointments`);
      const results = res.data?.items || res.data?.data?.items || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      const scheduled = results.filter((a: any) => a.status === 'SCHEDULED');
      
      let targetAppt = null;
      if (appointmentId) {
        targetAppt = scheduled.find((a: any) => a.id === appointmentId);
      } else {
        const today = new Date().toISOString().split('T')[0];
        targetAppt = scheduled.find((a: any) => a.appointmentDate.startsWith(today));
      }

      if (targetAppt) {
        setSelectedAppointment(targetAppt);
        setSelectedDoctorId(targetAppt.doctorId);
        setComplaint(targetAppt.remarks || '');
      }
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  };

  const fetchSlots = async () => {
    setIsSlotsLoading(true);
    try {
      const today = new Date();
      const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const res = await api.get(`/appointments/slots`, {
        params: { doctorId: selectedDoctorId, date: dateString }
      });
      setAvailableSlots(res.data);
      setSelectedSlot(null);
    } catch (error) {
      toast.error('Failed to load available slots');
    } finally {
      setIsSlotsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (isSubmitting) return;
    if (!selectedDoctorId && doctors.length > 0) {
      toast.error('Please select a doctor.');
      return;
    }

    setIsSubmitting(true);
    try {
      const checkInData = {
        appointmentId: selectedAppointment?.id,
        visitType: selectedAppointment?.purpose || visitType,
        priority,
        complaint,
      };

      let res;
      if (selectedAppointment) {
          res = await api.post('/appointments/check-in', checkInData);
      } else {
          if (!selectedSlot) {
            toast.error('Please select an available time slot');
            setIsSubmitting(false);
            return;
          }
          const today = new Date();
          const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

          const apptRes = await api.post('/appointments', {
            patientId: patient.id,
            doctorId: selectedDoctorId,
            appointmentDate: dateString,
            appointmentTime: selectedSlot,
            purpose: checkInData.visitType,
            remarks: complaint
          });

          res = await api.post('/appointments/check-in', {
            ...checkInData,
            appointmentId: apptRes.data.id
          });
      }

      // Create Initial Consultation Bill
      const caseId = res.data?.caseId || res.data?.id;
      if (caseId) {
        const billRes = await api.post('/billing', {
          caseId: caseId,
          patientId: patient.id,
          items: [{
            serviceName: 'Initial Consultation Fee',
            description: 'Standard Consultation',
            unitPrice: totalAmount,
            quantity: 1,
            discount: 0
          }]
        });

        // If Pay Now, record payment
        if (paymentOption === 'NOW' && billRes.data?.id) {
          await api.post(`/billing/${billRes.data.id}/pay`, {
            amount: paymentAmount,
            paymentMethod: paymentMethod,
            notes: 'Paid at check-in'
          });
        }
      }

      toast.success('Patient checked in successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : message || 'Check-in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Check-In Patient</h2>
            <p className="text-xs text-slate-500">Add the patient to the queue.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
             <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
               {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
             </div>
             <div>
               <div className="font-bold text-lg text-slate-800 flex items-center gap-3">
                 {patient.firstName} {patient.lastName}
                 <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                   {patient.profile?.age || 'N/A'}{patient.gender?.charAt(0) || 'U'}
                 </span>
               </div>
               <div className="text-xs text-slate-500 mt-1 flex items-center gap-4">
                 <span>MRD: {patient.mrdNumber}</span>
                 {selectedAppointment && (
                   <span className="flex items-center gap-1 text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-md">
                     Appointment: {new Date(selectedAppointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                 )}
               </div>
             </div>
          </div>

          {!selectedAppointment && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Stethoscope className="w-4 h-4"/> Walk-In Consultation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Doctor *</label>
                  <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">-- Select Doctor --</option>
                    {doctors.map(d => <option key={d.id} value={d.doctorProfile?.id || d.id}>Dr. {d.name || d.user?.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Slot *</label>
                  <select value={selectedSlot || ''} onChange={(e) => setSelectedSlot(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">-- Select Slot --</option>
                    {availableSlots.filter(s => s.status !== 'booked').map(s => <option key={s.time} value={s.time}>{s.time}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
          {/* Billing Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">₹</span>
              Initial Consultation Fee
            </h3>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Standard Consultation</p>
                <p className="text-xs text-slate-500 mt-1">Due at check-in</p>
              </div>
              <div className="text-right flex items-center gap-2">
                <span className="text-lg font-black text-slate-900">₹</span>
                <input 
                  type="number"
                  value={totalAmount}
                  onChange={(e) => {
                     setTotalAmount(Number(e.target.value));
                     setPaymentAmount(Number(e.target.value));
                  }}
                  className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-lg font-black text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
               <div className="flex-1 border border-slate-200 rounded-xl p-3 flex flex-col gap-3 bg-white">
                  <label className="flex items-center gap-3 cursor-pointer">
                     <input 
                       type="radio" 
                       name="paymentOption" 
                       value="NOW" 
                       checked={paymentOption === 'NOW'} 
                       onChange={() => setPaymentOption('NOW')}
                       className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" 
                     />
                     <span className="text-sm font-bold text-slate-800">Pay Now</span>
                  </label>
                  {paymentOption === 'NOW' && (
                     <div className="ml-7 flex flex-col sm:flex-row sm:items-center gap-2 w-[calc(100%-28px)]">
                       <input 
                         type="number"
                         value={paymentAmount}
                         onChange={(e) => setPaymentAmount(Number(e.target.value))}
                         className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                         placeholder="Amt"
                       />
                       <select 
                         value={paymentMethod} 
                         onChange={(e) => setPaymentMethod(e.target.value as any)} 
                         className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                       >
                         <option value="CASH">Cash</option>
                         <option value="CARD">Card / POS</option>
                         <option value="UPI">UPI / QR</option>
                       </select>
                     </div>
                  )}
               </div>
               
               <div className="flex-1 border border-slate-200 rounded-xl p-3 flex flex-col gap-3 bg-white">
                  <label className="flex items-center gap-3 cursor-pointer">
                     <input 
                       type="radio" 
                       name="paymentOption" 
                       value="LATER" 
                       checked={paymentOption === 'LATER'} 
                       onChange={() => setPaymentOption('LATER')}
                       className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" 
                     />
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">Pay Later</span>
                        <span className="text-[10px] text-slate-500 leading-tight mt-0.5">Will remain as pending balance on file</span>
                     </div>
                  </label>
               </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white p-6 -mx-6 -mb-6 mt-6 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
            <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button onClick={() => handleCheckIn()} disabled={isSubmitting} className="px-6 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2">
              {isSubmitting ? 'Processing...' : 'Complete Check-In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
