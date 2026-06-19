'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import DoctorLayout from '@/views/layouts/DoctorLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, User, Calendar, Activity } from 'lucide-react';
import HistoryTab from './components/HistoryTab';

const DoctorPatientHubView = () => {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/patients/${patientId}`);
      setPatient(response.data);
    } catch (error) {
      toast.error('Failed to load patient data');
      router.push('/doctor/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#107ca3] rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Patient Hub...</span>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  if (!patient) return null;

  return (
    <DoctorLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-20 px-4 pt-4">
        
        {/* Header */}
        <div className="bg-white border border-[#107ca3]/20 rounded-2xl p-6 shadow-sm flex items-start justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push('/doctor/dashboard')}
              className="w-12 h-12 bg-slate-50 hover:bg-[#f0f7fa] border border-slate-200 hover:border-[#107ca3]/30 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#107ca3] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[#f0f7fa] border border-[#107ca3]/20 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-[#107ca3]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                  {patient.firstName} {patient.lastName}
                </h1>
                <div className="flex items-center gap-4 mt-1.5">
                  <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                    MRD: {patient.mrdNumber}
                  </span>
                  <span className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {patient.dateOfBirth ? `${Math.abs(new Date(Date.now() - new Date(patient.dateOfBirth).getTime()).getUTCFullYear() - 1970)} Years` : 'Age N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
            <Activity className="w-5 h-5 text-[#107ca3]" />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Complete Medical History</h2>
          </div>
          <div className="p-6">
            <HistoryTab patientId={patientId} cases={patient.cases || []} />
          </div>
        </div>

      </div>
    </DoctorLayout>
  );
};

export default DoctorPatientHubView;
