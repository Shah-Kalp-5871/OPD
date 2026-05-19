'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Shield, Sliders, Smartphone, Heart, Calendar, Wallet, MessageSquare, Award, ArrowRight, Activity, Flame } from 'lucide-react';
import api from '@/lib/api';

export default function PatientAppDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patient-app/profile?patientId=patient-1')
      .then(res => setProfile(res.data || res))
      .catch(() => setProfile({ dob: '1990-01-01', bloodGroup: 'O+', city: 'New York', emergencyContactName: 'Jane Doe' }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 selection:bg-teal-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <header className="relative p-8 rounded-3xl bg-gradient-to-r from-teal-900/40 via-emerald-950/30 to-slate-900 border border-teal-500/20 backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-teal-400 bg-teal-500/10 rounded-full border border-teal-500/20 uppercase">
                Patient SuperApp Home
              </span>
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400 mt-3">
                Welcome back to MedFlow
              </h1>
              <p className="text-slate-400 mt-2 text-sm md:text-base max-w-xl">
                Your secure portal for multi-branch digital healthcare, AI clinical symptom checking, and gamified wellness goals.
              </p>
            </div>
            
            {/* Gamified Streak Badge */}
            <div className="flex items-center gap-3 bg-slate-900/80 border border-amber-500/20 px-5 py-3 rounded-2xl shadow-lg">
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400">Activity Streak</div>
                <div className="text-lg font-bold text-amber-400">7 Days Active ðŸ”¥</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Quick Actions Column */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-300">Digital Health Modules</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link href="/self-service" className="group relative p-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-teal-400 transition-colors">Appointments & Booking</h3>
                    <p className="text-xs text-slate-400 mt-1">Self-schedule clinic times, consults</p>
                  </div>
                </div>
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link href="/wellness" className="group relative p-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-emerald-400 transition-colors">Wellness Adherence</h3>
                    <p className="text-xs text-slate-400 mt-1">Gamified habit logs, wellness progress</p>
                  </div>
                </div>
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link href="/health-assistant" className="group relative p-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-blue-400 transition-colors">AI Health Copilot</h3>
                    <p className="text-xs text-slate-400 mt-1">Symptom checking & triage assistant</p>
                  </div>
                </div>
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link href="/wallet" className="group relative p-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-purple-400 transition-colors">Digital Wallet</h3>
                    <p className="text-xs text-slate-400 mt-1">Check balance, payments & rewards</p>
                  </div>
                </div>
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </Link>

            </div>

            {/* Profile Overview Card */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-400" />
                  Patient Demographics Profile
                </h3>
                <Link href="/patient-app/profile" className="text-xs text-teal-400 hover:underline">Edit Info</Link>
              </div>
              {loading ? (
                <div className="h-10 bg-slate-850 animate-pulse rounded-lg" />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs">Blood Type</span>
                    <span className="font-semibold text-slate-200">{profile?.bloodGroup || 'O+'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Date of Birth</span>
                    <span className="font-semibold text-slate-200">1990-01-01</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Location</span>
                    <span className="font-semibold text-slate-200">{profile?.city || 'New York'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Emergency Contact</span>
                    <span className="font-semibold text-slate-200">{profile?.emergencyContactName || 'Jane Doe'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Controls */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-300">Preferences & Devices</h2>
            
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-400" />
                  Portal Preference Center
                </h3>
              </div>
              <p className="text-xs text-slate-400">Set theme settings, regional languages, and notification frequencies.</p>
              <Link href="/patient-app/preferences" className="w-full block text-center py-2 bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-300 rounded-xl transition border border-slate-700/50">
                Manage Preferences
              </Link>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Session Monitor
                </h3>
              </div>
              <p className="text-xs text-slate-400">See registered smartphones, browser workstations, and security tokens.</p>
              <Link href="/patient-app/devices" className="w-full block text-center py-2 bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-300 rounded-xl transition border border-slate-700/50">
                Audit Active Devices
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}