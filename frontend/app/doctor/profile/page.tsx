'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Loader2, Info } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function DoctorProfilePage() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  
  // Hardcode ID or get from session, in our current setup doctor uses ID from session in their own views.
  // Wait, let's just get the user profile first to get the doctor ID.
  const [doctorId, setDoctorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndLeaves = async () => {
      try {
        const { data: session } = await api.get('/auth/me');
        if (session && session.user && session.user.id) {
          setDoctorId(session.user.id);
          const { data: leaves } = await api.get(`/doctors/${session.user.id}/holidays`);
          setHolidays(leaves);
        }
      } catch (err) {
        console.error('Failed to fetch holidays', err);
        toast.error('Failed to load holiday settings');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndLeaves();
  }, []);

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId) return;
    
    try {
      setSubmitting(true);
      const { data } = await api.post(`/doctors/${doctorId}/holidays`, {
        startDate,
        endDate,
        reason,
        branchId: 'default-branch' // Assuming simple setup or passed from context
      });
      setHolidays([data, ...holidays]);
      toast.success('Holiday added and appointments cancelled (alert sent to patients)');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add holiday');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveHoliday = async (holidayId: string) => {
    if (!doctorId) return;
    try {
      await api.delete(`/doctors/${doctorId}/holidays/${holidayId}`);
      setHolidays(holidays.filter(h => h.id !== holidayId));
      toast.success('Holiday removed');
    } catch (err) {
      toast.error('Failed to remove holiday');
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Holiday Settings</h1>
        <p className="text-slate-500 mt-2">Manage your leaves. Adding a holiday will automatically cancel scheduled appointments in that range and notify patients via WhatsApp/SMS.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mb-8">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Schedule New Leave
        </div>
        <form onSubmit={handleAddHoliday} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date</label>
            <input 
              type="date" 
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Date</label>
            <input 
              type="date" 
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reason (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Annual Vacation, Medical Leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button 
              type="submit"
              disabled={submitting}
              className="bg-[#036d92] hover:bg-[#025a7a] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Save Holiday
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 font-bold text-slate-800 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          Upcoming & Past Leaves
        </div>
        <div className="divide-y divide-slate-100">
          {holidays.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No holidays scheduled.</div>
          ) : (
            holidays.map(holiday => (
              <div key={holiday.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="font-bold text-slate-800">
                    {new Date(holiday.startDate).toLocaleDateString()} &mdash; {new Date(holiday.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{holiday.reason || 'No reason provided'}</div>
                  <div className="text-xs font-black uppercase tracking-wider text-green-600 mt-2 bg-green-50 inline-block px-2 py-1 rounded-md">
                    {holiday.status}
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveHoliday(holiday.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="Remove Holiday"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
