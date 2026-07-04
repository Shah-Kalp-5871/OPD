import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  FileText, 
  Clock, 
  AlertCircle, 
  Zap, 
  Stethoscope,
  Users,
  Scissors,
  Activity,
  Baby,
  Pill,
  History as HistoryIcon,
  Search,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Card, SectionHeader, TextArea, Input, Badge } from './ClinicalDesignSystem';

interface ComplaintsTabProps {
  data: any;
  updateComplaint: (field: string, value: any) => void;
  updateHistory: (field: string, value: any) => void;
  updateVitals: (field: string, value: any) => void;
  patientGender: string;
  saving?: boolean;
  onSaveAndNext?: () => void;
}

const ComplaintsTab: React.FC<ComplaintsTabProps> = ({ 
  data, 
  updateComplaint, 
  updateHistory,
  updateVitals,
  patientGender,
  saving,
  onSaveAndNext
}) => {
  const complaint = data?.complaint || {};
  const history = data?.history || {};
  const vitals = data?.vitals || {};
  const patientId = data?.case?.patientId;
  const currentCaseId = data?.case?.id;

  const [pastCases, setPastCases] = useState<any[]>([]);
  const [loadingPast, setLoadingPast] = useState(false);

  useEffect(() => {
    if (patientId) {
      fetchPastCases();
    }
  }, [patientId]);

  const fetchPastCases = async () => {
    try {
      setLoadingPast(true);
      const res = await api.get(`/patients/${patientId}`);
      if (res.data?.cases) {
        // Filter out the current case and sort by date descending
        const previous = res.data.cases
          .filter((c: any) => c.id !== currentCaseId)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPastCases(previous);
      }
    } catch (err) {
      console.error('Failed to load past complaints', err);
    } finally {
      setLoadingPast(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Vitals Section */}
      <Card 
        title="Patient Vitals" 
        subtitle="Editable vitals taken during this session."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Input label="Height (cm)" type="number" value={vitals.height || ''} onChange={(e) => updateVitals('height', parseFloat(e.target.value))} placeholder="cm" />
          <Input label="Weight (kg)" type="number" value={vitals.weight || ''} onChange={(e) => updateVitals('weight', parseFloat(e.target.value))} placeholder="kg" />
          <Input label="BMI" type="number" value={vitals.bmi || ''} onChange={(e) => updateVitals('bmi', parseFloat(e.target.value))} placeholder="Auto" disabled />
          <Input label="Temp (°F)" type="number" value={vitals.temperature || ''} onChange={(e) => updateVitals('temperature', parseFloat(e.target.value))} placeholder="°F" />
          <Input label="Pulse (bpm)" type="number" value={vitals.pulse || ''} onChange={(e) => updateVitals('pulse', parseInt(e.target.value))} placeholder="bpm" />
          <Input label="BP (mmHg)" value={vitals.bloodPressure || ''} onChange={(e) => updateVitals('bloodPressure', e.target.value)} placeholder="120/80" />
          <Input label="SpO2 (%)" type="number" value={vitals.spo2 || ''} onChange={(e) => updateVitals('spo2', parseInt(e.target.value))} placeholder="%" />
        </div>
      </Card>

      {/* Chief Complaints Section */}
      <Card 
        title="Chief Complaints & Present Illness" 
        subtitle="Primary reason for visit and detailed history of the current condition."
        headerAction={
          <div className="flex items-center gap-2">
            <Badge variant="blue">Session Active</Badge>
          </div>
        }
      >
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7">
            <TextArea
              label="Complaint Details"
              value={complaint.chiefComplaint || ''}
              onChange={(e) => updateComplaint('chiefComplaint', e.target.value)}
              placeholder="Describe the patient's primary symptoms and reasons for visit..."
              className="min-h-[160px]"
            />
          </div>

          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
            <Input
              label="Duration"
              type="number"
              value={complaint.duration || ''}
              onChange={(e) => updateComplaint('duration', e.target.value)}
              placeholder="Value"
            />
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Type</label>
              <select
                value={complaint.durationType || 'DAYS'}
                onChange={(e) => updateComplaint('durationType', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option value="DAYS">Days</option>
                <option value="WEEKS">Weeks</option>
                <option value="MONTHS">Months</option>
                <option value="YEARS">Years</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Severity</label>
              <select
                value={complaint.severity || 'MILD'}
                onChange={(e) => updateComplaint('severity', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option value="MILD">Mild</option>
                <option value="MODERATE">Moderate</option>
                <option value="SEVERE">Severe</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Onset</label>
              <select
                value={complaint.onset || 'GRADUAL'}
                onChange={(e) => updateComplaint('onset', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option value="GRADUAL">Gradual</option>
                <option value="SUDDEN">Sudden</option>
              </select>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <Input
              label="Aggravating Factors"
              value={complaint.aggravatingFactors || ''}
              onChange={(e) => updateComplaint('aggravatingFactors', e.target.value)}
              placeholder="e.g. Walking, eating spicy food..."
            />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <Input
              label="Relieving Factors"
              value={complaint.relievingFactors || ''}
              onChange={(e) => updateComplaint('relievingFactors', e.target.value)}
              placeholder="e.g. Rest, cold compress..."
            />
          </div>

          <div className="col-span-12">
            <TextArea
              label="History of Present Illness (HPI)"
              value={complaint.presentIllness || ''}
              onChange={(e) => updateComplaint('presentIllness', e.target.value)}
              placeholder="Timeline and evolution of current symptoms..."
              className="min-h-[120px]"
            />
          </div>
        </div>
      </Card>

      {/* Past Complaints Section */}
      <Card 
        title="Past Complaints History" 
        subtitle="Historical complaints from previous visits."
      >
        <div className="space-y-4">
          {loadingPast ? (
            <div className="flex items-center justify-center p-6">
              <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
              <span className="ml-3 text-sm font-bold text-slate-500">Loading past records...</span>
            </div>
          ) : pastCases.length === 0 ? (
            <div className="text-center p-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
              <p className="text-sm font-bold text-slate-400">No past complaints found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastCases.map((pastCase: any, index: number) => (
                <div key={pastCase.id} className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="slate">{pastCase.caseNumber}</Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(pastCase.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 line-clamp-3">
                    {pastCase.visitComplaint?.presentComplaint || pastCase.consultationRecord?.complaint?.chiefComplaint || 'No chief complaint recorded'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Clinical History Section */}
      <SectionHeader 
        title="Clinical History" 
        subtitle="Past records, hereditary conditions, and surgical history."
        action={<Badge variant="slate">Total 6 Sections</Badge>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HistoryCard 
          icon={<HistoryIcon className="w-4 h-4" />} 
          label="Past Medical History" 
          value={history.pastHistory} 
          onChange={(val) => updateHistory('pastHistory', val)}
          placeholder="Details of previous medical conditions..."
        />
        <HistoryCard 
          icon={<AlertCircle className="w-4 h-4" />} 
          label="Known Allergies" 
          value={history.allergies} 
          onChange={(val) => updateHistory('allergies', val)}
          placeholder="List any drug, food or environmental allergies..."
          isAlert
        />
        <HistoryCard 
          icon={<Zap className="w-4 h-4" />} 
          label="Chronic Diseases" 
          value={history.chronicDiseases} 
          onChange={(val) => updateHistory('chronicDiseases', val)}
          placeholder="Diabetes, Hypertension, etc..."
        />
        <HistoryCard 
          icon={<Users className="w-4 h-4" />} 
          label="Family History" 
          value={history.familyHistory} 
          onChange={(val) => updateHistory('familyHistory', val)}
          placeholder="Hereditary conditions in the family..."
        />
        <HistoryCard 
          icon={<Scissors className="w-4 h-4" />} 
          label="Surgical History" 
          value={history.surgicalHistory} 
          onChange={(val) => updateHistory('surgicalHistory', val)}
          placeholder="Previous surgeries and dates..."
        />
        <HistoryCard 
          icon={<Activity className="w-4 h-4" />} 
          label="Personal History" 
          value={history.personalHistory} 
          onChange={(val) => updateHistory('personalHistory', val)}
          placeholder="Smoking, alcohol, diet, lifestyle..."
        />
        {patientGender?.toUpperCase() === 'FEMALE' && (
          <HistoryCard 
            icon={<Baby className="w-4 h-4" />} 
            label="Obstetric History" 
            value={history.obstetricHistory} 
            onChange={(val) => updateHistory('obstetricHistory', val)}
            placeholder="Pregnancies, births, complications..."
          />
        )}
        <HistoryCard 
          icon={<Pill className="w-4 h-4" />} 
          label="Current Medications" 
          value={history.currentMedications} 
          onChange={(val) => updateHistory('currentMedications', val)}
          placeholder="Ongoing medicines from outside..."
        />
        <HistoryCard 
          icon={<Stethoscope className="w-4 h-4" />} 
          label="Nursing Notes" 
          value={history.nursingNotes} 
          onChange={(val) => updateHistory('nursingNotes', val)}
          placeholder="Nursing-specific observation notes..."
        />
        <HistoryCard 
          icon={<FileText className="w-4 h-4" />} 
          label="Patient Feedback" 
          value={history.patientFeedback} 
          onChange={(val) => updateHistory('patientFeedback', val)}
          placeholder="Pre typing by nursing..."
        />
      </div>
      
      {/* Action Bar */}
      {onSaveAndNext && (
        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button
            onClick={onSaveAndNext}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              saving 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 hover:-translate-y-0.5'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save & Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const HistoryCard = ({ icon, label, value, onChange, placeholder, isAlert }: { icon: any, label: string, value: string, onChange: (v: string) => void, placeholder: string, isAlert?: boolean }) => {
  const isEmpty = !value || value.trim() === '';
  
  return (
    <Card className={`group transition-all relative ${isAlert ? 'border-rose-100 hover:border-rose-200' : 'hover:border-blue-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${isAlert ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
            {icon}
          </div>
          <h4 className={`text-sm font-black tracking-tight ${isAlert ? 'text-rose-700' : 'text-slate-900'}`}>{label}</h4>
        </div>
        {isEmpty && (
          <Badge variant="slate" className="bg-slate-100 text-slate-400 text-[9px]">Not taken by Reception</Badge>
        )}
      </div>
      <TextArea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isEmpty ? "Not taken by reception/nursing - Doctor to enter details..." : placeholder}
        className={`bg-white border-slate-100 min-h-[100px] ${isAlert ? 'focus:border-rose-400 focus:ring-rose-500/5' : ''}`}
      />
    </Card>
  );
};

export default ComplaintsTab;
