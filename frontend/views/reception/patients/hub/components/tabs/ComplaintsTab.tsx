import React from 'react';
import { History, Activity } from 'lucide-react';

interface ComplaintsTabProps {
  patient: any;
}

const ComplaintsTab: React.FC<ComplaintsTabProps> = ({ patient }) => {
  const cases = patient?.cases || [];
  
  // Sort cases to show latest first
  const sortedCases = [...cases].sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedCases.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-200/60 shadow-sm border-dashed">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Complaints Recorded</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {sortedCases.map((c: any) => {
            const complaint = c.visitComplaint;
            if (!complaint) return null;

            return (
              <div key={c.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-800">Visit on {new Date(c.createdAt).toLocaleDateString()}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        complaint.severity === 'SEVERE' ? 'bg-red-100 text-red-700' : 
                        complaint.severity === 'MODERATE' ? 'bg-amber-100 text-amber-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {complaint.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" /> Case #{c.caseNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {complaint.presentComplaint && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Present Complaint</h4>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{complaint.presentComplaint}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      {(complaint.durationDays || complaint.durationMonths || complaint.durationYears) && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</h4>
                          <p className="text-sm text-slate-700 font-medium">
                            {complaint.durationYears ? `${complaint.durationYears}y ` : ''}
                            {complaint.durationMonths ? `${complaint.durationMonths}m ` : ''}
                            {complaint.durationDays ? `${complaint.durationDays}d` : ''}
                          </p>
                        </div>
                      )}
                      {complaint.onset && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Onset</h4>
                          <p className="text-sm text-slate-700 font-medium capitalize">{complaint.onset.toLowerCase()}</p>
                        </div>
                      )}
                    </div>

                    {(complaint.aggravatingFactors || complaint.relievingFactors) && (
                      <div className="grid grid-cols-2 gap-4">
                        {complaint.aggravatingFactors && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Aggravating</h4>
                            <p className="text-sm text-slate-700">{complaint.aggravatingFactors}</p>
                          </div>
                        )}
                        {complaint.relievingFactors && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Relieving</h4>
                            <p className="text-sm text-slate-700">{complaint.relievingFactors}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {complaint.pastMedical && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Past Medical History</h4>
                        <p className="text-sm text-slate-700">{complaint.pastMedical}</p>
                      </div>
                    )}
                    {complaint.currentMedications && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Medications</h4>
                        <p className="text-sm text-slate-700">{complaint.currentMedications}</p>
                      </div>
                    )}
                    {complaint.allergies && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Allergies</h4>
                        <p className="text-sm text-red-600 font-medium">{complaint.allergies}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComplaintsTab;
