'use client';

import React, { useState } from 'react';
import SessionTopBar from './components/SessionTopBar';
import PatientSidePanel from './components/PatientSidePanel';
import ComplaintsTab from './components/ComplaintsTab';
import InvestigationTab from './components/InvestigationTab';
import DrugsTab from './components/DrugsTab';
import ProcedureTab from './components/ProcedureTab';
import ImageTab from './components/ImageTab';
import DiagnosisTab from './components/DiagnosisTab';
import FinalReportTab from './components/FinalReportTab';
import SpecialNote, { NoteItem } from './components/SpecialNote';
import BillingSummaryPanel from './components/BillingSummaryPanel';
import ClinicChatPanel from './components/ClinicChatPanel';
import NotificationBar from './components/NotificationBar';
import { useConsultation } from './hooks/useConsultation';
import { 
  FileText, 
  Pill, 
  FlaskConical, 
  Scissors, 
  Loader2,
  Camera,
  CheckSquare,
  ClipboardList
} from 'lucide-react';

interface ConsultationViewProps {
  caseId: string;
}

const TABS = [
  { id: 'complaints',    label: 'COMPLAINTS',       icon: FileText },
  { id: 'investigation', label: 'INVESTIGATION',    icon: FlaskConical },
  { id: 'prescription',  label: 'DRUGS',            icon: Pill },
  { id: 'procedure',     label: 'PROCEDURE',        icon: Scissors },
  { id: 'images',        label: 'IMAGE',            icon: Camera },
  { id: 'diagnosis',     label: 'DIAGNOSIS & F/U',  icon: ClipboardList },
  { id: 'final-report',  label: 'FINAL REPORT',     icon: CheckSquare },
];

const ConsultationView: React.FC<ConsultationViewProps> = ({ caseId }) => {
  const { 
    data, 
    loading, 
    saving, 
    lastSaved, 
    updateComplaint, 
    updateHistory,
    updateVitals,
    saveManually,
    refresh
  } = useConsultation(caseId);
  
  const [activeTab, setActiveTab] = useState('complaints');
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const generateSpecialNotes = (consultationData: any): NoteItem[] => {
    if (!consultationData) return [];
    const notes: NoteItem[] = [];
    
    // 1. Allergies
    const allergies = consultationData.history?.allergies || consultationData.case?.visitComplaint?.allergies;
    if (allergies && allergies.trim() !== '') {
      notes.push({
        id: 'allergy',
        type: 'drug',
        message: `Allergies: ${allergies}`,
        timestamp: new Date()
      });
    }

    // 2. Priority
    if (consultationData.case?.priority === 'URGENT' || consultationData.case?.priority === 'EMERGENCY') {
      notes.push({
        id: 'priority',
        type: 'info',
        message: `Priority: ${consultationData.case.priority}`,
        timestamp: new Date()
      });
    }

    // 3. Vitals Warnings
    const latestVitals = consultationData.vitals || consultationData.case?.patient?.vitals?.[0];
    if (latestVitals) {
      if (latestVitals.temperature && latestVitals.temperature >= 100.0) {
        notes.push({
          id: 'fever',
          type: 'info',
          message: `High Temp at triage: ${latestVitals.temperature}°F`,
          timestamp: new Date()
        });
      }
      if (latestVitals.bloodPressure) {
        const parts = latestVitals.bloodPressure.split('/');
        if (parts.length === 2) {
          const sys = parseInt(parts[0], 10);
          const dia = parseInt(parts[1], 10);
          if ((sys && sys > 140) || (dia && dia > 90)) {
            notes.push({
              id: 'bp',
              type: 'info',
              message: `Elevated BP at triage: ${latestVitals.bloodPressure}`,
              timestamp: new Date()
            });
          }
        }
      }
    }

    return notes;
  };

  const specialNotes = generateSpecialNotes(data);

  const handleSaveAndNext = async (nextTabId: string) => {
    await saveManually();
    setActiveTab(nextTabId);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-50 rounded-full animate-pulse" />
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin absolute top-0" />
          </div>
          <div className="text-center">
            <p className="text-slate-900 font-black text-lg tracking-tight">Clinical Workspace</p>
            <p className="text-slate-400 text-sm font-medium">Securing session and loading clinical data...</p>
          </div>
        </div>
      </div>
    );
  }

  const patient = data?.case?.patient;
  const vitals = data?.vitals ? [data.vitals] : (patient?.vitals || []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'complaints':
        return (
          <ComplaintsTab 
            data={data} 
            updateComplaint={updateComplaint} 
            updateHistory={updateHistory}
            updateVitals={updateVitals}
            patientGender={patient?.gender}
            saving={saving}
            onSaveAndNext={() => handleSaveAndNext('investigation')}
          />
        );
      case 'investigation':
        return (
          <InvestigationTab 
            caseId={caseId}
            data={data}
            onOrderAdded={refresh}
            onSaveAndNext={() => handleSaveAndNext('prescription')}
          />
        );
      case 'prescription':
        return (
          <DrugsTab 
            caseId={caseId}
            data={data}
            onPrescriptionAdded={refresh}
          />
        );
      case 'procedure':
        return (
          <ProcedureTab 
            caseId={caseId}
            data={data}
            onProcedureAdded={refresh}
          />
        );
      case 'images':
        return (
          <ImageTab 
            caseId={caseId}
            data={data}
            onImageAdded={refresh}
          />
        );
      case 'diagnosis':
        return (
          <DiagnosisTab 
            caseId={caseId}
            data={data}
            onSaved={refresh}
          />
        );
      case 'final-report':
        return (
          <FinalReportTab 
            caseId={caseId}
            data={data}
            onFinalized={refresh}
          />
        );
      default:
        return null;
    }
  };

  return (
    /* 
      SCROLL ARCHITECTURE:
      - clinical-workspace  → fixed-height viewport, flex column, overflow:hidden
      - clinical-workspace-body → flex row, overflow:hidden, min-height:0
      - clinical-sidebar    → hidden scrollbar, sidebar-only scroll context
      - clinical-main-area  → flex column, overflow:hidden, min-height:0
      - Tab strip           → h-scroll-strip (hidden scrollbar, horizontal only)
      - clinical-tab-content → THE ONLY scroll container in the clinical workspace
                               Prevents nested scrollbars and page jitter.
    */
    <div className="clinical-workspace selection:bg-blue-100 selection:text-blue-900">
      {/* STICKY SESSION TOP BAR — never scrolls */}
      <SessionTopBar 
        caseNumber={data?.case?.caseNumber} 
        doctorName={data?.doctor?.name} 
        saving={saving}
        lastSaved={lastSaved}
        patientName={`${patient?.firstName || ''} ${patient?.lastName || ''}`}
        mrdNumber={patient?.mrdNumber}
        visitType={data?.case?.visitType || 'Consultation'}
        doctorId={data?.doctor?.id}
      />

      {/* SPECIAL NOTE BANNER */}
      <SpecialNote notes={specialNotes} />

      {/* BODY: Sidebar + Main */}
      <div className="clinical-workspace-body relative">
        
        {/* BILLING DRAWER */}
        <BillingSummaryPanel 
          caseId={caseId}
          isOpen={isBillingOpen} 
          onClose={() => setIsBillingOpen(false)} 
        />
        
        {/* CLINIC CHAT DRAWER */}
        <ClinicChatPanel 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
        
        {/* LEFT: Patient Side Panel — clinical-sidebar hides its scrollbar */}
        <PatientSidePanel 
          patient={patient} 
          vitals={vitals} 
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* RIGHT: Main Clinical Area — single, unified scroll context */}
        <main className="clinical-main-area bg-slate-50">
          
          {/* TAB STRIP — horizontal scroll strip, hidden scrollbar */}
          <div className="flex-shrink-0 px-8 pt-6 pb-2 bg-white border-b border-slate-100">
            <div className="h-scroll-strip">
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl w-max border border-slate-200/50 shadow-inner">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2.5 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider transition-all rounded-xl whitespace-nowrap
                      ${activeTab === tab.id 
                        ? 'bg-white text-blue-600 shadow-sm shadow-slate-200' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
                    `}
                  >
                    <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TAB CONTENT — the ONE and ONLY scroll container for the clinical workspace */}
          <div className="clinical-tab-content p-10 pb-24">
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              {renderTabContent()}
            </div>
          </div>

        </main>
      </div>

      {/* NOTIFICATION BOTTOM BAR */}
      <NotificationBar 
        caseId={caseId}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenPayments={() => setIsBillingOpen(true)}
      />
    </div>
  );
};

export default ConsultationView;
