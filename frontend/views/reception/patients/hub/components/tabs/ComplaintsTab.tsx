import React, { useState } from 'react';
import { History, Activity } from 'lucide-react';

interface ComplaintsTabProps {
  patient: any;
}

const ComplaintsTab: React.FC<ComplaintsTabProps> = ({ patient }) => {
  const cases = patient?.cases || [];
  
  // Sort cases to show latest first
  const sortedCases = [...cases].sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).filter((c: any) => c.visitComplaint); // Only include cases with complaints

  const [showAll, setShowAll] = useState(false);
  const displayedCases = showAll ? sortedCases : sortedCases.slice(0, 1);

  return (
    <div className="space-y-6">
      {sortedCases.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-200/60 shadow-sm border-dashed">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Complaints Recorded</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {displayedCases.map((c: any) => {
            const complaint = c.visitComplaint;
            if (!complaint) return null;

            return (
              <div key={c.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-800">Visit on {new Date(c.createdAt).toLocaleDateString()}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        complaint.severity === 'SEVERE' ? 'bg-red-100 text-red-700 border border-red-200' : 
                        complaint.severity === 'MODERATE' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                        'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {complaint.severity || 'UNKNOWN'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1 font-medium">
                      <Activity className="w-3.5 h-3.5" /> Case #{c.caseNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column - Core Complaints */}
                  <div className="md:col-span-7 space-y-5">
                    {complaint.presentComplaint && (
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Present Complaint</h4>
                        <div className="text-sm text-slate-700 bg-slate-50 border border-slate-100 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                          {complaint.presentComplaint}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {(complaint.durationDays || complaint.durationMonths || complaint.durationYears) && (
                        <div className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-100/50">
                          <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Duration</h4>
                          <p className="text-sm text-orange-900 font-bold">
                            {complaint.durationYears ? `${complaint.durationYears}y ` : ''}
                            {complaint.durationMonths ? `${complaint.durationMonths}m ` : ''}
                            {complaint.durationDays ? `${complaint.durationDays}d` : ''}
                          </p>
                        </div>
                      )}
                      {complaint.onset && (
                        <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/50">
                          <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Onset</h4>
                          <p className="text-sm text-indigo-900 font-bold capitalize">{complaint.onset.toLowerCase()}</p>
                        </div>
                      )}
                    </div>

                    {(complaint.aggravatingFactors || complaint.relievingFactors) && (
                      <div className="grid grid-cols-2 gap-4">
                        {complaint.aggravatingFactors && (
                          <div className="p-3.5 bg-red-50/30 rounded-xl border border-red-100/50">
                            <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Aggravating Factors</h4>
                            <p className="text-sm text-slate-700">{complaint.aggravatingFactors}</p>
                          </div>
                        )}
                        {complaint.relievingFactors && (
                          <div className="p-3.5 bg-green-50/30 rounded-xl border border-green-100/50">
                            <h4 className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">Relieving Factors</h4>
                            <p className="text-sm text-slate-700">{complaint.relievingFactors}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {(complaint.nursingNotes || complaint.patientFeedback) && (
                      <div className="space-y-4 mt-6 pt-4 border-t border-slate-100">
                        {complaint.nursingNotes && (
                          <div className="bg-blue-50/30 border border-blue-100 p-4 rounded-xl">
                            <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Nursing Notes</h4>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{complaint.nursingNotes}</p>
                          </div>
                        )}
                        {complaint.patientFeedback && (
                          <div className="bg-purple-50/30 border border-purple-100 p-4 rounded-xl">
                            <h4 className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-2">Patient Feedback / Expectations</h4>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{complaint.patientFeedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column - History */}
                  <div className="md:col-span-5 space-y-4">
                    {complaint.pastMedical && (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Past Medical History</h4>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{complaint.pastMedical}</p>
                      </div>
                    )}
                    {complaint.pastSurgical && (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Past Surgical History</h4>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{complaint.pastSurgical}</p>
                      </div>
                    )}
                    {complaint.personalHistory && (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Personal History</h4>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{complaint.personalHistory}</p>
                      </div>
                    )}
                    {complaint.obstetricHistory && (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Obstetric/Gynecological History</h4>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{complaint.obstetricHistory}</p>
                      </div>
                    )}
                    {complaint.currentMedications && (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Current Medications</h4>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{complaint.currentMedications}</p>
                      </div>
                    )}
                    {complaint.allergies && (
                      <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                        <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">Allergies</h4>
                        <p className="text-sm text-rose-700 font-bold whitespace-pre-wrap">{complaint.allergies}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {sortedCases.length > 1 && (
            <div className="flex justify-center mt-2 pb-4">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                {showAll ? 'Hide Full History' : `View Full History (${sortedCases.length - 1} More)`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintsTab;
