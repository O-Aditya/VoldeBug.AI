import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession } from "next-auth";

// ── Type augmentation ────────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      onboardingStatus: string;
      token?: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    role: string;
    onboardingStatus: string;
    token?: string;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    // ── Google OAuth ────────────────────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          // Always show account picker so users can switch accounts
          prompt: "select_account",
        },
      },
    }),

    // ── Email / Password ────────────────────────────────────────────────
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${API_URL}/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          const json = await res.json();
          if (!res.ok || !json.data) return null;
          // json.data = { id, email, name, role, onboardingStatus, token }
          return json.data;
        } catch {
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    // ── Called after successful OAuth sign-in (Google etc.) ─────────────
    async signIn({ user, account }) {
      if (account?.provider !== "credentials" && user.email) {
        try {
          const res = await fetch(`${API_URL}/v1/auth/provider`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name ?? "",
              image: user.image ?? "",
            }),
          });
          const json = await res.json();


          if (res.ok && json.data) {
            // Merge backend user into NextAuth user object
            if (json.data.id) user.id = json.data.id;
            if (json.data.role) user.role = json.data.role;
            if (json.data.onboardingStatus) user.onboardingStatus = json.data.onboardingStatus;
            // Capture backend-issued JWT for authenticated API calls
            if (json.data.token) (user as any).token = json.data.token;
          }

        } catch {
          // Graceful fallback — user will go to role-select
          user.role = "STUDENT";
          user.onboardingStatus = "NOT_STARTED";
        }
      }
      return true;
    },

    // ── Encode extra fields into the JWT ─────────────────────────────────
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role ?? "STUDENT";
        token.onboardingStatus = user.onboardingStatus ?? "NOT_STARTED";
        token.backendToken = (user as any).token; // only present for credentials login
      }
      return token;
    },

    // ── Expose fields to the client session ──────────────────────────────
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | undefined;
        session.user.role = token.role as string;
        session.user.onboardingStatus = token.onboardingStatus as string;
        session.user.token = token.backendToken as string | undefined;
      }
      return session;
    },
  },

  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
});