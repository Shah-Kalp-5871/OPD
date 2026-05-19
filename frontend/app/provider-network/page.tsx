'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, RefreshCw, Star, MapPin, Phone } from 'lucide-react';
import api from '@/lib/api';

export default function ProviderNetworkPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProviders = () => {
    setLoading(true);
    api.get('/referrals/providers')
      .then((res: any) => {
        setProviders(res.data || res || []);
      })
      .catch(() => {
        setProviders([
          { id: 'prov-1', name: 'Dr. Sarah Connor', specialty: 'CARDIOLOGY', facilityName: 'St. Jude Cardiac Center', address: '789 Medical Plaza, suite 200', rating: 4.9, active: true },
          { id: 'prov-2', name: 'Dr. Gregory House', specialty: 'NEUROLOGY', facilityName: 'Princeton Plainsboro Clinic', address: '120 Diagnostic Way', rating: 4.8, active: true },
          { id: 'prov-3', name: 'Dr. Elizabeth Blackwell', specialty: 'ONCOLOGY', facilityName: 'Metro Cancer Institute', address: '450 Radiation Ave', rating: 5.0, active: true },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter(prov =>
    prov.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prov.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prov.facilityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <Link href="/referrals" className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Referral Exchange
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-indigo-400">
              National Provider Directory
            </h1>
            <p className="text-xs text-slate-400 mt-1">Cross-reference active medical practitioners, accredited specialty nodes, and regional clinics.</p>
          </div>
          <button onClick={fetchProviders} className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-400 hover:text-slate-200">
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {/* Search */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search provider name, clinical specialty, healthcare node facility..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-slate-200 text-sm focus:outline-none w-full"
          />
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="h-60 bg-slate-900 animate-pulse rounded-3xl" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProviders.map((prov) => (
              <div key={prov.id} className="bg-slate-900/40 border border-slate-800 hover:border-slate-700 p-6 rounded-3xl flex flex-col justify-between space-y-4 transition">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-850 text-teal-400 border border-slate-800 rounded font-bold uppercase tracking-wider">
                      {prov.specialty}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" /> {prov.rating}
                    </span>
                  </div>
                  <h3 className="text-md font-bold text-slate-200">{prov.name}</h3>
                  <span className="text-xs text-indigo-400 block font-semibold">{prov.facilityName}</span>
                  
                  <div className="pt-2 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{prov.address}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Referral Node Active
                  </span>
                  <Link
                    href={`/referrals?target=${prov.facilityName}`}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-lg text-white transition"
                  >
                    Select Node
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
