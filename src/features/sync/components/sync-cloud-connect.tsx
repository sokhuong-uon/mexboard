import { MagicLinkSignInForm } from "@/features/auth/components/magic-link-sign-in-form";
import { authClient } from "@/features/auth/lib/better-auth-client";
import { SyncDashboard } from "@/features/sync/components/sync-dashboard";

export function SyncCloudConnect() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="w-full h-[calc(100vh-9rem)] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (session) {
    return <SyncDashboard />;
  }

  return (
    <div className="w-full h-[calc(100vh-9rem)] flex items-center">
      <MagicLinkSignInForm />
    </div>
  );
}
