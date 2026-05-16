'use client';

import React, { useState, useEffect } from 'react';
import PharmacyLayout from '@/views/layouts/PharmacyLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  Pill, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Package,
  Info,
  ChevronRight,
  Printer,
  Loader2,
  AlertTriangle,
  Scale,
  Calendar,
  Layers,
  ChevronDown,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DispensingViewProps {
  caseId: string;
}

const PharmacyDispensingView = ({ caseId }: DispensingViewProps) => {
  const router = useRouter();
  const [patientCase, setPatientCase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dispensing, setDispensing] = useState(false);
  const [dispenseItems, setDispenseItems] = useState<any[]>([]);

  useEffect(() => {
    fetchPrescriptions();
  }, [caseId]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/pharmacy/prescriptions/${caseId}`);
      setPatientCase(response.data);
      
      // Initialize dispense items with smart quantity calculation
      const initialItems = response.data.prescriptions[0]?.items.map((item: any) => {
        const frequency = item.frequency || '1-0-1';
        const duration = item.duration || 0;
        
        // Parse frequency: e.g. "1-0-1" -> 2, "1-1-1" -> 3
        const parts = frequency.split('-').map((p: string) => parseInt(p) || 0);
        const unitsPerDay = parts.reduce((a: number, b: number) => a + b, 0);
        const totalRequired = unitsPerDay * duration;

        return {
          prescriptionItemId: item.id,
          drugId: item.drugId,
          drugName: item.drugName,
          genericName: item.drug?.genericName,
          category: item.drug?.drugCategory,
          frequency,
          duration,
          requestedQuantity: totalRequired,
          quantityDispensed: totalRequired,
          availableStock: item.drug?.inventory?.totalStock || 0,
          isDispensed: item.isDispensed,
          unitOfMeasure: item.drug?.unitOfMeasure || 'Units',
          batches: item.drug?.inventory?.batches || []
        };
      }) || [];
      
      setDispenseItems(initialItems);
    } catch (error) {
      toast.error('Failed to fetch prescription details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (index: number, val: number) => {
    const updated = [...dispenseItems];
    updated[index].quantityDispensed = val;
    setDispenseItems(updated);
  };

  const handleDispense = async () => {
    try {
      setDispensing(true);
      
      const payload = {
        caseId,
        prescriptionId: patientCase.prescriptions[0].id,
        items: dispenseItems.map(item => ({
          prescriptionItemId: item.prescriptionItemId,
          drugId: item.drugId,
          quantityDispensed: item.quantityDispensed
        }))
      };

      await api.post('/pharmacy/dispense', payload);
      toast.success('Medication dispensed successfully');
      router.push('/pharmacy/queue');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Dispensing failed');
    } finally {
      setDispensing(false);
    }
  };

  if (loading) {
    return (
      <PharmacyLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Prescription...</p>
        </div>
      </PharmacyLayout>
    );
  }

  const patient = patientCase?.patient;
  const prescription = patientCase?.prescriptions?.[0];

  return (
    <PharmacyLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-6">
              <Link href="/pharmacy/queue" className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                 <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dispense Medication</h1>
                 <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">
                   Case Record: {patientCase?.tokenDisplay}
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <button 
                onClick={() => window.open(`/print/prescription/${caseId}`, '_blank')}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                 <Printer className="w-4 h-4" />
                 Print Prescription
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Left Column: Patient Info & Prescription Details */}
           <div className="lg:col-span-8 space-y-8">
              
              {/* Patient Banner */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                 <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
                          <User className="w-10 h-10 text-emerald-400" />
                       </div>
                       <div>
                          <h2 className="text-3xl font-black uppercase tracking-tight">{patient?.firstName} {patient?.lastName}</h2>
                          <div className="flex items-center gap-4 text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">
                             <span>MRD: {patient?.mrdNumber}</span>
                             <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                             <span>{patient?.gender} / {patient?.age} Yrs</span>
                          </div>
                       </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl min-w-[200px]">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Prescribing Doctor</p>
                       <p className="text-lg font-black uppercase">Dr. {patientCase?.doctor?.user?.firstName} {patientCase?.doctor?.user?.lastName}</p>
                       <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Dermatology</p>
                    </div>
                 </div>
              </div>

              {/* Items Table */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
                 <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Prescribed Medications</h3>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                       <Info className="w-4 h-4" />
                       {dispenseItems.length} Items Total
                    </div>
                 </div>
                 
                 <table className="w-full">
                    <thead className="bg-slate-50/50">
                       <tr className="border-b border-slate-100">
                          <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Drug Name</th>
                          <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosage / Freq</th>
                          <th className="px-10 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                          <th className="px-10 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispense Qty</th>
                          <th className="px-10 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {dispenseItems.map((item, idx) => (
                           <React.Fragment key={idx}>
                             <tr className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-8">
                                   <div className="flex items-center gap-4">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${
                                         item.isDispensed ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200'
                                      }`}>
                                         <Pill className={`w-6 h-6 ${item.isDispensed ? 'text-emerald-500' : 'text-slate-400'}`} />
                                      </div>
                                      <div>
                                         <p className="text-sm font-black text-slate-900 uppercase">{item.drugName}</p>
                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.genericName || 'No Generic'}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-10 py-8">
                                   <div>
                                      <p className="text-sm font-bold text-slate-700 uppercase">{item.frequency}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.duration} Days Duration</p>
                                   </div>
                                </td>
                                <td className="px-10 py-8 text-center">
                                   <div className={`inline-flex flex-col items-center gap-1`}>
                                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                                         item.availableStock < item.quantityDispensed 
                                           ? 'bg-red-50 text-red-600 border-red-100' 
                                           : item.availableStock < 20 
                                           ? 'bg-amber-50 text-amber-600 border-amber-100'
                                           : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                      }`}>
                                         <Package className="w-3.5 h-3.5" />
                                         <span className="text-[11px] font-black">{item.availableStock}</span>
                                      </div>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total Stock</span>
                                   </div>
                                </td>
                                <td className="px-10 py-8 text-center">
                                   <div className="flex flex-col items-center gap-2">
                                      <input 
                                        type="number"
                                        min="0"
                                        max={item.availableStock}
                                        value={item.quantityDispensed}
                                        onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value) || 0)}
                                        className="w-20 h-12 bg-slate-50 border-2 border-slate-100 rounded-xl text-center font-black text-slate-900 focus:border-emerald-500 transition-all outline-none"
                                      />
                                      <span className="text-[9px] font-bold text-slate-400 uppercase">Req: {item.requestedQuantity}</span>
                                   </div>
                                </td>
                                <td className="px-10 py-8 text-center">
                                   {item.isDispensed ? (
                                      <span className="inline-flex items-center gap-1.5 text-emerald-500">
                                         <CheckCircle2 className="w-5 h-5" />
                                         <span className="text-[10px] font-black uppercase tracking-widest">Done</span>
                                      </span>
                                   ) : item.availableStock === 0 ? (
                                      <span className="inline-flex items-center gap-1.5 text-red-500">
                                         <AlertTriangle className="w-5 h-5" />
                                         <span className="text-[10px] font-black uppercase tracking-widest">No Stock</span>
                                      </span>
                                   ) : (
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</span>
                                   )}
                                </td>
                             </tr>
                             
                             {/* Batch Health Warning if needed */}
                             {!item.isDispensed && item.batches.length > 0 && (
                               <tr>
                                 <td colSpan={5} className="px-10 py-0 bg-slate-50/30">
                                    <div className="py-3 flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                       <Layers className="w-4 h-4 text-slate-400" />
                                       <span>Dispensing via FEFO Logic (First Expiry First Out)</span>
                                       <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                       <span className="text-blue-500">{item.batches.length} active batches available</span>
                                       {item.batches.some((b: any) => new Date(b.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)) && (
                                         <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                            <AlertTriangle className="w-3 h-3" />
                                            Near Expiry Batch Present
                                         </span>
                                       )}
                                    </div>
                                 </td>
                               </tr>
                             )}
                           </React.Fragment>
                        ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Right Column: Summary & Actions */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-10 sticky top-32">
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Dispensing Summary</h3>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-slate-50">
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Items to Dispense</span>
                       <span className="text-base font-black text-slate-900">{dispenseItems.filter(i => i.quantityDispensed > 0).length}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-50">
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Units</span>
                       <span className="text-base font-black text-slate-900">
                          {dispenseItems.reduce((acc, curr) => acc + curr.quantityDispensed, 0)}
                       </span>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                       <div className="flex items-center gap-3">
                          <Info className="w-5 h-5 text-blue-500" />
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Special Instructions</p>
                       </div>
                       <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                          "{prescription?.notes || 'No special instructions from the doctor.'}"
                       </p>
                    </div>

                    <div className="pt-4">
                       <button 
                         onClick={handleDispense}
                         disabled={dispensing || dispenseItems.every(i => i.quantityDispensed === 0)}
                         className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                          {dispensing ? (
                             <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                             <CheckCircle2 className="w-5 h-5" />
                          )}
                          CONFIRM DISPENSING
                       </button>
                       <p className="text-[9px] font-black text-slate-400 text-center uppercase tracking-widest mt-6 leading-relaxed">
                          By confirming, you acknowledge that stock will be deducted and the patient's record will be updated.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </PharmacyLayout>
  );
};

export default PharmacyDispensingView;
