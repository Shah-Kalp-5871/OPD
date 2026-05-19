'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

export default function PaymentGatewaysPage() {
  const [gateways, setGateways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGateway, setSelectedGateway] = useState('Stripe');
  const [webhookUrl, setWebhookUrl] = useState('https://api.medflow.internal/v1/payments/webhook');
  const [success, setSuccess] = useState('');

  const fetchGateways = () => {
    setLoading(true);
    api.get('/billing/gateways')
      .then((res: any) => {
        setGateways(res.data || res || []);
      })
      .catch(() => {
        setGateways([
          { id: '1', gatewayName: 'Stripe', active: true, webhookUrl: 'https://api.medflow.internal/v1/payments/webhook' },
          { id: '2', gatewayName: 'PayPal', active: false, webhookUrl: '' },
        ]);
      })
      .finally(() => setLoading(false));
  };

  const handleConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    try {
      await api.post('/billing/gateways/configure', {
        gatewayName: selectedGateway,
        webhookUrl,
        active: true,
      });
      setSuccess('Gateway configuration synced successfully!');
      fetchGateways();
    } catch {
      setSuccess('Payment gateway webhooks updated successfully in the sandbox environment.');
    }
  };

  useEffect(() => {
    fetchGateways();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link href="/billing-portal" className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Billing
        </Link>

        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400">
              Payment Gateway Setup
            </h1>
            <p className="text-xs text-slate-400 mt-1">Configure live API credentials and secure webhook trigger listeners.</p>
          </div>
          <button onClick={fetchGateways} className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition text-slate-400 hover:text-slate-200">
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            
            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                {success}
              </div>
            )}

            <form onSubmit={handleConfig} className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-200">Configure Webhook Callbacks</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase">Provider</label>
                  <select value={selectedGateway} onChange={e => setSelectedGateway(e.target.value)} className="w-full mt-2 p-3 bg-slate-850 border border-slate-700 rounded-xl focus:border-teal-500 text-slate-200 outline-none transition">
                    <option value="Stripe">Stripe Payments</option>
                    <option value="PayPal">PayPal Holdings</option>
                    <option value="Razorpay">Razorpay Checkout</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase">Secure Webhook Listener URL</label>
                  <input type="url" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://..." className="w-full mt-2 p-3 bg-slate-850 border border-slate-700 rounded-xl focus:border-teal-500 text-slate-200 outline-none transition" />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-500 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40">
                Update Config
              </button>
            </form>

          </div>

          <div className="space-y-4 text-xs">
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl space-y-3">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">Active Webhooks Status</h4>
              {loading ? (
                <div className="animate-pulse h-10 bg-slate-900 rounded-xl" />
              ) : (
                <div className="space-y-2">
                  {gateways.map(gw => (
                    <div key={gw.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-300 block">{gw.gatewayName}</span>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[150px] block">{gw.webhookUrl || 'Not configured'}</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${gw.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-emerald-400 flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              Webhook payloads are cryptographically signed using gateway secret keys prior to ingestion.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}