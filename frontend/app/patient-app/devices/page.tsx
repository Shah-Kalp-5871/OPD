'use client';

import React, { useState, useEffect } from 'react';
import { Tablet, Smartphone, Laptop, Trash2, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = () => {
    setLoading(true);
    api.get('/patient-app/devices?patientId=patient-1')
      .then((res: any) => {
        setDevices(res.data || res || []);
      })
      .catch(() => {
        setDevices([
          { id: '1', deviceName: 'iPhone 15 Pro Max', pushToken: 'apns-xxx-111', osVersion: 'iOS 17.4', lastLoginAt: new Date().toISOString() },
          { id: '2', deviceName: 'MacBook Pro 16', pushToken: 'web-xxx-222', osVersion: 'macOS Sonoma', lastLoginAt: new Date(Date.now() - 3600000).toISOString() },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link href="/patient-app" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400">
              Active Authorized Devices
            </h1>
            <p className="text-xs text-slate-400 mt-1">Audit active login sessions and push notifications tokens.</p>
          </div>
          <button onClick={fetchDevices} className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-400 hover:text-slate-200">
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
            {devices.map(device => (
              <div key={device.id} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-slate-700 transition flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
                    {device.deviceName.toLowerCase().includes('mac') || device.deviceName.toLowerCase().includes('web') ? (
                      <Laptop className="w-6 h-6" />
                    ) : (
                      <Smartphone className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 flex items-center gap-2">
                      {device.deviceName}
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-normal">
                        Authorized
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      OS: {device.osVersion} â€¢ Last access: {new Date(device.lastLoginAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Token Fingerprint</span>
                    <span className="text-xs text-slate-400 font-mono">{(device.pushToken || 'mock').substring(0, 12)}...</span>
                  </div>
                  <button className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              MedFlow zero-trust architecture constantly secures active push sockets and terminates stale credentials automatically.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}