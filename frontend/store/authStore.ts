import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatarInitials: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string, username?: string) => void;
  logout: () => void;
};

function initialsFromName(nameOrEmail: string) {
  const parts = nameOrEmail
    .replace(/@.*/, "")
    .split(/[\s._-]+/)
    .filter(Boolean);

  return (parts[0]?.[0] ?? "P").concat(parts[1]?.[0] ?? "T").toUpperCase();
}

function usernameFromEmail(email: string) {
  return email.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() || "polytrader";
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (email) => {
        const username = usernameFromEmail(email);
        const displayName = username
          .split(/[_-]/)
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ") || "Poly Trader";

        set({
          user: {
            id: "user_mock_001",
            name: displayName,
            username,
            email,
            role: "user",
            avatarInitials: initialsFromName(displayName),
          },
          token: "polytrade_mock_token",
          isAuthenticated: true,
        });
      },
      register: (name, email, _password, username) => {
        const safeUsername = username?.trim() || usernameFromEmail(email);

        set({
          user: {
            id: "user_mock_001",
            name,
            username: safeUsername,
            email,
            role: "user",
            avatarInitials: initialsFromName(name),
          },
          token: "polytrade_mock_token",
          isAuthenticated: true,
        });
      },
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "polytrade-auth",
    },
  ),
);
