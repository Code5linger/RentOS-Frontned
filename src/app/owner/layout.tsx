// src/app/owner/layout.tsx
import { OwnerSidebar } from '@/components/layout/owner-sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { OfflineBanner } from '@/components/shared/offline-banner';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <OfflineBanner />
      <OwnerSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
