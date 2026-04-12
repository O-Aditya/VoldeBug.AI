"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, BookOpen, ChevronRight,
  Zap, Trophy, Bot, Users, Lightbulb, AlertCircle
} from "lucide-react";

// ─── Role definitions ─────────────────────────────────────────────────────

const ROLES = [
  {
    id: "STUDENT",
    label: "I'm a Student",
    description: "Explore AI tools assigned by teachers, earn XP, and climb the class leaderboard.",
    icon: GraduationCap,
    color: "#6366f1",
    perks: [
      { icon: Bot, text: "Access 350+ curated AI tools" },
      { icon: Trophy, text: "Earn XP and unlock badges" },
      { icon: Zap, text: "Complete teacher-assigned missions" },
    ],
  },
  {
    id: "TEACHER",
    label: "I'm a Teacher",
    description: "Create assignments, guide students to the right AI tools, and track class analytics.",
    icon: BookOpen,
    color: "#06b6d4",
    perks: [
      { icon: Users, text: "Manage students and classes" },
      { icon: Lightbulb, text: "Create AI-powered assignments" },
      { icon: Trophy, text: "View class performance & analytics" },
    ],
  },
] as const;

type RoleId = "STUDENT" | "TEACHER";

// ─── Page ─────────────────────────────────────────────────────────────────

export default function RoleSelectPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [selected, setSelected] = useState<RoleId | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleConfirm = useCallback(async () => {
    if (!selected) return;
    setLoading(true);
    setError(undefined);

    try {
      const token = (session?.user as any)?.token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/v1/auth/role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ role: selected }),
        }
      );

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message ?? "Failed to set role.");
      }

      // Refresh the NextAuth session so role is updated in the JWT
      await update({ role: selected, onboardingStatus: "IN_PROGRESS" });

      // Route to the appropriate onboarding flow
      router.push(selected === "TEACHER" ? "/onboarding/teacher" : "/onboarding/student");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  }, [selected, session, update, router]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20"
            style={{ boxShadow: "0 0 30px rgba(99,102,241,0.15)" }}
          >
            <Zap className="w-8 h-8 text-accent-light" />
          </motion.div>

          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              How will you use Voldebug?
            </h1>
            <p className="text-foreground-muted text-sm mt-2">
              Choose your role to personalize your experience. You can only do this once.
            </p>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-error/8 border border-error/20 text-error text-sm"
            >
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLES.map((role, i) => {
            const isSelected = selected === role.id;
            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                onClick={() => setSelected(role.id)}
                className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 group ${
                  isSelected
                    ? "border-accent bg-accent-surface shadow-lg shadow-accent/10"
                    : "border-card-border bg-card hover:border-card-border-hover hover:bg-card-hover"
                }`}
              >
                {/* Selection indicator */}
                <div
                  className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-accent bg-accent"
                      : "border-card-border-hover"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full rounded-full flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </motion.div>
                  )}
                </div>

                {/* Role icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: `${role.color}${isSelected ? "25" : "15"}`,
                    border: `1px solid ${role.color}${isSelected ? "40" : "25"}`,
                    transition: "background-color 0.2s",
                  }}
                >
                  <role.icon className="w-6 h-6" style={{ color: role.color }} />
                </div>

                <h2 className="font-display text-lg font-bold mb-2">{role.label}</h2>
                <p className="text-sm text-foreground-muted leading-relaxed mb-4">
                  {role.description}
                </p>

                {/* Perks list */}
                <ul className="space-y-2">
                  {role.perks.map((perk) => (
                    <li key={perk.text} className="flex items-center gap-2.5 text-xs text-foreground-muted">
                      <perk.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: role.color }} />
                      {perk.text}
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        {/* Confirm button */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent text-white font-semibold text-base shadow-lg shadow-accent/25 hover:bg-accent-light transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up your account…
                  </>
                ) : (
                  <>
                    Continue as {selected === "STUDENT" ? "Student" : "Teacher"}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer note */}
        <p className="text-xs text-foreground-subtle text-center">
          Your role cannot be changed after setup. Contact an admin if you need to switch.
        </p>
      </motion.div>
    </div>
  );
}