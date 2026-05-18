'use client';

import { useState } from 'react';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/api/v2/patients');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setResponse('');
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const url = `${base.replace(/\/api$/, '')}${path}`;
      const res = await fetch(url, {
        method,
        headers: { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' },
      });
      const text = await res.text();
      setResponse(`HTTP ${res.status}\n\n${text}`);
    } catch (e) {
      setResponse(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">API Playground</h1>
      <div className="space-y-4 max-w-3xl">
        <input
          type="password"
          placeholder="X-Api-Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-mono"
        />
        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
          </select>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-mono"
          />
          <button
            type="button"
            onClick={run}
            disabled={loading || !apiKey}
            className="px-4 py-2 bg-cyan-600 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <pre className="bg-black/50 border border-white/10 rounded-xl p-4 text-xs font-mono text-slate-300 min-h-[200px] whitespace-pre-wrap">
          {loading ? 'Loading...' : response || 'Response will appear here'}
        </pre>
      </div>
    </div>
  );
}
