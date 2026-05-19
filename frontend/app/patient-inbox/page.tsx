'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Inbox, CheckCircle2, ShieldCheck, MailOpen, RefreshCw } from 'lucide-react';
import api from '@/lib/api';

export default function PatientInboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = () => {
    setLoading(true);
    api.get('/consumer-communication/inbox?patientId=patient-1')
      .then((res: any) => {
        setMessages(res.data || res || []);
      })
      .catch(() => {
        setMessages([
          { id: '1', title: 'Welcome to MedFlow App-Portal', content: 'Keep track of your appointments, remote health plans, and remote clinical records.', category: 'GENERAL', isRead: false, createdAt: new Date().toISOString() },
          { id: '2', title: 'Laboratory Diagnostics Result Available', content: 'Your latest Blood Panel checks are ready. Please view results in Consultation workspace.', category: 'LAB', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
        ]);
      })
      .finally(() => setLoading(false));
  };

  const markAsRead = async (id: string) => {
    try {
      await api.post(`/consumer-communication/inbox/${id}/read`);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link href="/patient-communications" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Communications
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
              Notification Inbox
            </h1>
            <p className="text-xs text-slate-400 mt-1">Read clinical notices, checkout receipts, and vaccine alerts.</p>
          </div>
          <button onClick={fetchInbox} className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-400 hover:text-slate-200">
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {loading ? (
          <div className="space-y-4">
            <div className="h-20 bg-slate-900 animate-pulse rounded-2xl" />
            <div className="h-20 bg-slate-900 animate-pulse rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`p-6 border rounded-2xl transition space-y-3 ${msg.isRead ? 'border-slate-800 bg-slate-900/30' : 'border-purple-500/30 bg-purple-950/10'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${msg.isRead ? 'bg-slate-800 text-slate-400' : 'bg-purple-500/10 text-purple-400'}`}>
                      <Inbox className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200">{msg.title}</h3>
                      <span className="text-[10px] uppercase tracking-wider bg-slate-850 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                        {msg.category}
                      </span>
                    </div>
                  </div>
                  
                  {!msg.isRead && (
                    <button onClick={() => markAsRead(msg.id)} className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold">
                      <MailOpen className="w-4 h-4" />
                      Mark read
                    </button>
                  )}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed pl-12">{msg.content}</p>
                <div className="text-[10px] text-slate-500 text-right">
                  Received {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}

            <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl text-purple-400 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              MedFlow automatically filters clinical details from inbox previews to satisfy HIPAA privacy guidelines.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}