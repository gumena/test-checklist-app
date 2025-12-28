'use client';

export default function BillingPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-zinc-200 tracking-tight mb-2">
          Billing
        </h1>
        <p className="text-sm text-zinc-400 font-light">
          Manage your plan, invoices, and payment method.
        </p>
      </div>

      <div className="bg-[#0f0f10] border border-zinc-800 rounded-xl p-6">
        <p className="text-sm text-zinc-400">
          Billing is not configured yet.
        </p>
      </div>
    </div>
  );
}

