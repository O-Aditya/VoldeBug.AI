"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Trophy, Zap, CheckCircle2, ChevronRight,
  ChevronLeft, User, GraduationCap, AlertCircle
} from "lucide-react";

// ─── Steps config ─────────────────────────────────────────────────────────

const STEPS = [
  { id: "welcome", title: "Welcome!" },
  { id: "how-it-works", title: "How It Works" },
  { id: "setup", title: "Set Up Profile" },
];

const HOW_IT_WORKS_ITEMS = [
  {
    icon: Bot,
    color: "#6366f1",
    title: "Explore AI Tools",
    description: "Browse 350+ curated AI tools categorized by subject and use case.",
  },
  {
    icon: GraduationCap,
    color: "#06b6d4",
    title: "Complete Assignments",
    description: "Your teachers post missions. Use the suggested AI tools to complete them.",
  },
  {
    icon: Trophy,
    color: "#f59e0b",
    title: "Earn XP & Badges",
    description: "Every submission earns XP. Level up, unlock badges, and top the leaderboard.",
  },
];

// ─── Step components ──────────────────────────────────────────────────────

function WelcomeStep({ name }: { name: string }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="flex flex-col items-center text-center gap-6 py-4"
    >
      <div className="text-6xl animate-float">🤖</div>
      <div className="space-y-3">
        <h2 className="font-display text-2xl md:text-3xl font-bold">
          Welcome to Voldebug{name ? `, ${name.split(" ")[0]}` : ""}!
        </h2>
        <p className="text-foreground-muted text-base max-w-sm mx-auto leading-relaxed">
          You're about to join thousands of students learning AI skills through real assignments and friendly competition.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-sm mt-2">
        {[
          { value: "350+", label: "AI Tools" },
          { value: "12K+", label: "Students" },
          { value: "∞", label: "XP to earn" },
        ].map((s) => (
          <div key={s.label} className="card p-3 text-center">
            <p className="stat-number text-xl text-accent-light">{s.value}</p>
            <p className="text-xs text-foreground-subtle mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function HowItWorksStep() {
  return (
    <motion.div
      key="how"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl font-bold">How It Works</h2>
        <p className="text-foreground-muted text-sm mt-1.5">Three simple steps to master AI tools</p>
      </div>

      <div className="space-y-3">
        {HOW_IT_WORKS_ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-4 flex items-start gap-4"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${item.color}18`, border: `1px solid ${item.color}30` }}
            >
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-foreground-muted mt-0.5 leading-relaxed">{item.description}</p>
            </div>
            <div className="ml-auto text-foreground-subtle/30 text-2xl font-bold font-display flex-shrink-0">
              {i + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SetupStep({
  gradeLevel,
  studentId,
  setGradeLevel,
  setStudentId,
  error,
}: {
  gradeLevel: string;
  studentId: string;
  setGradeLevel: (v: string) => void;
  setStudentId: (v: string) => void;
  error?: string;
}) {
  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="space-y-5"
    >
      <div className="text-center mb-4">
        <h2 className="font-display text-2xl font-bold">Set Up Your Profile</h2>
        <p className="text-foreground-muted text-sm mt-1.5">Just two quick details and you're in</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-error/8 border border-error/20 text-error text-sm">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="gradeLevel" className="text-sm font-medium flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-foreground-subtle" />
            Grade Level
            <span className="text-error">*</span>
          </label>
          <select
            id="gradeLevel"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="input-base"
            required
          >
            <option value="">Select your grade…</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Grade {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="studentId" className="text-sm font-medium flex items-center gap-1.5">
            <User className="w-4 h-4 text-foreground-subtle" />
            Student ID
            <span className="text-foreground-subtle text-xs font-normal ml-1">(optional)</span>
          </label>
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="input-base"
            placeholder="STU-0001"
          />
          <p className="text-xs text-foreground-subtle">
            Provided by your school. Leave blank if you don't have one.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function StudentOnboarding() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [gradeLevel, setGradeLevel] = useState("");
  const [studentId, setStudentId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const userName = session?.user?.name ?? "";

  const handleSubmit = useCallback(async () => {
    if (!gradeLevel) {
      setError("Please select your grade level.");
      return;
    }
    setSubmitting(true);
    setError(undefined);

    try {
      const token = (session?.user as any)?.token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/v1/users/onboarding/student`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            gradeLevel: Number(gradeLevel),
            studentId: studentId || undefined,
          }),
        }
      );

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message ?? "Setup failed. Please try again.");
      }

      // Refresh session with new onboarding status
      await update({ onboardingStatus: "COMPLETED" });
      router.replace("/dashboard/student");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }, [gradeLevel, studentId, session, update, router]);

  const isLastStep = step === STEPS.length - 1;
  const canNext = step < STEPS.length - 1;

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                  i < step
                    ? "w-6 h-6 bg-success text-white"
                    : i === step
                    ? "w-6 h-6 bg-accent"
                    : "w-2 h-2 bg-card-border"
                }`}
              >
                {i < step && <CheckCircle2 className="w-3.5 h-3.5" />}
                {i === step && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-8 rounded-full transition-all duration-500 ${
                    i < step ? "bg-success" : "bg-card-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step label */}
        <p className="text-center text-xs text-foreground-subtle">
          Step {step + 1} of {STEPS.length} — {STEPS[step].title}
        </p>

        {/* Card */}
        <div className="card p-6 md:p-8 min-h-[320px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {step === 0 && <WelcomeStep name={userName} />}
              {step === 1 && <HowItWorksStep />}
              {step === 2 && (
                <SetupStep
                  gradeLevel={gradeLevel}
                  studentId={studentId}
                  setGradeLevel={setGradeLevel}
                  setStudentId={setStudentId}
                  error={error}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Nav buttons */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => { setStep((s) => s - 1); setError(undefined); }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-card-border hover:bg-surface/60 text-sm font-medium transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}

            {canNext && (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm shadow-md shadow-accent/20 hover:bg-accent-light transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {isLastStep && (
              <button
                onClick={handleSubmit}
                disabled={submitting || !gradeLevel}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm shadow-md shadow-accent/20 hover:bg-accent-light transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Start Learning!
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}