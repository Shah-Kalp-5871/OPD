'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import api from '@/lib/api';
import { toast } from 'sonner';

import PatientHeader from './components/PatientHeader';
import TopNavBar from './components/TopNavBar';
import MasterChartTab from './components/tabs/MasterChartTab';
import TimelineTab from './components/tabs/TimelineTab';
import ComplaintsTab from './components/tabs/ComplaintsTab';
import DocumentsTab from './components/tabs/DocumentsTab';
import ConsentTab from './components/tabs/ConsentTab';
import CheckInModal from '../../components/CheckInModal';
import ProfileSection from './components/ProfileSection';

const PatientHubView = () => {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'master_chart' | 'complaints' | 'cases' | 'documents' | 'consent' | 'billing'>('master_chart');
  const [doctors, setDoctors] = useState<any[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  useEffect(() => {
    fetchPatientData();
    fetchDoctors();
  }, [patientId]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id as any);
        }
      });
    }, { rootMargin: '-20% 0px -80% 0px' });

    const sections = ['master_chart', 'complaints', 'cases', 'documents', 'consent'].map(id => document.getElementById(id));
    sections.forEach(s => s && observer.observe(s));
    
    return () => observer.disconnect();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    }
  };

  const fetchPatientData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/patients/${patientId}`);
      setPatient(response.data);
    } catch (error) {
      toast.error('Failed to load patient data');
      router.push('/reception/search');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVitalsSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.post(`/patients/${patientId}/vitals`, {
        temperature: parseFloat(data.temp),
        pulse: parseInt(data.pulse),
        bloodPressure: `${data.bpSys}/${data.bpDia}`,
        spo2: parseInt(data.spo2),
        weight: data.weight ? parseFloat(data.weight) : undefined,
        height: data.height ? parseFloat(data.height) : undefined,
      });
      toast.success('Vitals recorded successfully');
      fetchPatientData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to record vitals');
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleProfileSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.patch(`/patients/${patientId}/profile`, data);
      toast.success('Profile updated');
      fetchPatientData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };



  if (isLoading || !patient) {
    return (
      <ReceptionLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opening Clinical Record...</p>
        </div>
      </ReceptionLayout>
    );
  }

  const latestVitals = patient.vitals?.[0];
  const completion = patient.profileCompletionStatus || 20;
  const activeCase = patient.cases?.find((c: any) => c.status === 'OPEN');
  const hasOpenCase = !!activeCase;

  return (
    <ReceptionLayout>
      {/* Clinical Workspace Container */}
      <div className="min-h-screen bg-slate-50">
        <div className="w-full mx-auto min-h-screen pb-24 px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          <PatientHeader 
            patient={patient} 
            completion={completion} 
            hasOpenCase={hasOpenCase} 
            activeCase={activeCase}
            onCheckIn={() => setIsCheckInModalOpen(true)}
          />

          <div className="sticky top-16 z-40">
            <TopNavBar activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>

          <div className="space-y-16">
            <div className="space-y-16">
               <div id="master_chart" className="scroll-mt-48 space-y-8">
                 <ProfileSection patient={patient} onSaveProfile={handleProfileSubmit} />
                 <MasterChartTab 
                   patient={patient}
                   latestVitals={latestVitals}
                   hasOpenCase={hasOpenCase}
                   onSaveVitals={handleVitalsSubmit}
                   onViewCases={() => {
                     const el = document.getElementById('cases');
                     if (el) {
                       const yOffset = -100;
                       const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                       window.scrollTo({ top: y, behavior: 'smooth' });
                     }
                   }}
                 />
               </div>

               <div id="complaints" className="scroll-mt-48 pt-12 border-t border-slate-200">
                 <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Complaints & History</h2>
                 <ComplaintsTab patient={patient} />
               </div>

               <div id="cases" className="scroll-mt-48 pt-12 border-t border-slate-200">
                 <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Clinical History</h2>
                 <TimelineTab 
                   patient={patient}
                   hasOpenCase={hasOpenCase}
                 />
               </div>

               <div id="documents" className="scroll-mt-48 pt-12 border-t border-slate-200">
                 <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Reports & Files</h2>
                 <DocumentsTab 
                   patient={patient}
                   onRefresh={fetchPatientData}
                 />
               </div>

               <div id="consent" className="scroll-mt-48 pt-12 border-t border-slate-200">
                 <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Consent Forms</h2>
                 <ConsentTab 
                   patient={patient}
                   activeCase={activeCase}
                 />
               </div>

               <div id="billing" className="scroll-mt-48 pt-12 border-t border-slate-200">
                 <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Billing Records</h2>
                 <div className="text-center p-12 bg-white rounded-3xl border border-slate-200/60 shadow-sm border-dashed">
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Billing Records Yet</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Check In Modal */}
        <CheckInModal 
          isOpen={isCheckInModalOpen}
          onClose={() => setIsCheckInModalOpen(false)}
          patient={patient}
          onSuccess={() => fetchPatientData()}
        />
      </div>
    </ReceptionLayout>
  );
};

export default PatientHubView;
