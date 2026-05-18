'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Key,
  Webhook,
  BarChart3,
  BookOpen,
  Terminal,
  LayoutDashboard,
  AppWindow,
} from 'lucide-react';

const nav = [
  { href: '/developer', label: 'Overview', icon: LayoutDashboard },
  { href: '/developer/api-keys', label: 'API Keys', icon: Key },
  { href: '/developer/oauth-apps', label: 'OAuth Apps', icon: AppWindow },
  { href: '/developer/webhooks', label: 'Webhooks', icon: Webhook },
  { href: '/developer/usage', label: 'Usage', icon: BarChart3 },
  { href: '/developer/docs', label: 'Documentation', icon: BookOpen },
  { href: '/developer/playground', label: 'Playground', icon: Terminal },
];

export function DeveloperShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex">
      <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl p-4 flex flex-col shrink-0">
        <div className="mb-8 px-2">
          <p className="text-xs font-bold text-cyan-400 tracking-widest uppercase">MedFlow</p>
          <h1 className="text-xl font-bold">Developer Portal</h1>
        </div>
        <nav className="flex-1 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link href="/erp-intelligence" className="text-xs text-slate-500 hover:text-cyan-400 px-3 py-2">
          ← Back to Admin
        </Link>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
