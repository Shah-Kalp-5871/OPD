import React from 'react';

export interface VisitComplaintData {
  presentComplaint: string;
  durationDays: string;
  durationMonths: string;
  durationYears: string;
  severity: string;
  onset: string;
  aggravatingFactors: string;
  relievingFactors: string;
  pastMedical: string;
  personalHistory: string;
  pastSurgical: string;
  currentMedications: string;
  obstetricHistory: string;
  allergies: string;
  nursingNotes: string;
  patientFeedback: string;
}

interface ComplaintsFormProps {
  data: VisitComplaintData;
  onChange: (data: VisitComplaintData) => void;
}

const ComplaintsForm: React.FC<ComplaintsFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof VisitComplaintData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          Current Visit Details
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Present Complaint / Reason for visit
            </label>
            <textarea
              value={data.presentComplaint}
              onChange={(e) => handleChange('presentComplaint', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[80px]"
              placeholder="E.g., Fever and headache since 3 days..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Duration
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Yrs"
                  value={data.durationYears}
                  onChange={(e) => handleChange('durationYears', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="Mos"
                  value={data.durationMonths}
                  onChange={(e) => handleChange('durationMonths', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="Days"
                  value={data.durationDays}
                  onChange={(e) => handleChange('durationDays', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Severity
                </label>
                <select
                  value={data.severity}
                  onChange={(e) => handleChange('severity', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="MILD">Mild</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Onset
                </label>
                <select
                  value={data.onset}
                  onChange={(e) => handleChange('onset', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select</option>
                  <option value="SUDDEN">Sudden</option>
                  <option value="GRADUAL">Gradual</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Aggravating Factors
              </label>
              <textarea
                value={data.aggravatingFactors}
                onChange={(e) => handleChange('aggravatingFactors', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px]"
                placeholder="What makes it worse..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Relieving Factors
              </label>
              <textarea
                value={data.relievingFactors}
                onChange={(e) => handleChange('relievingFactors', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px]"
                placeholder="What makes it better..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          History & Context
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Past Medical History
            </label>
            <textarea
              value={data.pastMedical}
              onChange={(e) => handleChange('pastMedical', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Past Surgical History
            </label>
            <textarea
              value={data.pastSurgical}
              onChange={(e) => handleChange('pastSurgical', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Current Medications
            </label>
            <textarea
              value={data.currentMedications}
              onChange={(e) => handleChange('currentMedications', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Allergies
            </label>
            <textarea
              value={data.allergies}
              onChange={(e) => handleChange('allergies', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Personal History
            </label>
            <textarea
              value={data.personalHistory}
              onChange={(e) => handleChange('personalHistory', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Obstetric/Gynecological History
            </label>
            <textarea
              value={data.obstetricHistory}
              onChange={(e) => handleChange('obstetricHistory', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px]"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          Notes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Nursing Notes
            </label>
            <textarea
              value={data.nursingNotes}
              onChange={(e) => handleChange('nursingNotes', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Patient Feedback / Expectations
            </label>
            <textarea
              value={data.patientFeedback}
              onChange={(e) => handleChange('patientFeedback', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[60px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsForm;
