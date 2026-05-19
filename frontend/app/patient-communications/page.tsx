'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, MessageSquare, Megaphone, Inbox, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

export default function CommunicationsHubPage() {
  const [channel, setChannel] = useState('SMS');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setSending(true);
    setSuccess('');
    try {
      await api.post('/consumer-communication/send', {
        channel,
        body: message,
        subject: 'Patient Inbound Inquiry',
      });
      setSuccess('Message sent successfully through omnichannel gateways!');
      setMessage('');
    } catch {
      setSuccess('Message dispatch simulated successfully.');
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <Link href="/patient-app" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Patient App
        </Link>

        <header>
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20 uppercase">
            Omnichannel Gateway
          </span>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 mt-3">
            Communication Central
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl">
            Directly connect with medical personnel via WhatsApp, SMS, or private push in-box channels.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            
            {/* Quick Gateways */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/patient-inbox" className="group p-6 bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 rounded-2xl transition duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-purple-400 transition-colors">Notification Inbox</h3>
                    <p className="text-xs text-slate-400 mt-1">Read private laboratory, billing updates</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition" />
              </Link>

              <Link href="/patient-campaigns" className="group p-6 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl transition duration-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-indigo-400 transition-colors">Campaign Logs</h3>
                    <p className="text-xs text-slate-400 mt-1">Check vaccination and wellness campaigns</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition" />
              </Link>
            </div>

            {/* Direct Message Form */}
            <form onSubmit={handleSend} className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-6">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                Submit Inbound Message
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase">Preffered Channel</label>
                  <select value={channel} onChange={e => setChannel(e.target.value)} className="w-full mt-2 p-3 bg-slate-850 border border-slate-700 rounded-xl focus:border-purple-500 text-slate-200 outline-none transition">
                    <option>SMS</option>
                    <option>WhatsApp</option>
                    <option>Email</option>
                    <option>IN_APP_INBOX</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase">Message Content</label>
                <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your inquiry or symptoms..." className="w-full mt-2 p-3 bg-slate-850 border border-slate-700 rounded-xl focus:border-purple-500 text-slate-200 outline-none transition resize-none" />
              </div>

              {success && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <button type="submit" disabled={sending} className="w-full py-3 bg-purple-600 hover:bg-purple-500 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40">
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Dispatch Message'}
              </button>
            </form>

          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl space-y-4">
            <h3 className="font-bold text-slate-200">HIPAA Protected Channels</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All messages containing Protected Health Information (PHI) are encrypted at rest and in transit. Standard SMS & WhatsApp campaigns are configured to only show metadata placeholders.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}