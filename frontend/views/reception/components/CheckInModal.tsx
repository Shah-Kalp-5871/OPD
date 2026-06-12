import React, { useState, useEffect } from 'react';
import { Stethoscope, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import ComplaintsForm, { VisitComplaintData } from '../check-in/components/ComplaintsForm';

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

  const [vitals, setVitals] = useState({
    height: '', weight: '', bmi: '0.0', temp: '', pulse: '', bpSys: '', bpDia: '', spo2: ''
  });

  const [visitComplaint, setVisitComplaint] = useState<VisitComplaintData>({
    presentComplaint: '', durationDays: '', durationMonths: '', durationYears: '',
    severity: 'MODERATE', onset: '', aggravatingFactors: '', relievingFactors: '',
    pastMedical: '', personalHistory: '', pastSurgical: '', currentMedications: '',
    obstetricHistory: '', allergies: '', nursingNotes: '', patientFeedback: ''
  });

  useEffect(() => {
    if (isOpen && patient) {
      fetchDoctors();
      fetchPatientAppointments();
    }
  }, [isOpen, patient, appointmentId]);

  useEffect(() => {
    if (vitals.height && vitals.weight) {
      const h = parseFloat(vitals.height) / 100;
      const w = parseFloat(vitals.weight);
      if (h > 0) {
        setVitals(prev => ({ ...prev, bmi: (w / (h * h)).toFixed(1) }));
      }
    }
  }, [vitals.height, vitals.weight]);

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

  const handleCheckIn = async (skipVitals: boolean = false) => {
    if (isSubmitting) return;
    if (!selectedDoctorId && doctors.length > 0) {
      toast.error('Please select a doctor.');
      return;
    }

    setIsSubmitting(true);
    try {
      const bpString = vitals.bpSys && vitals.bpDia
        ? `${vitals.bpSys}/${vitals.bpDia}`
        : vitals.bpSys ? vitals.bpSys : null;

      const vData = (vitals.height || vitals.weight || vitals.temp || vitals.pulse || vitals.bpSys || vitals.spo2) && !skipVitals
        ? {
            height: parseFloat(vitals.height) || null,
            weight: parseFloat(vitals.weight) || null,
            bmi: parseFloat(vitals.bmi) || null,
            temperature: parseFloat(vitals.temp) || null,
            pulse: parseInt(vitals.pulse) || null,
            bloodPressure: bpString,
            spo2: parseInt(vitals.spo2) || null
          } : undefined;

      const vcData = visitComplaint.presentComplaint || visitComplaint.pastMedical || visitComplaint.allergies ? {
          ...visitComplaint,
          durationDays: parseInt(visitComplaint.durationDays) || null,
          durationMonths: parseInt(visitComplaint.durationMonths) || null,
          durationYears: parseInt(visitComplaint.durationYears) || null,
      } : undefined;

      const checkInData = {
        appointmentId: selectedAppointment?.id,
        visitType: selectedAppointment?.purpose || visitType,
        priority,
        complaint,
        vitals: vData,
        visitComplaint: vcData
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

          if (checkInData.vitals) {
             await api.post(`/patients/${patient.id}/vitals`, checkInData.vitals);
          }
          res = await api.post('/appointments/check-in', {
            ...checkInData,
            appointmentId: apptRes.data.id
          });
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
            <p className="text-xs text-slate-500">Record complaints & history, vitals, and mark as arrived.</p>
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

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Complaints & History</h3>
            <ComplaintsForm data={visitComplaint} onChange={setVisitComplaint} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Vitals (Optional)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Height (cm)</label>
                  <input type="number" value={vitals.height} onChange={e => setVitals({...vitals, height: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Weight (kg)</label>
                  <input type="number" value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">BMI</label>
                  <div className="w-full border border-slate-200 bg-slate-100 rounded-lg p-2 text-sm text-slate-500 font-medium h-[38px] flex items-center">
                    {vitals.bmi}
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Temp (°F)</label>
                  <input type="number" value={vitals.temp} onChange={e => setVitals({...vitals, temp: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">Pulse (BPM)</label>
                  <input type="number" value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">BP Systolic</label>
                  <input type="number" value={vitals.bpSys} onChange={e => setVitals({...vitals, bpSys: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">BP Diastolic</label>
                  <input type="number" value={vitals.bpDia} onChange={e => setVitals({...vitals, bpDia: e.target.value})} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all" />
               </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => handleCheckIn(false)}
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-colors shadow-sm"
          >
            {isSubmitting ? 'Saving...' : 'Save & Check In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
