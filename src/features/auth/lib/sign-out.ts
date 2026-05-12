import { authClient } from "@/features/auth/lib/better-auth-client";
import { authBearerTokenStore } from "@/features/auth/stores/auth-bearer-token-store";

export async function signOut() {
  await authClient.signOut();
  await authBearerTokenStore.clear();
}
