// src/app/tenant/layout.tsx
import { TenantBottomNav } from '@/components/layout/tenant-bottom-nav';
import { OfflineBanner } from '@/components/shared/offline-banner';

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <OfflineBanner />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <TenantBottomNav />
    </div>
  );
}
