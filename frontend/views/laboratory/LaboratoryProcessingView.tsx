'use client';

import React, { useState, useEffect } from 'react';
import LaboratoryLayout from '@/views/layouts/LaboratoryLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { 
  FlaskConical, 
  ChevronLeft, 
  Save, 
  Info, 
  AlertTriangle, 
  CheckCircle2,
  Loader2,
  Dna,
  History,
  FileText,
  User,
  Activity,
  Calculator,
  Printer
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LaboratoryProcessingViewProps {
  orderId: string;
}

const LaboratoryProcessingView: React.FC<LaboratoryProcessingViewProps> = ({ orderId }) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/laboratory/order/${orderId}`);
      setOrder(response.data);
      
      // Initialize results array based on parameters
      const initialResults = response.data.results.map((res: any) => ({
        parameterId: res.parameterId,
        parameterName: res.parameter?.name,
        unit: res.parameter?.unit,
        refRange: `${res.parameter?.minValue} - ${res.parameter?.maxValue}`,
        numericValue: res.numericValue || '',
        textValue: res.textValue || '',
        isAbnormal: res.isAbnormal || false,
        notes: res.notes || '',
        min: res.parameter?.minValue,
        max: res.parameter?.maxValue
      }));
      setResults(initialResults);
    } catch (error) {
      toast.error('Failed to fetch investigation details');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (index: number, field: string, value: any) => {
    const newResults = [...results];
    newResults[index][field] = value;

    // Auto-check for abnormal values if numeric
    if (field === 'numericValue' && value !== '') {
      const numVal = parseFloat(value);
      const min = newResults[index].min;
      const max = newResults[index].max;
      newResults[index].isAbnormal = numVal < min || numVal > max;
    }

    setResults(newResults);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Clean data for API
      const payload = {
        results: results.map(res => ({
          parameterId: res.parameterId,
          numericValue: res.numericValue !== '' ? parseFloat(res.numericValue) : null,
          textValue: res.textValue,
          isAbnormal: res.isAbnormal,
          notes: res.notes
        }))
      };

      await api.post(`/laboratory/order/${orderId}/results`, payload);
      toast.success('Lab results submitted successfully');
      router.push('/laboratory/pending');
    } catch (error) {
      toast.error('Failed to submit laboratory results');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <LaboratoryLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Diagnostic Parameters...</p>
        </div>
      </LaboratoryLayout>
    );
  }

  return (
    <LaboratoryLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <Link 
            href="/laboratory/pending"
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Queue
          </Link>
          
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
              <History className="w-4 h-4" />
              Patient History
            </button>
            {order?.status === 'COMPLETED' && (
              <button 
                onClick={() => window.open(`/print/lab/${orderId}`, '_blank')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
              >
                <Printer className="w-4 h-4" />
                PRINT REPORT
              </button>
            )}
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              SUBMIT ALL RESULTS
            </button>
          </div>
        </div>

        {/* Patient Case Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
           
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
              <div className="flex items-center gap-8">
                 <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                    <User className="w-10 h-10" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase">
                       {order.patientCase?.patient?.firstName} {order.patientCase?.patient?.lastName}
                    </h2>
                    <div className="flex items-center gap-4 mt-3">
                       <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                          {order.patientCase?.patient?.gender} • {order.patientCase?.patient?.age} Years
                       </span>
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          ORDER ID: <span className="text-slate-900">{orderId.split('-')[0]}</span>
                       </span>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col md:items-end gap-2">
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Requesting Physician</p>
                 <div className="flex items-center gap-3 mt-1">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-900">
                       DR
                    </div>
                    <p className="text-sm font-black text-slate-900 uppercase">
                       Dr. {order.patientCase?.doctor?.user?.firstName || 'Assigned Physician'}
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Results Entry Form */}
        <div className="grid grid-cols-1 gap-8">
           <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/40">
              <div className="px-10 py-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <FlaskConical className="w-6 h-6 text-blue-600" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Test Parameter Analysis</h3>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Abnormal Value</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Normal Range</span>
                    </div>
                 </div>
              </div>

              <div className="p-0">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/30 border-b border-slate-100">
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/3">Parameter</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reference Range</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Result Value</th>
                          <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {results.map((res, index) => (
                          <tr key={index} className="group hover:bg-slate-50/50 transition-all">
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                      <Activity className="w-5 h-5 text-blue-600" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-slate-900 uppercase">{res.parameterName}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Diagnostic Marker</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="flex flex-col items-center">
                                   <span className="text-sm font-black text-slate-700">{res.refRange}</span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{res.unit}</span>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="max-w-[200px] mx-auto relative group">
                                   <input 
                                      type="text"
                                      value={res.numericValue}
                                      onChange={(e) => handleValueChange(index, 'numericValue', e.target.value)}
                                      placeholder="0.00"
                                      className={`w-full h-14 bg-white border ${res.isAbnormal ? 'border-red-500 text-red-600 focus:ring-red-500/10' : 'border-slate-200 text-slate-900 focus:ring-blue-500/10 focus:border-blue-500'} rounded-2xl text-center font-black text-base transition-all outline-none`}
                                   />
                                   <Calculator className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="flex justify-center">
                                   {res.numericValue === '' ? (
                                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pending Entry</span>
                                   ) : res.isAbnormal ? (
                                      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full border border-red-100">
                                         <AlertTriangle className="w-4 h-4" />
                                         <span className="text-[10px] font-black uppercase tracking-widest">Abnormal</span>
                                      </div>
                                   ) : (
                                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                                         <CheckCircle2 className="w-4 h-4" />
                                         <span className="text-[10px] font-black uppercase tracking-widest">Normal</span>
                                      </div>
                                   )}
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Notes & File Upload */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10">
                 <div className="flex items-center gap-4 mb-6">
                    <FileText className="w-6 h-6 text-slate-400" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Technician Notes</h3>
                 </div>
                 <textarea 
                    placeholder="Enter any observations or technical notes regarding the sample or process..."
                    className="w-full h-40 bg-slate-50 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                 />
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 flex flex-col justify-center items-center text-center">
                 <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-6">
                    <Dna className="w-10 h-10 text-blue-600" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 uppercase">Diagnostic Integrity</h3>
                 <p className="text-sm text-slate-500 font-medium mt-2 max-w-[300px]">
                    Ensure all results are cross-verified with laboratory machines before final submission.
                 </p>
                 <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4 text-left">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
                       Abnormal values are automatically flagged based on predefined physiological ranges for the patient's age and gender.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </LaboratoryLayout>
  );
};

export default LaboratoryProcessingView;
