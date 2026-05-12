import { fetch as tauriFetch } from "@tauri-apps/plugin-http"
import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins"
import { authBearerTokenStore } from "@/features/auth/stores/auth-bearer-token-store"
import { polarClient } from "@polar-sh/better-auth/client"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_BASE_URL,
  plugins: [magicLinkClient(), polarClient()],

  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => authBearerTokenStore.get() ?? "",
    },

    customFetchImpl: async (input, init) => {
      const res = await tauriFetch(input, { ...init, maxRedirections: 0 })

      const newToken = res.headers.get("set-auth-token")
      if (newToken) await authBearerTokenStore.set(newToken)

      return res
    },
  },
});
