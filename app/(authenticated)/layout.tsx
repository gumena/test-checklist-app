'use client';

import Sidebar from '@/components/shared/Sidebar';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="pl-0 md:pl-64 transition-all">
        <div className="relative z-10">{children}</div>
      </main>
    </>
  );
}
