"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@web/components/ui/input";
import { Button } from "@web/components/ui/button";
import Link from "next/link";
import { Zap, LogIn, Eye, EyeOff, AlertCircle, GraduationCap, BookOpen } from "lucide-react";

// ─── Error messages ───────────────────────────────────────────────────────

const ERROR_MAP: Record<string, string> = {
  CredentialsSignin: "Invalid email or password. Please try again.",
  OAuthSignin: "Google sign-in failed to start. Please try again.",
  OAuthCallbackError: "Google sign-in failed. Try email/password instead.",
  OAuthAccountNotLinked: "This email is already registered. Please sign in with your original method.",
  Configuration: "Server configuration error. Please contact support.",
  Default: "Something went wrong. Please try again.",
};

// ─── Google sign-in button ────────────────────────────────────────────────

function GoogleButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-card-border bg-surface shadow-sm hover:bg-surface/80 hover:border-card-border-hover text-sm font-semibold text-foreground transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-foreground-subtle/40 border-t-foreground rounded-full animate-spin" />
      ) : (
        // FIXED: Using the standard 48x48 Google G Logo for perfect scaling
        <svg viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
      )}
      <span className={loading ? "opacity-60" : ""}>Continue with Google</span>
    </motion.button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-1 border-t border-card-border" />
      <span className="px-4 text-xs font-medium text-foreground-subtle/80 uppercase tracking-wider">
        Or continue with
      </span>
      <div className="flex-1 border-t border-card-border" />
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [error, setError] = useState<string>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (errorParam) {
      setError(ERROR_MAP[errorParam] ?? ERROR_MAP.Default);
    }
  }, [errorParam]);

  // ── After sign-in: route by role / onboarding status ─────────────────
  const routeAfterLogin = useCallback(async () => {
    const session = await getSession();
    if (!session?.user) {
      router.push(callbackUrl);
      return;
    }

    const { role, onboardingStatus, token } = session.user as any;

    // Persist backend token for API calls
    if (token) localStorage.setItem("voldebug_token", token);

    // Route based on onboarding status and role
    if (!onboardingStatus || onboardingStatus === "NOT_STARTED") {
      router.push("/role-select");
    } else if (onboardingStatus === "IN_PROGRESS") {
      if (role === "TEACHER") router.push("/onboarding/teacher");
      else router.push("/onboarding/student");
    } else {
      // Onboarding complete — route to role dashboard
      if (role === "TEACHER") router.push("/dashboard/teacher");
      else if (role === "ADMIN") router.push("/dashboard/admin");
      else router.push("/dashboard/student");
    }
  }, [callbackUrl, router]);

  // ── Google sign-in ────────────────────────────────────────────────────
  const handleGoogle = useCallback(async () => {
    setGoogleLoading(true);
    setError(undefined);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  }, []);

  // ── Email/password sign-in ────────────────────────────────────────────
  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setEmailLoading(true);
      setError(undefined);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(ERROR_MAP[result.error] ?? ERROR_MAP.Default);
        setEmailLoading(false);
        return;
      }

      await routeAfterLogin();
      setEmailLoading(false);
    },
    [email, password, routeAfterLogin]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        // NEW: Wrapped in a clean card UI
        className="bg-card border border-card-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-7"
      >
        {/* Logo & heading */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 mb-1 relative"
            style={{ boxShadow: "0 0 40px rgba(99,102,241,0.15)" }}
          >
            <Zap className="w-8 h-8 text-accent-light" />
          </motion.div>

          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-foreground-muted text-sm mt-2">
              Sign in to continue your AI learning journey
            </p>
          </div>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google CTA — primary */}
        <GoogleButton loading={googleLoading} onClick={handleGoogle} />

        {/* Divider */}
        <Divider />

        {/* Email/password form */}
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailLoading}
              className="w-full transition-shadow focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <button
                type="button"
                className="text-xs font-medium text-accent hover:text-accent-light transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={emailLoading}
                className="w-full pr-10 transition-shadow focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-semibold mt-2"
            disabled={emailLoading || !email || !password}
          >
            {emailLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Create account */}
        <p className="text-center text-sm text-foreground-muted">
          New to Voldebug?{" "}
          <Link href="/register" className="text-accent font-semibold hover:text-accent-light transition-colors">
            Create an account
          </Link>
        </p>

        {/* Role hint pills */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-card-border mt-6">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground-muted">
            <GraduationCap className="w-4 h-4" />
            <span>Students</span>
          </div>
          <span className="text-card-border">•</span>
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground-muted">
            <BookOpen className="w-4 h-4" />
            <span>Teachers</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}