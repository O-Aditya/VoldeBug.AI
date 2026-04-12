"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  return {
    session,
    status, // "loading" | "authenticated" | "unauthenticated"
    isAuthenticated: status === "authenticated",
    user: session?.user,
  };
}