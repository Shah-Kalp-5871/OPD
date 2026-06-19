'use client';

import React, { useState } from 'react';
import SessionTopBar from './components/SessionTopBar';
import PatientSidePanel from './components/PatientSidePanel';
import ComplaintsTab from './components/ComplaintsTab';
import InvestigationsTab from './components/InvestigationsTab';
import PrescriptionTab from './components/PrescriptionTab';
import ProceduresTab from './components/ProceduresTab';
import ImagesTab from './components/ImagesTab';
import DiagnosisTab from './components/DiagnosisTab';
import FinalReportTab from './components/FinalReportTab';
import SpecialNote, { NoteItem } from './components/SpecialNote';
import BillingSummaryPanel from './components/BillingSummaryPanel';
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
  { id: 'complaints',    label: 'Chief Complaints',    icon: FileText },
  { id: 'diagnosis',     label: 'Clinical Diagnosis',  icon: ClipboardList },
  { id: 'prescription',  label: 'E-Prescription',      icon: Pill },
  { id: 'investigation', label: 'Lab & Radiology',     icon: FlaskConical },
  { id: 'procedure',     label: 'Clinical Procedures', icon: Scissors },
  { id: 'images',        label: 'Visual Evidence',     icon: Camera },
  { id: 'final-report',  label: 'Visit Summary',       icon: CheckSquare },
];

const ConsultationView: React.FC<ConsultationViewProps> = ({ caseId }) => {
  const { 
    data, 
    loading, 
    saving, 
    lastSaved, 
    updateComplaint, 
    updateHistory,
    refresh
  } = useConsultation(caseId);
  
  const [activeTab, setActiveTab] = useState('complaints');
  const [isBillingOpen, setIsBillingOpen] = useState(false);

  // Mock Special Notes for demonstration
  const specialNotes: NoteItem[] = [
    { id: '1', type: 'appointment', message: 'Delayed Appointment, 10 days delay period (Fever)', timestamp: new Date() },
    { id: '2', type: 'drug', message: '(S) Tab Levocip advised but patient did not take', timestamp: new Date() }
  ];

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
  const vitals = patient?.vitals || [];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'complaints':
        return (
          <ComplaintsTab 
            data={data} 
            updateComplaint={updateComplaint} 
            updateHistory={updateHistory}
            patientGender={patient?.gender}
          />
        );
      case 'investigation':
        return (
          <InvestigationsTab 
            caseId={caseId}
            data={data}
            onOrderAdded={refresh}
          />
        );
      case 'prescription':
        return (
          <PrescriptionTab 
            caseId={caseId}
            data={data}
            onPrescriptionAdded={refresh}
          />
        );
      case 'procedure':
        return (
          <ProceduresTab 
            caseId={caseId}
            data={data}
            onProcedureAdded={refresh}
          />
        );
      case 'images':
        return (
          <ImagesTab 
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
        patientName={`${patient?.firstName} ${patient?.lastName}`}
        mrdNumber={patient?.mrdNumber}
        visitType="OPD Consultation"
      />

      {/* SPECIAL NOTE BANNER */}
      <SpecialNote notes={specialNotes} />

      {/* BODY: Sidebar + Main */}
      <div className="clinical-workspace-body relative">
        
        {/* BILLING DRAWER */}
        <BillingSummaryPanel 
          isOpen={isBillingOpen} 
          onClose={() => setIsBillingOpen(false)} 
        />
        
        {/* LEFT: Patient Side Panel — clinical-sidebar hides its scrollbar */}
        <PatientSidePanel patient={patient} vitals={vitals} />

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
        onOpenChat={() => console.log('Open Chat')}
        onOpenPayments={() => setIsBillingOpen(true)}
      />
    </div>
  );
};

export default ConsultationView;
