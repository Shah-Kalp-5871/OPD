import React, { useState, useEffect } from 'react';
import { History, Activity, Save, Copy, FileClock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Patient, Vital } from '../../types';
import ComplaintsForm, { VisitComplaintData } from '../../../../check-in/components/ComplaintsForm';

interface ClinicalDataTabProps {
  patient: Patient;
  onSaveClinicalData: (data: any) => Promise<void>;
}

const ClinicalDataTab: React.FC<ClinicalDataTabProps> = ({ patient, onSaveClinicalData }) => {
  const router = useRouter();
  const cases = patient?.cases || [];
  
  // Sort cases to show latest first
  const sortedCases = [...cases].sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const [selectedCaseId, setSelectedCaseId] = useState<string>(sortedCases[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);

  // Vitals State
  const [vitals, setVitals] = useState({
    temp: '',
    pulse: '',
    bpSys: '',
    bpDia: '',
    weight: '',
    height: '',
    spo2: '',
    bmi: '0.0'
  });

  // Complaints State
  const [visitComplaint, setVisitComplaint] = useState<VisitComplaintData>({
    presentComplaint: '',
    durationDays: '',
    durationMonths: '',
    durationYears: '',
    severity: 'MODERATE',
    onset: '',
    aggravatingFactors: '',
    relievingFactors: '',
    pastMedical: '',
    pastSurgical: '',
    personalHistory: '',
    obstetricHistory: '',
    currentMedications: '',
    allergies: '',
    nursingNotes: '',
    patientFeedback: ''
  });

  useEffect(() => {
    if (sortedCases.length > 0 && !selectedCaseId) {
      setSelectedCaseId(sortedCases[0].id);
    }
  }, [sortedCases, selectedCaseId]);

  // Load existing data if any when case changes
  useEffect(() => {
    const selectedCase = cases.find((c: any) => c.id === selectedCaseId);
    
    // Load Vitals
    const caseVitals = patient.vitals?.find((v: any) => v.caseId === selectedCaseId);
    if (caseVitals) {
      const bpParts = (caseVitals.bloodPressure || '').split('/');
      setVitals({
        temp: caseVitals.temperature?.toString() || '',
        pulse: caseVitals.pulse?.toString() || '',
        bpSys: bpParts[0] || '',
        bpDia: bpParts[1] || '',
        weight: caseVitals.weight?.toString() || '',
        height: caseVitals.height?.toString() || '',
        spo2: caseVitals.spo2?.toString() || '',
        bmi: caseVitals.bmi?.toString() || '0.0'
      });
    } else {
      setVitals({ temp: '', pulse: '', bpSys: '', bpDia: '', weight: '', height: '', spo2: '', bmi: '0.0' });
    }

    // Load Complaints
    if (selectedCase) {
      const c = (selectedCase as any).visitComplaint || {};
      const history = (selectedCase as any).consultationRecord?.history || {};
      
      setVisitComplaint({
        presentComplaint: c.presentComplaint || '',
        durationDays: c.durationDays?.toString() || '',
        durationMonths: c.durationMonths?.toString() || '',
        durationYears: c.durationYears?.toString() || '',
        severity: c.severity || 'MODERATE',
        onset: c.onset || '',
        aggravatingFactors: c.aggravatingFactors || '',
        relievingFactors: c.relievingFactors || '',
        pastMedical: history.pastHistory || c.pastMedical || '',
        pastSurgical: history.surgicalHistory || c.pastSurgical || '',
        personalHistory: history.personalHistory || c.personalHistory || '',
        obstetricHistory: history.obstetricHistory || c.obstetricHistory || '',
        currentMedications: history.currentMedications || c.currentMedications || '',
        allergies: history.allergies || c.allergies || '',
        nursingNotes: c.nursingNotes || '',
        patientFeedback: c.patientFeedback || ''
      });
    } else {
      setVisitComplaint({
        presentComplaint: '', durationDays: '', durationMonths: '', durationYears: '',
        severity: 'MODERATE', onset: '', aggravatingFactors: '', relievingFactors: '',
        pastMedical: '', pastSurgical: '', personalHistory: '', obstetricHistory: '',
        currentMedications: '', allergies: '', nursingNotes: '', patientFeedback: ''
      });
    }
  }, [selectedCaseId, cases, patient.vitals]);

  useEffect(() => {
    if (vitals.height && vitals.weight) {
      const h = parseFloat(vitals.height) / 100;
      const w = parseFloat(vitals.weight);
      if (h > 0) {
        setVitals(prev => ({ ...prev, bmi: (w / (h * h)).toFixed(1) }));
      }
    }
  }, [vitals.height, vitals.weight]);

  const handleSameAsPrevious = () => {
    const currentIndex = sortedCases.findIndex((c: any) => c.id === selectedCaseId);
    if (currentIndex >= 0 && currentIndex + 1 < sortedCases.length) {
      const prevCaseId = sortedCases[currentIndex + 1].id;
      // Load Vitals from previous case
      const caseVitals = patient.vitals?.find((v: any) => v.caseId === prevCaseId);
      if (caseVitals) {
        const bpParts = (caseVitals.bloodPressure || '').split('/');
        setVitals({
          temp: caseVitals.temperature?.toString() || '',
          pulse: caseVitals.pulse?.toString() || '',
          bpSys: bpParts[0] || '',
          bpDia: bpParts[1] || '',
          weight: caseVitals.weight?.toString() || '',
          height: caseVitals.height?.toString() || '',
          spo2: caseVitals.spo2?.toString() || '',
          bmi: caseVitals.bmi?.toString() || '0.0'
        });
      }
      
      // Load Complaints from previous case
      const prevCase = cases.find((c: any) => c.id === prevCaseId);
      if (prevCase && (prevCase as any).visitComplaint) {
        const c = (prevCase as any).visitComplaint;
        setVisitComplaint({
          presentComplaint: c.presentComplaint || '',
          durationDays: c.durationDays?.toString() || '',
          durationMonths: c.durationMonths?.toString() || '',
          durationYears: c.durationYears?.toString() || '',
          severity: c.severity || 'MODERATE',
          onset: c.onset || '',
          aggravatingFactors: c.aggravatingFactors || '',
          relievingFactors: c.relievingFactors || '',
          pastMedical: c.pastMedical || '',
          pastSurgical: c.pastSurgical || '',
          personalHistory: c.personalHistory || '',
          obstetricHistory: c.obstetricHistory || '',
          currentMedications: c.currentMedications || '',
          allergies: c.allergies || '',
          nursingNotes: c.nursingNotes || '',
          patientFeedback: c.patientFeedback || ''
        });
      }
      toast.success('Loaded data from previous visit');
    } else {
      toast.error('No previous visit found');
    }
  };

  const handleSave = async (skipEmpty: boolean = false) => {
    if (!selectedCaseId) return;
    setIsSaving(true);
    try {
      const bpString = vitals.bpSys && vitals.bpDia
        ? `${vitals.bpSys}/${vitals.bpDia}`
        : vitals.bpSys ? vitals.bpSys : null;

      const vData = {
          height: parseFloat(vitals.height) || null,
          weight: parseFloat(vitals.weight) || null,
          bmi: parseFloat(vitals.bmi) || null,
          temperature: parseFloat(vitals.temp) || null,
          pulse: parseInt(vitals.pulse) || null,
          bloodPressure: bpString,
          spo2: parseInt(vitals.spo2) || null
      };

      const vcData = {
          ...visitComplaint,
          durationDays: parseInt(visitComplaint.durationDays) || null,
          durationMonths: parseInt(visitComplaint.durationMonths) || null,
          durationYears: parseInt(visitComplaint.durationYears) || null,
      };

      const payload = {
        caseId: selectedCaseId,
        vitals: vData,
        complaint: vcData
      };

      await onSaveClinicalData(payload);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
            <History className="w-4 h-4 text-orange-600" />
            Complaints & Vitals
          </h3>
          <div className="flex items-center gap-3">
            {sortedCases.length > 0 && (
              <div className="flex items-center gap-2 mr-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Recording for Case:</span>
                <span className="text-xs font-black text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                  {sortedCases.find((c: any) => c.id === selectedCaseId)?.caseNumber || 'N/A'} 
                </span>
              </div>
            )}
            {sortedCases.findIndex((c: any) => c.id === selectedCaseId) + 1 < sortedCases.length && (
              <button onClick={handleSameAsPrevious} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors">
                <Copy className="w-3 h-3" /> Same as Previous
              </button>
            )}
            <button onClick={() => router.push(`/reception/patients/${patient.id}/history`)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-sm">
              <FileClock className="w-3 h-3" /> View History
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Complaints Section */}
          <section>
            <h4 className="text-sm font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2">Complaints & History</h4>
            <ComplaintsForm data={visitComplaint} onChange={setVisitComplaint} />
          </section>

          {/* Vitals Section */}
          <section>
            <h4 className="text-sm font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-600"/> Vitals
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 items-end">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Temp (°F)</label>
                <input type="text" value={vitals.temp} onChange={e => setVitals({...vitals, temp: e.target.value.replace(/[^0-9.]/g, '')})} className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-center" placeholder="98.6" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Pulse (BPM)</label>
                <input type="text" value={vitals.pulse} onChange={e => setVitals({...vitals, pulse: e.target.value.replace(/[^0-9]/g, '')})} className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-center" placeholder="72" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Sys (mmHg)</label>
                <input type="text" value={vitals.bpSys} onChange={e => setVitals({...vitals, bpSys: e.target.value.replace(/[^0-9]/g, '')})} className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-center" placeholder="120" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Dia (mmHg)</label>
                <input type="text" value={vitals.bpDia} onChange={e => setVitals({...vitals, bpDia: e.target.value.replace(/[^0-9]/g, '')})} className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-center" placeholder="80" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Weight (kg)</label>
                <input type="text" value={vitals.weight} onChange={e => setVitals({...vitals, weight: e.target.value.replace(/[^0-9.]/g, '')})} className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-center" placeholder="70" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Height (cm)</label>
                <input type="text" value={vitals.height} onChange={e => setVitals({...vitals, height: e.target.value.replace(/[^0-9.]/g, '')})} className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-center" placeholder="170" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">SpO2 (%)</label>
                <input type="text" value={vitals.spo2} onChange={e => setVitals({...vitals, spo2: e.target.value.replace(/[^0-9]/g, '')})} className="w-full px-3 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-center" placeholder="98" />
              </div>
              
              {/* BMI inline block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide text-center block">BMI</label>
                <div className="w-full h-[42px] flex items-center justify-center bg-slate-100 border border-slate-200/60 rounded-xl">
                  <span className="text-sm font-black text-slate-800">{vitals.bmi}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Save Button */}
          <div className="pt-5 flex justify-end gap-3">
            <button 
              onClick={() => handleSave(true)}
              disabled={isSaving || !selectedCaseId}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                (!isSaving && selectedCaseId) ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-sm' : 'bg-slate-50 text-slate-400 cursor-not-allowed'
              }`}
            >
              Skip / Save Empty
            </button>
            <button 
              onClick={() => handleSave(false)}
              disabled={isSaving || !selectedCaseId}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                (!isSaving && selectedCaseId) ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Clinical Data'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClinicalDataTab;
