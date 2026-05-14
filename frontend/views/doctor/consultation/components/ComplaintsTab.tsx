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
  Baby
} from 'lucide-react';

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
    <div className="p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Chief Complaints Section */}
      <section>
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-2">
          <Stethoscope className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Chief Complaints</h2>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Complaint Detail</label>
            <textarea
              value={complaint.chiefComplaint || ''}
              onChange={(e) => updateComplaint('chiefComplaint', e.target.value)}
              placeholder="e.g. Sharp abdominal pain, persistent cough..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px]"
            />
          </div>

          <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
              <input
                type="number"
                value={complaint.duration || ''}
                onChange={(e) => updateComplaint('duration', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type</label>
              <select
                value={complaint.durationType || 'DAYS'}
                onChange={(e) => updateComplaint('durationType', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                <option value="DAYS">Days</option>
                <option value="WEEKS">Weeks</option>
                <option value="MONTHS">Months</option>
                <option value="YEARS">Years</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Severity</label>
              <select
                value={complaint.severity || 'MILD'}
                onChange={(e) => updateComplaint('severity', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                <option value="MILD">Mild</option>
                <option value="MODERATE">Moderate</option>
                <option value="SEVERE">Severe</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Onset</label>
              <select
                value={complaint.onset || 'GRADUAL'}
                onChange={(e) => updateComplaint('onset', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                <option value="GRADUAL">Gradual</option>
                <option value="SUDDEN">Sudden</option>
              </select>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aggravating Factors</label>
            <input
              type="text"
              value={complaint.aggravatingFactors || ''}
              onChange={(e) => updateComplaint('aggravatingFactors', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="col-span-12 md:col-span-6 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Relieving Factors</label>
            <input
              type="text"
              value={complaint.relievingFactors || ''}
              onChange={(e) => updateComplaint('relievingFactors', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Clinical History Section */}
      <section>
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Clinical History</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <HistoryField 
            icon={<Clock className="w-4 h-4" />} 
            label="Past Medical History" 
            value={history.pastHistory} 
            onChange={(val) => updateHistory('pastHistory', val)}
          />
          <HistoryField 
            icon={<AlertCircle className="w-4 h-4" />} 
            label="Personal History" 
            value={history.personalHistory} 
            onChange={(val) => updateHistory('personalHistory', val)}
          />
          <HistoryField 
            icon={<Scissors className="w-4 h-4" />} 
            label="Surgical History" 
            value={history.surgicalHistory} 
            onChange={(val) => updateHistory('surgicalHistory', val)}
          />
          <HistoryField 
            icon={<Users className="w-4 h-4" />} 
            label="Family History" 
            value={history.familyHistory} 
            onChange={(val) => updateHistory('familyHistory', val)}
          />
          {patientGender?.toUpperCase() === 'FEMALE' && (
            <HistoryField 
              icon={<Baby className="w-4 h-4" />} 
              label="Obstetric History" 
              value={history.obstetricHistory} 
              onChange={(val) => updateHistory('obstetricHistory', val)}
            />
          )}
        </div>
      </section>
    </div>
  );
};

const HistoryField = ({ icon, label, value, onChange }: { icon: any, label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-2 group">
    <div className="flex items-center gap-2 mb-1">
      <div className="text-slate-500 group-focus-within:text-indigo-400 transition-colors">
        {icon}
      </div>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-slate-300 transition-colors">
        {label}
      </label>
    </div>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all min-h-[100px]"
      placeholder={`Enter details about ${label.toLowerCase()}...`}
    />
  </div>
);

export default ComplaintsTab;
