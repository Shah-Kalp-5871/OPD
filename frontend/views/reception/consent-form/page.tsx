'use client';

import React, { useState } from 'react';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import { 
  FileSignature, 
  Printer, 
  Upload, 
  Languages, 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ClipboardCheck,
  FileCheck2
} from 'lucide-react';

const ConsentFormView = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('Hair Removal – Standard');
  const [selectedLanguage, setSelectedLanguage] = useState('Gujarati');

  const patientData = {
    name: 'Mahesh K. Kumar',
    gender: 'Male',
    age: '45',
    city: 'Surat',
    mrd: 'P03-260003',
    caseNo: 'C003-001-130426',
    procedure: 'Hair Removal Diode Laser',
    date: '13/04/2026',
    doctor: 'Dr. Raj Valaki'
  };

  const templates = [
    'Hair Removal – Standard',
    'Hair Removal – Sensitive Skin',
    'PRP – Standard',
    'Chemical Peel – Standard'
  ];

  const languages = ['Gujarati', 'Hindi', 'English'];

  return (
    <ReceptionLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* PAGE HEADER */}
        <div>
           <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
              Consent Form — <span className="text-teal-600 uppercase">{patientData.name}</span>
           </h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
              Procedure: {patientData.procedure}
           </p>
        </div>

        {/* 🔷 SECTION 1: AUTO-POPULATED DATA */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                 <ClipboardCheck className="w-4 h-4 text-slate-400" />
                 Auto-populated from Patient Profile and Procedure Selection
              </h3>
              <div className="bg-teal-100/50 text-teal-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-teal-100">
                 System Verified
              </div>
           </div>
           <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8">
                 {[
                   { label: 'Patient Name', value: patientData.name, icon: User },
                   { label: 'Gender', value: patientData.gender, icon: User },
                   { label: 'Age', value: patientData.age, icon: Calendar },
                   { label: 'City / Location', value: patientData.city, icon: MapPin },
                   { label: 'MRD No.', value: patientData.mrd, icon: FileText },
                   { label: 'OPD Case No.', value: patientData.caseNo, icon: FileText },
                   { label: 'Procedure Name', value: patientData.procedure, icon: Stethoscope },
                   { label: 'Date', value: patientData.date, icon: Calendar },
                 ].map((field, idx) => (
                   <div key={idx} className="group">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-teal-600 transition-colors">{field.label}</p>
                      <div className="flex items-center gap-2">
                         <field.icon className="w-3.5 h-3.5 text-slate-300" />
                         <p className="text-xs font-black text-slate-800 uppercase tracking-wider">{field.value}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* LEFT: SELECTION PANELS */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* 🔷 SECTION 2: TEMPLATE SELECTION */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                    <FileCheck2 className="w-4 h-4 text-slate-400" />
                    Select Template
                 </h3>
                 <div className="space-y-3">
                    {templates.map((template) => (
                      <button
                        key={template}
                        onClick={() => setSelectedTemplate(template)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all text-left group ${selectedTemplate === template ? 'bg-teal-50 border-teal-500' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                      >
                         <p className={`text-[10px] font-black uppercase tracking-widest ${selectedTemplate === template ? 'text-teal-700' : 'text-slate-500'}`}>
                            {template}
                         </p>
                      </button>
                    ))}
                 </div>
              </div>

              {/* 🔷 SECTION 3: LANGUAGE SELECTION */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                       <Languages className="w-4 h-4 text-slate-400" />
                       Language
                    </h3>
                    <div className="group relative">
                       <AlertCircle className="w-4 h-4 text-amber-500 cursor-help" />
                       <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 text-white p-3 rounded-xl text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 shadow-xl">
                          Language auto-set from patient profile. Overridable here.
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedLanguage === lang ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'}`}
                      >
                         <span className="text-[10px] font-black uppercase tracking-widest">{lang}</span>
                         {lang === 'Gujarati' && selectedLanguage !== 'Gujarati' && (
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Default</span>
                         )}
                         {selectedLanguage === lang && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* RIGHT: PREVIEW PANEL */}
           <div className="lg:col-span-8 space-y-8">
              
              {/* 🔷 SECTION 4: CONSENT FORM PREVIEW */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[700px] flex flex-col">
                 <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                    <FileSignature className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Consent Form Preview</h3>
                 </div>
                 
                 <div className="p-12 flex-1 space-y-10">
                    {/* Document Styling */}
                    <div className="border-2 border-slate-200 p-10 rounded-xl relative">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2 border-2 border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900">
                          Official Medico-Legal Document
                       </div>

                       <div className="text-center mb-10 pb-8 border-b border-slate-100">
                          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-2">
                             PATIENT CONSENT FORM – HAIR REMOVAL ({selectedLanguage.toUpperCase()})
                          </h2>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">MedFlow Clinic • Surat • Gujarat</p>
                       </div>

                       <div className="grid grid-cols-2 gap-y-6 mb-12 bg-slate-50 p-6 rounded-xl border border-slate-100">
                          <div className="space-y-1">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Patient Name</p>
                             <p className="text-[11px] font-black text-slate-800 uppercase">{patientData.name}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">MRD Number</p>
                             <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{patientData.mrd}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Case Number</p>
                             <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{patientData.caseNo}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                             <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{patientData.date}</p>
                          </div>
                          <div className="space-y-1 col-span-2 pt-4 border-t border-slate-200">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Procedure & Doctor</p>
                             <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
                                {patientData.procedure} — <span className="text-teal-600">{patientData.doctor}</span>
                             </p>
                          </div>
                       </div>

                       <div className="space-y-6 text-xs text-slate-600 leading-relaxed text-justify mb-16 px-4">
                          <p className="font-bold text-slate-800">1. Nature of the Procedure:</p>
                          <p>
                             I, <span className="font-black text-slate-900 uppercase">{patientData.name}</span>, hereby authorize the clinic to perform the procedure described as <span className="font-black text-slate-900 uppercase">{patientData.procedure}</span>. I understand the procedure involves medical risks and potential side effects which have been explained to me in <span className="font-black text-slate-900 uppercase underline decoration-teal-500 decoration-2">{selectedLanguage}</span>.
                          </p>
                          <p className="bg-slate-50 p-4 rounded-lg italic border-l-4 border-slate-200">
                             [ Consent form body text in {selectedLanguage} for template: {selectedTemplate} ]
                          </p>
                          <p>
                             I confirm that I have had the opportunity to ask questions and have received satisfactory answers. I am signing this form voluntarily and understand its legal implications.
                          </p>
                       </div>

                       <div className="grid grid-cols-2 gap-12 mt-20 pt-10 border-t border-slate-100">
                          <div className="space-y-4">
                             <div className="h-16 border-b border-slate-300 w-full relative">
                                <span className="absolute bottom-2 left-0 text-[8px] font-black text-slate-300 uppercase tracking-widest">Patient Signature Placeholder</span>
                             </div>
                             <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Patient Signature</p>
                          </div>
                          <div className="space-y-4">
                             <div className="h-16 border-b border-slate-300 w-full relative">
                                <span className="absolute bottom-2 left-0 text-[8px] font-black text-slate-300 uppercase tracking-widest">Official Clinic Seal / Doctor Signature</span>
                             </div>
                             <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Doctor Signature</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* ACTION BAR */}
                 <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                    <button className="flex-1 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3">
                       <Printer className="w-5 h-5" />
                       Print Consent Form
                    </button>
                    <button className="flex-1 py-5 bg-white border-2 border-slate-200 text-slate-800 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group">
                       <Upload className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                       Upload Signed Form
                    </button>
                    <button className="px-10 py-5 bg-teal-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-teal-700 transition-all shadow-xl shadow-teal-100">
                       Change Template
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default ConsentFormView;
