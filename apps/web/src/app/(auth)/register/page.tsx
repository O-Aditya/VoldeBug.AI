"use client";

import { useState, useCallback, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Input } from "@web/components/ui/input";
import { Button } from "@web/components/ui/button";
import { Zap, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

// ─── Password strength ────────────────────────────────────────────────────

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-error" };
  if (score <= 2) return { score, label: "Fair", color: "bg-warning" };
  if (score <= 3) return { score, label: "Good", color: "bg-info" };
  return { score, label: "Strong", color: "bg-success" };
}

// ─── Google button ────────────────────────────────────────────────────────

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
        <svg viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
      )}
      <span className={loading ? "opacity-60" : ""}>Sign up with Google</span>
    </motion.button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-1 border-t border-card-border" />
      <span className="px-4 text-xs font-medium text-foreground-subtle/80 uppercase tracking-wider">
        Or register with
      </span>
      <div className="flex-1 border-t border-card-border" />
    </div>
  );
}

// ─── Register form ────────────────────────────────────────────────────────

function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(password);

  // ── Google sign-up ──────────────────────────────────────────────────────
  const handleGoogle = useCallback(async () => {
    setGoogleLoading(true);
    setError(undefined);
    // Google sign-up = same flow as Google sign-in; backend auto-creates user
    await signIn("google", { callbackUrl: "/role-select" });
  }, []);

  // ── Email / password registration ───────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      setLoading(true);
      setError(undefined);

      try {
        // 1. Register with backend API
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/v1/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? "Registration failed.");

        // 2. Auto-sign in after registration
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          router.push("/login?registered=1");
          return;
        }

        // 3. Success — go to role selection
        setSuccess(true);
        setTimeout(() => router.push("/role-select"), 800);
      } catch (err: any) {
        setError(err.message ?? "Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [name, email, password, router]
  );

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-12 text-center bg-card border border-card-border rounded-3xl shadow-sm max-w-md mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <div>
          <p className="font-display text-xl font-bold text-foreground">Account created!</p>
          <p className="text-sm text-foreground-muted mt-2">Setting up your profile…</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card border border-card-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-7"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 relative"
            style={{ boxShadow: "0 0 40px rgba(99,102,241,0.15)" }}
          >
            <UserPlus className="w-7 h-7 text-accent-light" />
          </motion.div>

          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
            <p className="text-foreground-muted text-sm mt-2">Join 12,000+ students on Voldebug</p>
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

        {/* Google */}
        <GoogleButton loading={googleLoading} onClick={handleGoogle} />

        {/* Divider */}
        <Divider />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Full name
            </label>
            <Input
              id="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full transition-shadow focus:ring-2 focus:ring-accent/20"
            />
          </div>

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
              disabled={loading}
              className="w-full transition-shadow focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pr-10 transition-shadow focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>

            {/* Password strength meter */}
            {password.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 mt-2">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strength.score >= i ? strength.color : "bg-surface border border-card-border"
                        }`}
                    />
                  ))}
                </div>
                {strength.label && (
                  <p className={`text-xs font-semibold ${strength.label === "Weak" ? "text-error" :
                      strength.label === "Fair" ? "text-warning" :
                        strength.label === "Good" ? "text-info" : "text-success"
                    }`}>
                    {strength.label} password
                  </p>
                )}
              </motion.div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-semibold mt-2"
            disabled={loading || !name || !email || password.length < 8}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Creating account…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>

        {/* Terms */}
        <p className="text-xs text-foreground-muted text-center leading-relaxed px-4">
          By registering, you agree to our{" "}
          <a href="#" className="text-accent font-medium hover:text-accent-light transition-colors">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-accent font-medium hover:text-accent-light transition-colors">Privacy Policy</a>.
        </p>

        {/* Switch to login */}
        <p className="text-center text-sm text-foreground-muted border-t border-card-border pt-6 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent font-semibold hover:text-accent-light transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}