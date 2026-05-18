'use client';

import { useEffect, useState } from 'react';
import { developerApi } from '@/lib/api/developer';

export default function UsagePage() {
  const [data, setData] = useState<{
    clients?: { name: string; monthlyUsageCount: number; monthlyQuota: number }[];
    topEndpoints?: { endpoint: string; count: number }[];
    subscriptionUsage?: { currentUsage: number; limitMax: number };
  } | null>(null);

  useEffect(() => {
    developerApi.getUsageAnalytics().then((res: unknown) => {
      const r = res as { data?: typeof data };
      setData(r.data ?? (res as typeof data));
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">API Usage & Monetization</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Tenant API Calls</p>
          <p className="text-3xl font-black text-cyan-400">
            {data?.subscriptionUsage?.currentUsage ?? 0}
            <span className="text-lg text-slate-500">
              /{data?.subscriptionUsage?.limitMax ?? '—'}
            </span>
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">API Clients</p>
          <p className="text-3xl font-black">{data?.clients?.length ?? 0}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Top Endpoint</p>
          <p className="text-sm font-mono text-violet-300 truncate">
            {data?.topEndpoints?.[0]?.endpoint ?? '—'}
          </p>
        </div>
      </div>
      <h2 className="font-bold mb-3">Per-Client Consumption</h2>
      <div className="space-y-2">
        {(data?.clients ?? []).map((c) => {
          const pct = Math.min(100, (c.monthlyUsageCount / c.monthlyQuota) * 100);
          return (
            <div key={c.name} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex justify-between text-sm mb-2">
                <span>{c.name}</span>
                <span className="text-slate-400">
                  {c.monthlyUsageCount} / {c.monthlyQuota}
                </span>
              </div>
              <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
