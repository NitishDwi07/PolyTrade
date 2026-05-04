import type { AuthUser } from "@/store/authStore";

export function resolveUserId(user: AuthUser | null) {
  const parsed = Number(user?.id);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
