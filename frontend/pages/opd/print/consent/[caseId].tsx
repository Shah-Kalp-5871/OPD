import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '@/lib/api';

const PrintConsent = () => {
  const router = useRouter();
  const { caseId } = router.query;
  const [data, setData] = useState<any>(null);
  const [consentData, setConsentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) return;
    
    Promise.all([
      api.get(`/reception/cases/${caseId}`),
      api.get(`/consent/case/${caseId}`)
    ])
      .then(([caseRes, consentRes]) => {
        setData(caseRes);
        if (consentRes.data && consentRes.data.length > 0) {
          // Use the most recent consent form
          setConsentData(consentRes.data[consentRes.data.length - 1]);
        }
        setLoading(false);
        // Automatically open print dialog after brief delay
        setTimeout(() => window.print(), 500);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [caseId]);

  if (loading) {
    return <div className="p-10 text-center font-bold">Loading...</div>;
  }

  if (!data) {
    return <div className="p-10 text-center text-red-500 font-bold">Failed to load case data</div>;
  }

  const { patient } = data;

  return (
    <div className="bg-white min-h-screen text-slate-900 p-8">
      <Head>
        <title>Consent Form - {patient?.firstName} {patient?.lastName}</title>
      </Head>
      
      <div className="max-w-4xl mx-auto border-2 border-slate-900 p-10">
        <div className="text-center mb-10 border-b-2 border-slate-900 pb-6">
          <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Patient Consent Form</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Klinic Healthcare</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
          <div>
            <p className="font-bold uppercase tracking-widest text-slate-500 text-xs mb-1">Patient Name</p>
            <p className="font-black text-lg">{patient?.firstName} {patient?.lastName}</p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-widest text-slate-500 text-xs mb-1">MRD Number</p>
            <p className="font-black text-lg">{patient?.mrdNumber}</p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-widest text-slate-500 text-xs mb-1">Date</p>
            <p className="font-black">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-widest text-slate-500 text-xs mb-1">Case Number</p>
            <p className="font-black">{data.caseNumber}</p>
          </div>
        </div>

        <div className="mb-10 text-justify leading-relaxed">
          <p className="mb-4">
            I, the undersigned, hereby give my consent for the proposed clinical procedures and treatments to be performed by the medical staff at Klinic Healthcare.
          </p>
          <p className="mb-4">
            I acknowledge that the nature of the procedure, its purpose, potential risks, and alternative treatments have been fully explained to me. I have had the opportunity to ask questions and all my questions have been answered to my satisfaction.
          </p>

          {consentData?.customRisks && (
            <div className="mb-4 p-4 border border-slate-300 bg-slate-50">
              <p className="font-bold uppercase tracking-widest text-xs mb-2">Specific Risks & Complications</p>
              <p className="text-sm whitespace-pre-wrap">{consentData.customRisks}</p>
            </div>
          )}

          {consentData?.doctorNotes && (
            <div className="mb-4 p-4 border border-slate-300 bg-slate-50">
              <p className="font-bold uppercase tracking-widest text-xs mb-2">Doctor's Notes</p>
              <p className="text-sm whitespace-pre-wrap">{consentData.doctorNotes}</p>
            </div>
          )}

          <p className="mb-4">
            I understand that the practice of medicine and surgery is not an exact science and I acknowledge that no guarantees or assurances have been made to me concerning the results of the procedure.
          </p>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-10">
          <div className="border-t-2 border-slate-900 pt-2 text-center">
            <p className="font-black uppercase tracking-widest text-sm">Signature of Patient/Guardian</p>
            <p className="font-bold text-xs text-slate-500 mt-1">Date: _________________</p>
          </div>
          <div className="border-t-2 border-slate-900 pt-2 text-center">
            <p className="font-black uppercase tracking-widest text-sm">Signature of Doctor</p>
            <p className="font-bold text-xs text-slate-500 mt-1">Date: _________________</p>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none; }
        }
      `}</style>
    </div>
  );
};

export default PrintConsent;
