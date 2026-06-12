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
    <div className="space-y-3">
      {/* Current Visit Details */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
          Current Visit Details
        </h4>
        <div className="space-y-2">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
              Present Complaint / Reason for visit
            </label>
            <input
              type="text"
              value={data.presentComplaint}
              onChange={(e) => handleChange('presentComplaint', e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="E.g., Fever and headache since 3 days..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="md:col-span-4">
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                Duration (Y/M/D)
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  placeholder="Yrs"
                  value={data.durationYears}
                  onChange={(e) => handleChange('durationYears', e.target.value)}
                  className="w-1/3 px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="Mos"
                  value={data.durationMonths}
                  onChange={(e) => handleChange('durationMonths', e.target.value)}
                  className="w-1/3 px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="Days"
                  value={data.durationDays}
                  onChange={(e) => handleChange('durationDays', e.target.value)}
                  className="w-1/3 px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="md:col-span-4">
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                Severity
              </label>
              <select
                value={data.severity}
                onChange={(e) => handleChange('severity', e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="MILD">Mild</option>
                <option value="MODERATE">Moderate</option>
                <option value="SEVERE">Severe</option>
              </select>
            </div>
            <div className="md:col-span-4">
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                Onset
              </label>
              <select
                value={data.onset}
                onChange={(e) => handleChange('onset', e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select</option>
                <option value="SUDDEN">Sudden</option>
                <option value="GRADUAL">Gradual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                Aggravating Factors
              </label>
              <input
                type="text"
                value={data.aggravatingFactors}
                onChange={(e) => handleChange('aggravatingFactors', e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="What makes it worse..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                Relieving Factors
              </label>
              <input
                type="text"
                value={data.relievingFactors}
                onChange={(e) => handleChange('relievingFactors', e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="What makes it better..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* History & Context */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
          History & Context
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
              Past Medical History
            </label>
            <input
              type="text"
              value={data.pastMedical}
              onChange={(e) => handleChange('pastMedical', e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
              Past Surgical History
            </label>
            <input
              type="text"
              value={data.pastSurgical}
              onChange={(e) => handleChange('pastSurgical', e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
              Current Medications
            </label>
            <input
              type="text"
              value={data.currentMedications}
              onChange={(e) => handleChange('currentMedications', e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
              Allergies
            </label>
            <input
              type="text"
              value={data.allergies}
              onChange={(e) => handleChange('allergies', e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
              Personal History
            </label>
            <input
              type="text"
              value={data.personalHistory}
              onChange={(e) => handleChange('personalHistory', e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
              Obstetric/Gyneco History
            </label>
            <input
              type="text"
              value={data.obstetricHistory}
              onChange={(e) => handleChange('obstetricHistory', e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
      
      {/* Notes */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
          Notes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
              Nursing Notes
            </label>
            <input
              type="text"
              value={data.nursingNotes}
              onChange={(e) => handleChange('nursingNotes', e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
              Patient Feedback / Expectations
            </label>
            <input
              type="text"
              value={data.patientFeedback}
              onChange={(e) => handleChange('patientFeedback', e.target.value)}
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsForm;
