'use client';

import { useEffect, useState } from 'react';
import { developerApi } from '@/lib/api/developer';

export default function OAuthAppsPage() {
  const [clients, setClients] = useState<{ clientId: string; name: string; scopes: string[] }[]>([]);

  useEffect(() => {
    developerApi.listApiClients().then((res: unknown) => {
      const r = res as { data?: typeof clients };
      setClients(r.data ?? (res as typeof clients));
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">OAuth Applications</h1>
      <p className="text-slate-400 text-sm mb-6">
        OAuth 2.0 authorization code + PKCE via POST /api/v2/oauth/token
      </p>
      <div className="space-y-3">
        {clients.map((c) => (
          <div key={c.clientId} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="font-bold">{c.name}</p>
            <p className="text-xs font-mono text-slate-400">client_id: {c.clientId}</p>
            <p className="text-xs text-violet-300 mt-2">scopes: {c.scopes.join(', ')}</p>
          </div>
        ))}
        {!clients.length && <p className="text-slate-500">No OAuth clients registered</p>}
      </div>
    </div>
  );
}
