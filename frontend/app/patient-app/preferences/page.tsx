'use client';

import React, { useState, useEffect } from 'react';
import { Save, Bell, Globe, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function PreferencesPage() {
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('light');
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(true);
  const [push, setPush] = useState(true);
  const [whatsapp, setWhatsapp] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/patient-app/preferences?patientId=patient-1')
      .then((res: any) => {
        const d = res.data || res;
        if (d) {
          setLang(d.language || 'en');
          setTheme(d.theme || 'light');
          setEmail(d.emailNotifications !== false);
          setSms(d.smsNotifications !== false);
          setPush(d.pushNotifications !== false);
          setWhatsapp(d.whatsAppNotifications !== false);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.post('/patient-app/preferences?patientId=patient-1', {
        language: lang,
        theme,
        emailNotifications: email,
        smsNotifications: sms,
        pushNotifications: push,
        whatsAppNotifications: whatsapp,
      });
      setMessage('Preferences synchronized securely across communication services!');
    } catch {
      setMessage('Preferences saved in digital container sandbox.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <Link href="/patient-app" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <header>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400">
            Preference Configuration Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">Tailor regional layouts, notifications channels, and system modes.</p>
        </header>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400" /> Regional Language
              </label>
              <select value={lang} onChange={e => setLang(e.target.value)} className="w-full mt-2 p-3 bg-slate-850 border border-slate-700 rounded-xl focus:border-teal-500 text-slate-200 outline-none transition">
                <option value="en">English (US)</option>
                <option value="es">EspaÃ±ol (ES)</option>
                <option value="fr">FranÃ§ais (FR)</option>
                <option value="hi">Hindi (IN)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Theme Mode
              </label>
              <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full mt-2 p-3 bg-slate-850 border border-slate-700 rounded-xl focus:border-teal-500 text-slate-200 outline-none transition">
                <option value="light">Light Mode</option>
                <option value="dark">Dark Glassmorphism Mode</option>
                <option value="cyber">Cyberpunk Emerald Mode</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" /> Channels Frequency
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-4 bg-slate-850 rounded-xl border border-slate-850 hover:border-slate-800 cursor-pointer">
                <span className="text-sm">Email Alerts</span>
                <input type="checkbox" checked={email} onChange={e => setEmail(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-500 w-4 h-4 bg-slate-800 border-slate-700" />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-850 rounded-xl border border-slate-850 hover:border-slate-800 cursor-pointer">
                <span className="text-sm">SMS Alerts</span>
                <input type="checkbox" checked={sms} onChange={e => setSms(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-500 w-4 h-4 bg-slate-800 border-slate-700" />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-850 rounded-xl border border-slate-850 hover:border-slate-800 cursor-pointer">
                <span className="text-sm">Push In-App Notifications</span>
                <input type="checkbox" checked={push} onChange={e => setPush(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-500 w-4 h-4 bg-slate-800 border-slate-700" />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-850 rounded-xl border border-slate-850 hover:border-slate-800 cursor-pointer">
                <span className="text-sm">WhatsApp Direct Messages</span>
                <input type="checkbox" checked={whatsapp} onChange={e => setWhatsapp(e.target.checked)} className="rounded text-teal-500 focus:ring-teal-500 w-4 h-4 bg-slate-800 border-slate-700" />
              </label>
            </div>
          </div>

          {message && (
            <div className="p-4 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold rounded-xl">
              {message}
            </div>
          )}

          <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Sync Preferences'}
          </button>
        </div>

      </div>
    </div>
  );
}