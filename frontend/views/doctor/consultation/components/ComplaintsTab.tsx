import React from 'react';
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
  History as HistoryIcon,
  Search
} from 'lucide-react';
import { Card, SectionHeader, TextArea, Input, Badge } from './ClinicalDesignSystem';

interface ComplaintsTabProps {
  data: any;
  updateComplaint: (field: string, value: any) => void;
  updateHistory: (field: string, value: any) => void;
  patientGender: string;
}

const ComplaintsTab: React.FC<ComplaintsTabProps> = ({ 
  data, 
  updateComplaint, 
  updateHistory,
  patientGender 
}) => {
  const complaint = data?.complaint || {};
  const history = data?.history || {};

  return (
    <div className="space-y-8 pb-12">
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
      </div>
    </div>
  );
};

const HistoryCard = ({ icon, label, value, onChange, placeholder, isAlert }: { icon: any, label: string, value: string, onChange: (v: string) => void, placeholder: string, isAlert?: boolean }) => (
  <Card className={`group transition-all ${isAlert ? 'border-rose-100 hover:border-rose-200' : 'hover:border-blue-200'}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${isAlert ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
        {icon}
      </div>
      <h4 className={`text-sm font-black tracking-tight ${isAlert ? 'text-rose-700' : 'text-slate-900'}`}>{label}</h4>
    </div>
    <TextArea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-white border-slate-100 min-h-[100px] ${isAlert ? 'focus:border-rose-400 focus:ring-rose-500/5' : ''}`}
    />
  </Card>
);

export default ComplaintsTab;
