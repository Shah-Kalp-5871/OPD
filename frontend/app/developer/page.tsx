'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { developerApi } from '@/lib/api/developer';
import { Key, Webhook, BarChart3, Terminal } from 'lucide-react';

export default function DeveloperOverviewPage() {
  const [stats, setStats] = useState<{
    clients?: { name: string; monthlyUsageCount: number }[];
    topEndpoints?: { endpoint: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    developerApi
      .getUsageAnalytics()
      .then((res: unknown) => {
        const r = res as { data?: typeof stats };
        setStats(r.data ?? (res as typeof stats));
      })
      .catch(() => setStats(null));
  }, []);

  const cards = [
    { title: 'API Keys', desc: 'Create & rotate integration keys', href: '/developer/api-keys', icon: Key },
    { title: 'Webhooks', desc: 'Event subscriptions & delivery logs', href: '/developer/webhooks', icon: Webhook },
    { title: 'Usage Analytics', desc: 'Quota, endpoints & billing metrics', href: '/developer/usage', icon: BarChart3 },
    { title: 'API Playground', desc: 'Test requests live', href: '/developer/playground', icon: Terminal },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Developer Ecosystem</h1>
      <p className="text-slate-400 mb-8">Enterprise API gateway, webhooks & monetization platform</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-500/40 transition-all h-full">
                <Icon className="w-8 h-8 text-cyan-400 mb-3" />
                <h3 className="font-bold text-lg">{c.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{c.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-cyan-300 mb-4">Active API Clients</h2>
          <p className="text-4xl font-black">{stats?.clients?.length ?? '—'}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-cyan-300 mb-4">Top Endpoints (30d)</h2>
          <ul className="space-y-2 text-sm">
            {(stats?.topEndpoints ?? []).slice(0, 5).map((e) => (
              <li key={e.endpoint} className="flex justify-between text-slate-300">
                <span className="font-mono truncate">{e.endpoint}</span>
                <span className="text-cyan-400">{e.count}</span>
              </li>
            ))}
            {!stats?.topEndpoints?.length && <li className="text-slate-500">No usage data yet</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
