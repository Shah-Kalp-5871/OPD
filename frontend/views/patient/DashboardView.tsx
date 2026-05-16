'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  Clock, 
  Download, 
  ChevronRight,
  User,
  LogOut,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { patientPortalApi } from '@/lib/api/patient-portal';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function PatientDashboardView() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await patientPortalApi.getProfile();
      setProfile(data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800 p-6 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <User className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Hello, {profile?.firstName}</h1>
              <p className="text-xs text-slate-400">MRD: {profile?.mrdNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 hover:text-white"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/patient/login';
              }}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickAction icon={<Calendar />} label="Book Visit" color="bg-blue-500" />
          <QuickAction icon={<FileText />} label="Prescriptions" color="bg-emerald-500" />
          <QuickAction icon={<Download />} label="Lab Reports" color="bg-amber-500" />
          <QuickAction icon={<CreditCard />} label="Invoices" color="bg-indigo-500" />
        </div>

        {/* Upcoming Appointment */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Next Visit
            </h2>
          </div>
          {profile?.appointments?.filter((a: any) => new Date(a.appointmentDate) > new Date())[0] ? (
            <Card className="bg-indigo-600 border-none p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Calendar className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">Scheduled for</p>
                    <p className="text-lg font-bold">
                      {format(new Date(profile.appointments[0].appointmentDate), 'PPP p')}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <p className="text-sm font-medium">Dr. {profile.appointments[0].doctor?.user?.name}</p>
                  <Button variant="secondary" size="sm" className="bg-white text-indigo-600 hover:bg-white/90">
                    Get Token
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-slate-900 border-slate-800 p-8 text-center border-dashed">
              <p className="text-slate-500 mb-4">No upcoming appointments</p>
              <Button variant="outline" className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10">
                Book an Appointment
              </Button>
            </Card>
          )}
        </section>

        {/* Recent Records */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Recent Records
          </h2>
          <div className="space-y-3">
            {profile?.cases?.map((caseRecord: any) => (
              <RecordCard 
                key={caseRecord.id}
                title={`Visit with Dr. ${caseRecord.doctor?.name || 'Doctor'}`}
                date={format(new Date(caseRecord.createdAt), 'MMM dd, yyyy')}
                type="Consultation"
              />
            ))}
          </div>
        </section>

        {/* Health Insights Placeholder */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h3 className="text-lg font-bold mb-4">Your Health Journey</h3>
          <div className="h-32 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center">
            <p className="text-slate-600 text-sm">Vital signs trends will appear here</p>
          </div>
        </Card>
      </main>
    </div>
  );
}

function QuickAction({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
    >
      <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center text-white`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
      </div>
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
    </motion.button>
  );
}

function RecordCard({ title, date, type }: { title: string, date: string, type: string }) {
  return (
    <Card className="bg-slate-900 border-slate-800 p-4 hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
          <FileText className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm">{title}</h3>
          <p className="text-xs text-slate-500">{date} • {type}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-600" />
    </Card>
  );
}
