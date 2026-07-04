'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import doctorLayout from '@/views/layouts/doctorLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, History, Activity, Calendar, Stethoscope, XCircle, RefreshCw } from 'lucide-react';
import PatientHeader from '../hub/components/PatientHeader';

const ClinicalHistoryView = () => {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;
  
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      const response = await api.get(`/patients/${patientId}`);
      setPatient(response.data);
    } catch (error) {
      toast.error('Failed to load patient history');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <doctorLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </doctorLayout>
    );
  }

  if (!patient) return null;

  const cases = patient.cases || [];
  const appointments = patient.appointments || [];
  
  // Extract relevant appointment history events
  const apptEvents: any[] = [];
  appointments.forEach((appt: any) => {
    if (appt.statusHistory) {
      appt.statusHistory.forEach((sh: any) => {
        if (sh.status === 'CANCELLED' || sh.status === 'RESCHEDULED') {
          apptEvents.push({
            type: 'APPT_HISTORY',
            date: new Date(sh.createdAt),
            status: sh.status,
            remarks: sh.remarks,
            doctor: appt.doctor,
            appointmentDate: appt.appointmentDate,
            appointmentTime: appt.appointmentTime,
            id: sh.id
          });
        }
      });
    }
  });

  const timelineEvents = [
    ...cases.map((c: any) => ({ type: 'CASE', date: new Date(c.createdAt), data: c })),
    ...apptEvents
  ].sort((a: any, b: any) => b.date.getTime() - a.date.getTime());

  const completion = patient.profileCompletionStatus || 20;
  const activeCase = patient.cases?.find((c: any) => c.status === 'OPEN');
  const hasOpenCase = !!activeCase;

  return (
    <doctorLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Button & Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push(`/doctor/patients/${patientId}`)}
            className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Clinical History
          </h1>
        </div>

        <PatientHeader patient={patient} completion={completion} hasOpenCase={hasOpenCase} />

        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden p-6 md:p-8">
          {timelineEvents.length === 0 ? (
             <div className="text-center py-12 text-slate-500">
               <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <p className="font-medium text-lg text-slate-600">No Clinical History</p>
               <p className="text-sm">This patient has no recorded cases or events.</p>
             </div>
          ) : (
             <div className="space-y-12">
               {timelineEvents.map((event: any, index: number) => {
                 if (event.type === 'CASE') {
                   const c = event.data;
                   const vitals = patient.vitals?.find((v: any) => v.caseId === c.id);
                   const complaint = c.visitComplaint;

                   return (
                     <div key={c.id} className="relative pl-8 md:pl-10">
                       {/* Timeline Line */}
                       {index !== timelineEvents.length - 1 && (
                         <div className="absolute top-8 bottom-[-3rem] left-[15px] md:left-[19px] w-0.5 bg-slate-100 z-0"></div>
                       )}
                     
                     {/* Timeline Dot */}
                     <div className="absolute top-1 left-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-50 border-4 border-white flex items-center justify-center z-10 shadow-sm">
                       <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" />
                     </div>

                     <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/60">
                           <div>
                             <div className="flex items-center gap-3 mb-1">
                                <span className="text-sm font-black text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm">
                                  {c.caseNumber}
                                </span>
                                <span className="text-xs font-bold text-slate-500 bg-slate-200/50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                  {c.visitType}
                                </span>
                             </div>
                             <p className="text-sm text-slate-500 font-medium mt-2">
                               {new Date(c.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                             </p>
                           </div>
                           <div className="flex items-center gap-2">
                             {c.doctor && (
                               <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
                                 <Stethoscope className="w-4 h-4 text-slate-400" />
                                 Dr. {c.doctor.name || c.doctor.firstName}
                               </div>
                             )}
                           </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           {/* Complaints Section */}
                           <div>
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-sky-500" />
                                Complaints & History
                              </h4>
                              {complaint ? (
                                <div className="space-y-4">
                                   {complaint.presentComplaint && (
                                     <div>
                                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Present Complaint</span>
                                       <p className="text-sm text-slate-800">{complaint.presentComplaint}</p>
                                     </div>
                                   )}
                                   {complaint.pastMedical && (
                                     <div>
                                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Past Medical History</span>
                                       <p className="text-sm text-slate-800">{complaint.pastMedical}</p>
                                     </div>
                                   )}
                                   {complaint.allergies && (
                                     <div>
                                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Allergies</span>
                                       <p className="text-sm text-red-600 font-medium bg-red-50 inline-block px-2 py-0.5 rounded border border-red-100">{complaint.allergies}</p>
                                     </div>
                                   )}
                                   {/* You can add more fields here if needed */}
                                   {(!complaint.presentComplaint && !complaint.pastMedical && !complaint.allergies) && (
                                     <p className="text-sm text-slate-400 italic">No specific complaints recorded.</p>
                                   )}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-400 italic bg-white p-4 rounded-xl border border-slate-100">No clinical history recorded for this visit.</p>
                              )}
                           </div>

                           {/* Vitals Section */}
                           <div>
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-sky-500" />
                                Vitals
                              </h4>
                              {vitals ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                   {vitals.temperature && (
                                     <div className="bg-white p-3 rounded-xl border border-slate-100">
                                       <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Temp (°F)</span>
                                       <span className="text-sm font-black text-slate-800">{vitals.temperature}</span>
                                     </div>
                                   )}
                                   {vitals.pulse && (
                                     <div className="bg-white p-3 rounded-xl border border-slate-100">
                                       <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Pulse</span>
                                       <span className="text-sm font-black text-slate-800">{vitals.pulse}</span>
                                     </div>
                                   )}
                                   {vitals.bloodPressure && (
                                     <div className="bg-white p-3 rounded-xl border border-slate-100">
                                       <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">BP</span>
                                       <span className="text-sm font-black text-slate-800">{vitals.bloodPressure}</span>
                                     </div>
                                   )}
                                   {vitals.weight && (
                                     <div className="bg-white p-3 rounded-xl border border-slate-100">
                                       <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Weight (kg)</span>
                                       <span className="text-sm font-black text-slate-800">{vitals.weight}</span>
                                     </div>
                                   )}
                                   {vitals.height && (
                                     <div className="bg-white p-3 rounded-xl border border-slate-100">
                                       <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Height (cm)</span>
                                       <span className="text-sm font-black text-slate-800">{vitals.height}</span>
                                     </div>
                                   )}
                                   {vitals.bmi && (
                                     <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                                       <span className="text-[10px] font-bold text-slate-600 uppercase block mb-0.5">BMI</span>
                                       <span className="text-sm font-black text-slate-800">{vitals.bmi}</span>
                                     </div>
                                   )}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-400 italic bg-white p-4 rounded-xl border border-slate-100">No vitals recorded for this visit.</p>
                              )}
                           </div>
                        </div>
                     </div>
                   </div>
                 );
               } else if (event.type === 'APPT_HISTORY') {
                 const isCancel = event.status === 'CANCELLED';
                 return (
                   <div key={event.id} className="relative pl-8 md:pl-10">
                     {/* Timeline Line */}
                     {index !== timelineEvents.length - 1 && (
                       <div className="absolute top-8 bottom-[-3rem] left-[15px] md:left-[19px] w-0.5 bg-slate-100 z-0"></div>
                     )}
                     
                     {/* Timeline Dot */}
                     <div className={`absolute top-1 left-0 w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white flex items-center justify-center z-10 shadow-sm ${isCancel ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-sky-600'}`}>
                       {isCancel ? <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                     </div>

                     <div className={`bg-white border rounded-2xl p-5 md:p-6 shadow-sm ${isCancel ? 'border-rose-100' : 'border-sky-100'}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div>
                             <div className="flex items-center gap-3 mb-1">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${isCancel ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
                                  Appointment {isCancel ? 'Cancelled' : 'Rescheduled'}
                                </span>
                             </div>
                             <p className="text-sm text-slate-500 font-medium mt-2">
                               {event.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                             </p>
                           </div>
                           <div className="flex items-center gap-2">
                             {event.doctor && (
                               <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">
                                 <Stethoscope className="w-4 h-4 text-slate-400" />
                                 Dr. {event.doctor?.user?.name || event.doctor?.name || event.doctor?.firstName || 'Unknown'}
                               </div>
                             )}
                           </div>
                        </div>
                        {event.remarks && (
                          <div className={`mt-4 p-3 rounded-xl border text-sm ${isCancel ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-sky-50 border-sky-100 text-sky-800'}`}>
                            <strong>Remarks:</strong> {event.remarks}
                          </div>
                        )}
                     </div>
                   </div>
                 );
               }
               return null;
             })}
           </div>
          )}
        </div>
      </div>
    </doctorLayout>
  );
};

export default ClinicalHistoryView;
