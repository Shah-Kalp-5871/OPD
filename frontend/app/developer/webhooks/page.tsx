'use client';

import { useEffect, useState } from 'react';
import { developerApi } from '@/lib/api/developer';

type EventDef = { eventType: string; category: string; description: string };

export default function WebhooksPage() {
  const [events, setEvents] = useState<EventDef[]>([]);

  useEffect(() => {
    developerApi.getWebhookCatalog().then((res: unknown) => {
      const r = res as { data?: { events?: EventDef[] }; events?: EventDef[] };
      setEvents(r.data?.events ?? r.events ?? []);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Webhook Marketplace</h1>
      <p className="text-slate-400 text-sm mb-6">HMAC-SHA256 signed deliveries with retry & dead-letter queue</p>
      <div className="grid gap-3">
        {events.map((e) => (
          <div key={e.eventType} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <code className="text-cyan-300 text-sm">{e.eventType}</code>
              <span className="text-xs text-slate-500 uppercase">{e.category}</span>
            </div>
            <p className="text-sm text-slate-400 mt-2">{e.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
