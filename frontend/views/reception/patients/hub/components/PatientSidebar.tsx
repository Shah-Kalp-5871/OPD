import React from 'react';
import { 
  FileText, 
  Activity, 
  History, 
  Stethoscope, 
  CreditCard, 
  UserCircle,
  FolderOpen,
  FileSignature
} from 'lucide-react';

import { Patient } from '../types';

interface PatientSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  patient?: Patient;
}

const PatientSidebar: React.FC<PatientSidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  patient
}) => {
  const sections = [
    { id: 'overview', label: 'File Overview', icon: FolderOpen },
    { id: 'cases', label: 'Clinical History', icon: History },
    { id: 'vitals', label: 'Medical Vitals', icon: Activity },
    { id: 'documents', label: 'Reports & Files', icon: FileText },
    { id: 'billing', label: 'Billing Records', icon: CreditCard },
    { id: 'consent', label: 'Consent Forms', icon: FileSignature },
    { id: 'profile', label: 'Patient Profile', icon: UserCircle },
  ];

  const hasAllergies = patient?.profile?.allergies && patient.profile.allergies.trim().toLowerCase() !== 'none' && patient.profile.allergies.trim().toLowerCase() !== 'none reported';

  return (
    <div className="lg:col-span-3 space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Chart Sections</h3>
        </div>
        <div className="p-2 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all ${
                activeTab === section.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <section.icon className={`w-4 h-4 ${activeTab === section.id ? 'text-teal-400' : 'text-slate-400'}`} />
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clinical Notes Shortcut Placeholder */}
      <div className={`p-5 border rounded-xl space-y-3 ${hasAllergies ? 'bg-red-50 border-red-200' : 'bg-rose-50 border-rose-100'}`}>
        <div className={`flex items-center gap-2 ${hasAllergies ? 'text-red-700' : 'text-rose-700'}`}>
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Clinical Alerts</span>
        </div>
        <p className={`text-[10px] font-bold uppercase leading-relaxed ${hasAllergies ? 'text-red-600' : 'text-rose-600/70'}`}>
          {hasAllergies ? (
            <span className="block whitespace-pre-line text-xs">
              ⚠️ CRITICAL ALLERGIES:<br/>
              {patient.profile?.allergies}
            </span>
          ) : (
            'No critical drug allergies or medical conditions reported in file.'
          )}
        </p>
      </div>
    </div>
  );
};

export default PatientSidebar;
