'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ReceptionLayout from '@/views/layouts/ReceptionLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
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
  FileCheck2,
  Loader2
} from 'lucide-react';

const TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    officialDoc: 'Official Medico-Legal Document',
    patientConsentForm: 'PATIENT CONSENT FORM',
    patientName: 'Patient Name',
    mrdNumber: 'MRD Number',
    caseNumber: 'Case Number',
    date: 'Date',
    patientSignaturePlaceholder: 'Patient Signature Placeholder',
    patientSignature: 'Patient Signature',
    doctorSignaturePlaceholder: 'Official Clinic Seal / Doctor Signature',
    doctorSignature: 'Doctor Signature',
    uploadSignature: 'Upload Patient Signature (optional)',
    printConsent: 'Print Consent Form',
    recordConsent: 'Record Signed Consent',
    selectTemplate: 'Select a template to view content'
  },
  Hindi: {
    officialDoc: 'आधिकारिक चिकित्सा-कानूनी दस्तावेज',
    patientConsentForm: 'रोगी सहमति पत्र',
    patientName: 'रोगी का नाम',
    mrdNumber: 'एमआरडी नंबर',
    caseNumber: 'केस नंबर',
    date: 'दिनांक',
    patientSignaturePlaceholder: 'रोगी के हस्ताक्षर का स्थान',
    patientSignature: 'रोगी के हस्ताक्षर',
    doctorSignaturePlaceholder: 'आधिकारिक क्लिनिक सील / डॉक्टर के हस्ताक्षर',
    doctorSignature: 'डॉक्टर के हस्ताक्षर',
    uploadSignature: 'रोगी के हस्ताक्षर अपलोड करें (वैकल्पिक)',
    printConsent: 'सहमति पत्र प्रिंट करें',
    recordConsent: 'हस्ताक्षरित सहमति दर्ज करें',
    selectTemplate: 'सामग्री देखने के लिए टेम्पलेट चुनें'
  },
  Gujarati: {
    officialDoc: 'અધિકૃત મેડિકો-લીગલ દસ્તાવેજ',
    patientConsentForm: 'દર્દી સંમતિ પત્રક',
    patientName: 'દર્દીનું નામ',
    mrdNumber: 'એમઆરડી નંબર',
    caseNumber: 'કેસ નંબર',
    date: 'તારીખ',
    patientSignaturePlaceholder: 'દર્દીની સહી માટેની જગ્યા',
    patientSignature: 'દર્દીની સહી',
    doctorSignaturePlaceholder: 'અધિકૃત ક્લિનિક સીલ / ડૉક્ટરની સહી',
    doctorSignature: 'ડૉક્ટરની સહી',
    uploadSignature: 'દર્દીની સહી અપલોડ કરો (વૈકલ્પિક)',
    printConsent: 'સંમતિ પત્રક પ્રિન્ટ કરો',
    recordConsent: 'સહી કરેલ સંમતિ રેકોર્ડ કરો',
    selectTemplate: 'સામગ્રી જોવા માટે ટેમ્પલેટ પસંદ કરો'
  }
};

const ConsentFormView = () => {
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId');

  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [saving, setSaving] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const languages = ['Gujarati', 'Hindi', 'English'];

  useEffect(() => {
    fetchData();
  }, [caseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Templates
      const templatesRes = await api.get('/consent/templates');
      const templatesData = Array.isArray(templatesRes) ? templatesRes : (templatesRes as any).data || [];
      setTemplates(templatesData);
      if (templatesData.length > 0) {
        setSelectedTemplate(templatesData[0]);
      }

      // 2. Fetch Patient/Case Data if caseId exists
      if (caseId) {
        const caseRes = await api.get(`/consultation/${caseId}`);
        const data = (caseRes as any).data || caseRes;
        setPatientData(data);
      }
    } catch (error) {
      console.error('Error fetching consent data:', error);
      toast.error('Failed to load consent data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConsent = async () => {
    if (!caseId || !selectedTemplate) return;
    
    try {
      setSaving(true);
      setUploadProgress(0);
      setUploadError(null);
      const formData = new FormData();
      formData.append('templateId', selectedTemplate.id);
      if (signatureFile) {
        formData.append('signature', signatureFile);
      }

      await api.post(`/consent/case/${caseId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            setUploadProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });
      toast.success('Consent form recorded successfully');
      setSignatureFile(null);
    } catch (error: any) {
      console.error('Error saving consent:', error);
      const message = error?.response?.data?.message || 'Failed to save consent form';
      setUploadError(Array.isArray(message) ? message.join(', ') : message);
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignatureFileChange = (file?: File) => {
    if (!file) {
      setSignatureFile(null);
      return;
    }

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Signature must be a PDF, PNG, or JPEG file');
      toast.error('Signature must be a PDF, PNG, or JPEG file');
      return;
    }

    setSignatureFile(file);
    setUploadProgress(0);
    setUploadError(null);
  };

  if (loading) {
    return (
      <ReceptionLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Initialising Consent Engine...</p>
        </div>
      </ReceptionLayout>
    );
  }

  if (!caseId) {
    return (
      <ReceptionLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <AlertCircle className="w-12 h-12 text-amber-500" />
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">No Patient Case Selected</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Please select a patient from the queue first.</p>
        </div>
      </ReceptionLayout>
    );
  }

  const patientInfo = patientData?.case?.patient;
  const patientProfile = patientInfo?.profile;
  const procedure = patientData?.case?.procedureSessions?.[0]?.procedure?.name || 'N/A';
  const doctorName = patientData?.case?.doctor?.name || 'Assigned Consultant';

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.English;

  return (
    <ReceptionLayout>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* PAGE HEADER */}
        <div>
           <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
              Consent Form — <span className="text-teal-600 uppercase">{patientInfo?.firstName} {patientInfo?.lastName}</span>
           </h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
              Procedure: {procedure}
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
                   { label: 'Patient Name', value: `${patientInfo?.firstName || ''} ${patientInfo?.lastName || ''}`.trim() || 'N/A', icon: User },
                   { label: 'Gender', value: patientInfo?.gender || 'N/A', icon: User },
                   { label: 'Age', value: patientProfile?.age?.toString() || 'N/A', icon: Calendar },
                   { label: 'City / Location', value: patientProfile?.city || 'N/A', icon: MapPin },
                   { label: 'MRD No.', value: patientInfo?.mrdNumber || 'N/A', icon: FileText },
                   { label: 'OPD Case No.', value: patientData?.case?.caseNumber || 'N/A', icon: FileText },
                   { label: 'Procedure Name', value: procedure, icon: Stethoscope },
                   { label: 'Date', value: new Date().toLocaleDateString(), icon: Calendar },
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
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all text-left group ${selectedTemplate?.id === template.id ? 'bg-teal-50 border-teal-500' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                      >
                         <p className={`text-[10px] font-black uppercase tracking-widest ${selectedTemplate?.id === template.id ? 'text-teal-700' : 'text-slate-500'}`}>
                            {template.name}
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
                 </div>
                 <div className="flex flex-col gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedLanguage === lang ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'}`}
                      >
                         <span className="text-[10px] font-black uppercase tracking-widest">{lang}</span>
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
                    <div className="border-2 border-slate-200 p-10 rounded-xl relative print-area">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2 border-2 border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 no-print">
                          {t.officialDoc}
                       </div>

                       <div className="text-center mb-10 pb-8 border-b border-slate-100">
                          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-2">
                             {selectedTemplate?.name || t.patientConsentForm} ({selectedLanguage.toUpperCase()})
                          </h2>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">MedFlow Clinic • Enterprise Grade Management</p>
                       </div>

                       <div className="grid grid-cols-2 gap-y-6 mb-12 bg-slate-50 p-6 rounded-xl border border-slate-100">
                          <div className="space-y-1">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.patientName}</p>
                             <p className="text-[11px] font-black text-slate-800 uppercase">{patientInfo?.firstName} {patientInfo?.lastName}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.mrdNumber}</p>
                             <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{patientInfo?.mrdNumber || 'N/A'}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.caseNumber}</p>
                             <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{patientData?.case?.caseNumber || 'N/A'}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.date}</p>
                             <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
                          </div>
                       </div>

                       <div className="space-y-6 text-xs text-slate-600 leading-relaxed text-justify mb-16 px-4">
                          <div 
                            className="consent-content"
                            dangerouslySetInnerHTML={{ __html: selectedTemplate?.contentHtml || `<p>${t.selectTemplate}</p>` }}
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-12 mt-20 pt-10 border-t border-slate-100">
                          <div className="space-y-4">
                             <div className="h-16 border-b border-slate-300 w-full relative">
                                <span className="absolute bottom-2 left-0 text-[8px] font-black text-slate-300 uppercase tracking-widest">{t.patientSignaturePlaceholder}</span>
                             </div>
                             <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{t.patientSignature}</p>
                          </div>
                          <div className="space-y-4">
                             <div className="h-16 border-b border-slate-300 w-full relative">
                                <span className="absolute bottom-2 left-0 text-[8px] font-black text-slate-300 uppercase tracking-widest">{t.doctorSignaturePlaceholder}</span>
                             </div>
                             <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{t.doctorSignature}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* ACTION BAR */}
                 <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                       <label className="flex-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {t.uploadSignature}
                          <input
                            type="file"
                            accept="application/pdf,image/png,image/jpeg,.pdf,.png,.jpg,.jpeg"
                            disabled={saving}
                            onChange={(e) => {
                              handleSignatureFileChange(e.target.files?.[0]);
                              e.target.value = '';
                            }}
                            className="mt-2 block w-full text-xs text-slate-700"
                          />
                       </label>
                       {signatureFile && (
                         <p className="text-[10px] font-black uppercase tracking-widest text-teal-700">
                           {signatureFile.name} ({(signatureFile.size / 1024).toFixed(1)} KB)
                         </p>
                       )}
                    </div>
                    {saving && signatureFile && (
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full bg-teal-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                    {uploadError && (
                      <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">
                        {uploadError}
                      </p>
                    )}
                    <div className="flex flex-col md:flex-row gap-4">
                       <button 
                         onClick={() => window.print()}
                         className="flex-1 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3"
                       >
                          <Printer className="w-5 h-5" />
                          {t.printConsent}
                       </button>
                       <button 
                         onClick={handleSaveConsent}
                         disabled={saving}
                         className="flex-1 py-5 bg-teal-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 disabled:opacity-50 flex items-center justify-center gap-3"
                       >
                          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSignature className="w-5 h-5" />}
                          {saving && signatureFile ? `Uploading ${uploadProgress}%` : t.recordConsent}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default ConsentFormView;
