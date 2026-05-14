'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import api from '@/lib/api';
import { toast } from 'sonner';

// Components
import PatientHeader from './components/PatientHeader';
import PatientStatusStrip from './components/PatientStatusStrip';
import PatientSidebar from './components/PatientSidebar';
import OverviewTab from './components/tabs/OverviewTab';
import TimelineTab from './components/tabs/TimelineTab';
import VitalsTab from './components/tabs/VitalsTab';
import ProfileTab from './components/tabs/ProfileTab';
import DocumentsTab from './components/tabs/DocumentsTab';
import AddVitalsModal from './components/AddVitalsModal';
import StartVisitModal from './components/StartVisitModal';
import EditPatientModal from './components/EditPatientModal';

const PatientHubView = () => {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'cases' | 'profile' | 'documents'>('overview');
  
  // Modals
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showEditBasicModal, setShowEditBasicModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPatientData();
    fetchDoctors();
  }, [patientId]);

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
      setShowVitalsModal(false);
      fetchPatientData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to record vitals');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBasicInfoSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.patch(`/patients/${patientId}`, data);
      toast.success('Patient info updated');
      setShowEditBasicModal(false);
      fetchPatientData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.patch(`/patients/${patientId}/profile`, data);
      toast.success('Profile updated');
      setShowEditProfileModal(false);
      fetchPatientData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCase = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await api.post(`/patients/${patientId}/cases`, data);
      const newCase = response.data;

      // Automatic Check-In to Queue
      await api.post('/queue/check-in', {
        caseId: newCase.id,
        patientId: patientId,
        doctorId: data.doctorId,
        queueType: 'OPD',
        priority: data.priority || 'NORMAL'
      });

      toast.success('Visit started & Token generated');
      setShowVisitModal(false);
      fetchPatientData();
      setActiveTab('cases');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start visit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
      <div className="min-h-screen bg-slate-50/50">
        <div className="max-w-[1600px] mx-auto bg-white border-x border-slate-200 shadow-sm min-h-screen pb-24">
          
          <PatientHeader 
            patient={patient} 
            completion={completion} 
            hasOpenCase={hasOpenCase} 
            onEditBasic={() => setShowEditBasicModal(true)}
            onStartVisit={() => setShowVisitModal(true)}
          />

          <PatientStatusStrip 
            hasOpenCase={hasOpenCase} 
            activeCase={activeCase} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
             {/* Sidebar: File Navigation Panel */}
             <div className="lg:col-span-3 border-r border-slate-200 p-6 min-h-[calc(100vh-200px)]">
               <PatientSidebar 
                 activeTab={activeTab}
                 setActiveTab={setActiveTab}
               />
             </div>

             {/* Main Content: Chart Workspace */}
             <div className="lg:col-span-9 p-8 space-y-8 bg-slate-50/30">
                <div className="max-w-5xl">
                   {activeTab === 'overview' && (
                     <OverviewTab 
                       patient={patient}
                       latestVitals={latestVitals}
                       hasOpenCase={hasOpenCase}
                       onAddVitals={() => setShowVitalsModal(true)}
                       onStartVisit={() => setShowVisitModal(true)}
                       onViewCases={() => setActiveTab('cases')}
                     />
                   )}

                   {activeTab === 'cases' && (
                     <TimelineTab 
                       patient={patient}
                       hasOpenCase={hasOpenCase}
                       onStartVisit={() => setShowVisitModal(true)}
                     />
                   )}

                   {activeTab === 'vitals' && (
                     <VitalsTab 
                       patient={patient}
                       onAddVitals={() => setShowVitalsModal(true)}
                     />
                   )}

                   {activeTab === 'profile' && (
                     <ProfileTab 
                       patient={patient}
                       onEditProfile={() => setShowEditProfileModal(true)}
                     />
                   )}

                   {activeTab === 'documents' && (
                     <DocumentsTab 
                       patient={patient}
                     />
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddVitalsModal 
        isOpen={showVitalsModal}
        onClose={() => setShowVitalsModal(false)}
        onSubmit={handleVitalsSubmit}
        isSubmitting={isSubmitting}
      />

      <StartVisitModal 
        isOpen={showVisitModal}
        onClose={() => setShowVisitModal(false)}
        onSubmit={handleCreateCase}
        isSubmitting={isSubmitting}
        doctors={doctors}
      />

      <EditPatientModal 
        isOpen={showEditBasicModal}
        mode="basic"
        onClose={() => setShowEditBasicModal(false)}
        onSaveBasic={handleBasicInfoSubmit}
        isSubmitting={isSubmitting}
        initialData={patient}
      />

      <EditPatientModal 
        isOpen={showEditProfileModal}
        mode="profile"
        onClose={() => setShowEditProfileModal(false)}
        onSaveProfile={handleProfileSubmit}
        isSubmitting={isSubmitting}
        initialData={patient}
      />

    </ReceptionLayout>
  );
};

export default PatientHubView;
