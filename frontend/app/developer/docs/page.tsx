'use client';

import { useEffect, useState } from 'react';
import { developerApi } from '@/lib/api/developer';

export default function DeveloperDocsPage() {
  const [onboarding, setOnboarding] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    developerApi.getPublicDocs().then((res: unknown) => {
      const r = res as { data?: typeof onboarding };
      setOnboarding(r.data ?? (res as typeof onboarding));
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">API Documentation</h1>
      <div className="grid gap-6">
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-cyan-300 font-bold mb-3">Authentication</h2>
          <pre className="text-xs bg-black/40 p-4 rounded-lg overflow-x-auto text-slate-300">
{`curl -H "X-Api-Key: mf_live_YOUR_KEY" \\
  https://api.medflow.health/api/v2/patients`}
          </pre>
        </section>
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-cyan-300 font-bold mb-3">Onboarding Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
            {((onboarding?.steps as string[]) ?? []).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-cyan-300 font-bold mb-3">SDK Packages</h2>
          <p className="text-sm text-slate-400">
            TypeScript, Python, and Java SDKs are in <code className="text-cyan-400">/sdk/</code> at repo root.
            See <code className="text-cyan-400">docs/developer/</code> for full OpenAPI spec.
          </p>
        </section>
      </div>
    </div>
  );
}
