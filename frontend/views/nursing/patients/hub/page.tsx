'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import NursingLayout from '@/views/layouts/NursingLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { FileText, Loader2, User } from 'lucide-react';
import { useCaseLock } from '@/hooks/useCaseLock';

const NursingPatientHubView = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = params?.id as string;
  const urlCaseId = searchParams?.get('caseId');
  
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(urlCaseId || null);

  useCaseLock(selectedCaseId || '', 'NURSING');

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  useEffect(() => {
    if (patient && !selectedCaseId) {
      const activeCase = patient.cases?.find((c: any) => c.status === 'OPEN');
      if (activeCase) {
        setSelectedCaseId(activeCase.id);
      } else if (patient.cases?.length > 0) {
        const sortedCases = [...patient.cases].sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSelectedCaseId(sortedCases[0].id);
      }
    }
  }, [patient, selectedCaseId]);

  const fetchPatientData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/patients/${patientId}`);
      setPatient(response.data);
    } catch (error) {
      toast.error('Failed to load patient data');
      router.push('/nursing/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCaseId = e.target.value;
    setSelectedCaseId(newCaseId);
    router.push(`/nursing/patients/${patientId}?caseId=${newCaseId}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <NursingLayout>
        <div className="flex flex-col items-center justify-center py-40">
           <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Patient Hub...</p>
        </div>
      </NursingLayout>
    );
  }

  return (
    <NursingLayout>
      <div className="max-w-[1600px] mx-auto space-y-10 pb-32">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                 <User className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                    {patient?.firstName} {patient?.lastName}
                 </h1>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                    MRD: <span className="text-slate-800 font-black">{patient?.mrdNumber}</span>
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <select 
                value={selectedCaseId || ''}
                onChange={handleCaseChange}
                className="px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-700 outline-none focus:border-green-500"
              >
                 <option value="" disabled>Select a Case</option>
                 {patient?.cases?.map((c: any) => (
                    <option key={c.id} value={c.id}>
                       {c.id.split('-').pop()} - {new Date(c.createdAt).toLocaleDateString()} ({c.status})
                    </option>
                 ))}
              </select>

              <button 
                onClick={() => window.location.href = `/nursing/vitals?mrd=${patient?.mrdNumber}&caseId=${selectedCaseId}`}
                className="px-6 py-3 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Open Complaints & Vitals
              </button>
           </div>
        </div>
      </div>
    </NursingLayout>
  );
};

export default NursingPatientHubView;
