import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { QRCodeCanvas } from 'qrcode.react';

interface InitialConsultationPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
  appointmentId?: string | null;
  walkInDoctorId?: string | null;
  walkInSlot?: string | null;
  walkInVisitType?: string | null;
  walkInComplaint?: string | null;
  onSuccess?: () => void;
}

const InitialConsultationPaymentModal: React.FC<InitialConsultationPaymentModalProps> = ({
  isOpen,
  onClose,
  patient,
  appointmentId,
  walkInDoctorId,
  walkInSlot,
  walkInVisitType,
  walkInComplaint,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [paymentOption, setPaymentOption] = useState<'NOW' | 'LATER'>('NOW');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI'>('CASH');
  const [totalAmount, setTotalAmount] = useState<number>(500);
  const [paymentAmount, setPaymentAmount] = useState<number>(500);

  const [upiId, setUpiId] = useState('');
  const [upiPayeeName, setUpiPayeeName] = useState('');

  useEffect(() => {
    api.get('/admin/payment-settings').then(res => {
      setUpiId(res.data.upiId || '');
      setUpiPayeeName(res.data.upiPayeeName || 'Clinic');
    }).catch(() => {});
  }, []);

  const upiString = upiId ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiPayeeName)}&am=${paymentAmount}&cu=INR&tn=OPD+Payment` : '';

  const handleCheckIn = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      let res;
      if (appointmentId) {
          res = await api.post('/appointments/check-in', {
             appointmentId: appointmentId
          });
      } else {
          // Walk-In Flow
          if (!walkInDoctorId || !walkInSlot) {
            toast.error('Missing doctor or slot information for walk-in');
            setIsSubmitting(false);
            return;
          }

          const today = new Date();
          const dateString = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

          const apptRes = await api.post('/appointments', {
            patientId: patient.id,
            doctorId: walkInDoctorId,
            appointmentDate: dateString,
            appointmentTime: walkInSlot,
            purpose: walkInVisitType || 'CONSULTATION',
            remarks: walkInComplaint || ''
          });

          res = await api.post('/appointments/check-in', {
            appointmentId: apptRes.data.id,
            visitType: walkInVisitType || 'CONSULTATION',
            priority: 'NORMAL',
            complaint: walkInComplaint || ''
          });
      }

      // Create Initial Consultation Bill
      const caseId = res.data?.caseId || res.data?.id || res.data?.queueEntry?.caseId;
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
            amountPaid: paymentAmount,
            paymentMode: paymentMethod,
            transactionId: 'CHECKIN_PAYMENT'
          });
        }
      }

      toast.success('Check-in and payment processed successfully!');
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Initial Consultation Payment</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">Collect fees and complete the check-in process.</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* Left Column - Patient Summary */}
            <div className="flex-1 p-8 border-r border-slate-100 space-y-8 bg-white">
              
              {/* Patient Card */}
              <div className="flex items-start gap-5 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                 <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-[#094861] font-black text-xl shadow-inner">
                   {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                 </div>
                 <div className="flex-1">
                   <div className="font-black text-xl text-slate-800 flex items-center gap-3">
                     {patient.firstName} {patient.lastName}
                     <span className="text-xs font-bold bg-white border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full shadow-sm">
                       {patient.profile?.age || 'N/A'}{patient.gender?.charAt(0) || 'U'}
                     </span>
                   </div>
                   <div className="text-sm font-semibold text-slate-500 mt-1.5 flex items-center gap-4">
                     <span className="flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                       MRD: <span className="text-slate-700">{patient.mrdNumber}</span>
                     </span>
                   </div>
                 </div>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-amber-800">
                 <p className="text-sm font-semibold">Please review the billing details on the right to complete the check-in.</p>
              </div>
            </div>

            {/* Right Column - Billing */}
            <div className="lg:w-[420px] bg-slate-50/50 p-8 flex flex-col">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-6">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-[#0d6282] flex items-center justify-center text-[11px] font-black">₹</span>
                Billing Details
              </h3>
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-800">Consultation Fee</p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">Due at check-in</p>
                  </div>
                  <div className="text-right flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <span className="text-lg font-black text-[#0d6282]">₹</span>
                    <input 
                      type="number"
                      value={totalAmount}
                      readOnly
                      className="w-20 bg-transparent text-xl font-black text-slate-800 text-right focus:outline-none cursor-default"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                 <label 
                   onClick={() => setPaymentOption('NOW')}
                   className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentOption === 'NOW' ? 'border-[#0d6282] bg-sky-50/30 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                 >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentOption === 'NOW' ? 'border-[#0d6282]' : 'border-slate-300'}`}>
                        {paymentOption === 'NOW' && <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />}
                      </div>
                      <span className="text-sm font-black text-slate-800">Pay Now</span>
                    </div>
                    {paymentOption === 'NOW' && (
                       <div className="ml-8 mt-4 animate-in slide-in-from-top-2 duration-200">
                         <div className="flex items-center gap-2">
                           <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                             <input 
                               type="number"
                               value={paymentAmount}
                               onChange={(e) => setPaymentAmount(Number(e.target.value))}
                               className="w-24 pl-7 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d6282]/20 focus:border-[#0d6282] shadow-sm transition-all"
                               placeholder="Amount"
                             />
                           </div>
                           <select 
                             value={paymentMethod} 
                             onChange={(e) => setPaymentMethod(e.target.value as any)} 
                             className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0d6282]/20 focus:border-[#0d6282] shadow-sm transition-all cursor-pointer"
                           >
                             <option value="CASH">Cash</option>
                             <option value="CARD">Card / POS</option>
                             <option value="UPI">UPI / QR</option>
                           </select>
                         </div>
                         
                         {paymentMethod === 'UPI' && upiString && (
                           <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 shadow-sm">
                             <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                               <QRCodeCanvas value={upiString} size={140} level="H" className="rounded-lg" />
                             </div>
                             <div className="text-center">
                               <p className="text-xs font-black text-slate-800">Scan to pay ₹{paymentAmount}</p>
                               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{upiId}</p>
                             </div>
                           </div>
                         )}
                       </div>
                    )}
                 </label>
                 
                 <label 
                   onClick={() => setPaymentOption('LATER')}
                   className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${paymentOption === 'LATER' ? 'border-slate-500 bg-slate-50/30 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                 >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentOption === 'LATER' ? 'border-slate-500' : 'border-slate-300'}`}>
                        {paymentOption === 'LATER' && <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-sm font-black text-slate-800">Pay Later</span>
                         <span className="text-[11px] font-semibold text-slate-500 mt-0.5">Amount will be added as pending balance</span>
                      </div>
                    </div>
                 </label>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3 z-10">
          <button onClick={onClose} disabled={isSubmitting} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => handleCheckIn()} 
            disabled={isSubmitting} 
            className="px-8 py-3 text-sm font-black text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {isSubmitting ? 'Processing...' : 'Complete Check-In'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default InitialConsultationPaymentModal;
