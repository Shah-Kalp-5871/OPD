import { Suspense } from 'react';
import BillingView from '@/views/reception/billing/page';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Billing & Payment | MedFlow OPD',
  description: 'Manage patient billing, collection, and receipt generation for OPD services.',
};

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Financial Records...</p>
      </div>
    }>
      <BillingView />
    </Suspense>
  );
}
