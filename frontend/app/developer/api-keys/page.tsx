'use client';

import { useEffect, useState } from 'react';
import { developerApi } from '@/lib/api/developer';

type ApiClient = {
  clientId: string;
  name: string;
  environment: string;
  scopes: string[];
  apiKeyPrefix?: string;
  apiKeyActive: boolean;
  monthlyUsageCount: number;
  monthlyQuota: number;
  lastUsedAt?: string;
};

export default function ApiKeysPage() {
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    developerApi
      .listApiClients()
      .then((res: unknown) => {
        const r = res as { data?: ApiClient[] };
        setClients(r.data ?? (res as ApiClient[]));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    const res = await developerApi.createApiClient({
      name: name || 'Integration Client',
      scopes: ['patients:read', 'appointments:read', 'webhooks:read'],
      environment: 'sandbox',
    });
    const data = (res as { data?: { apiKey?: string } }).data ?? res;
    setNewKey((data as { apiKey?: string }).apiKey ?? null);
    setName('');
    load();
  };

  const rotate = async (clientId: string) => {
    const res = await developerApi.rotateKey(clientId);
    const data = (res as { data?: { apiKey?: string } }).data ?? res;
    setNewKey((data as { apiKey?: string }).apiKey ?? null);
    load();
  };

  if (loading) {
    return <p className="text-slate-400 animate-pulse">Loading API clients...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">API Keys</h1>

      {newKey && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="text-amber-300 text-sm font-bold mb-2">Copy your key now — shown once</p>
          <code className="text-xs break-all text-white">{newKey}</code>
        </div>
      )}

      <div className="flex gap-2 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Client name"
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm flex-1"
        />
        <button
          type="button"
          onClick={create}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-semibold"
        >
          Generate Key
        </button>
      </div>

      <div className="space-y-3">
        {clients.map((c) => (
          <div
            key={c.clientId}
            className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-wrap justify-between gap-4"
          >
            <div>
              <p className="font-bold">{c.name}</p>
              <p className="text-xs font-mono text-slate-400">{c.clientId}</p>
              <p className="text-xs text-slate-500 mt-1">
                {c.apiKeyPrefix}•••• | {c.environment} | {c.monthlyUsageCount}/{c.monthlyQuota} calls
              </p>
            </div>
            <button
              type="button"
              onClick={() => rotate(c.clientId)}
              className="text-sm px-3 py-1.5 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/10"
            >
              Rotate Key
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
