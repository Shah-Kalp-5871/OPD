'use client';

import React, { useState } from 'react';
import SessionTopBar from './components/SessionTopBar';
import PatientSidePanel from './components/PatientSidePanel';
import ComplaintsTab from './components/ComplaintsTab';
import { useConsultation } from './hooks/useConsultation';
import { 
  FileText, 
  Search, 
  Pill, 
  FlaskConical, 
  Scissors, 
  Calendar, 
  Settings,
  Loader2
} from 'lucide-react';

interface ConsultationViewProps {
  caseId: string;
}

const TABS = [
  { id: 'complaints', label: 'Complaints', icon: FileText },
  { id: 'examination', label: 'Examination', icon: Search },
  { id: 'diagnosis', label: 'Diagnosis', icon: Settings },
  { id: 'prescription', label: 'Prescription', icon: Pill },
  { id: 'investigation', label: 'Investigations', icon: FlaskConical },
  { id: 'procedure', label: 'Procedures', icon: Scissors },
  { id: 'followup', label: 'Follow Up', icon: Calendar },
];

const ConsultationView: React.FC<ConsultationViewProps> = ({ caseId }) => {
  const { 
    data, 
    loading, 
    saving, 
    lastSaved, 
    updateComplaint, 
    updateHistory 
  } = useConsultation(caseId);
  
  const [activeTab, setActiveTab] = useState('complaints');

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-slate-400 font-medium">Initializing Clinical Workspace...</p>
        </div>
      </div>
    );
  }

  const patient = data?.case?.patient;
  const vitals = patient?.vitals || [];

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <SessionTopBar 
        caseNumber={data?.case?.caseNumber} 
        doctorName={data?.doctor?.name} 
        saving={saving}
        lastSaved={lastSaved}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Patient Info */}
        <PatientSidePanel patient={patient} vitals={vitals} />

        {/* Main Clinical Area */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Tabs Navigation */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 flex items-center overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2
                  ${activeTab === tab.id 
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}
                `}
                disabled={tab.id !== 'complaints'} // Lock other tabs for Phase 1
              >
                <tab.icon className={`w-4 h-4 ${tab.id !== 'complaints' ? 'opacity-30' : ''}`} />
                <span className={tab.id !== 'complaints' ? 'opacity-30' : ''}>{tab.label}</span>
                {tab.id !== 'complaints' && (
                  <span className="text-[10px] bg-slate-800 px-1.5 rounded text-slate-600">Soon</span>
                )}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'complaints' ? (
              <ComplaintsTab 
                data={data} 
                updateComplaint={updateComplaint} 
                updateHistory={updateHistory}
                patientGender={patient?.gender}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-700 font-bold uppercase tracking-widest italic">
                Tab under development
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationView;
