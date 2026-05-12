import { create } from "zustand";
import { commands } from "@/bindings";

type AuthBearerTokenState = {
  token: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  set: (token: string) => Promise<void>;
  clear: () => Promise<void>;
};

export const useAuthBearerTokenStore = create<AuthBearerTokenState>()((set) => ({
  token: null,
  hydrated: false,

  hydrate: async () => {
    const token = await commands.getSessionToken();
    set({ token, hydrated: true });
  },

  set: async (token) => {
    await commands.saveSessionToken(token);
    set({ token });
  },

  clear: async () => {
    await commands.deleteSessionToken();
    set({ token: null, hydrated: false });
  },
}));

export const authBearerTokenStore = {
  get: () => useAuthBearerTokenStore.getState().token,
  set: (token: string) => useAuthBearerTokenStore.getState().set(token),
  clear: () => useAuthBearerTokenStore.getState().clear(),
  hydrate: () => useAuthBearerTokenStore.getState().hydrate(),
};
