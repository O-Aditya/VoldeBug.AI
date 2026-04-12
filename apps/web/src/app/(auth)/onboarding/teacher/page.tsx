"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Lightbulb, Trophy, ChevronRight,
  ChevronLeft, Building2, BookOpen, Zap, CheckCircle2, AlertCircle
} from "lucide-react";

// ─── Steps config ─────────────────────────────────────────────────────────

const STEPS = [
  { id: "welcome", title: "Welcome, Teacher!" },
  { id: "features", title: "Your Teacher Tools" },
  { id: "setup", title: "Set Up Your Class" },
];

const TEACHER_FEATURES = [
  {
    icon: BookOpen,
    color: "#6366f1",
    title: "Create Assignments",
    description: "Design AI-powered missions that direct students to the right tools.",
  },
  {
    icon: Users,
    color: "#06b6d4",
    title: "Manage Students",
    description: "Track progress, grade submissions, and keep students engaged.",
  },
  {
    icon: Trophy,
    color: "#f59e0b",
    title: "Class Analytics",
    description: "Real-time insights: completion rates, average scores, and tool usage.",
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
      <div className="text-6xl animate-float">🏫</div>
      <div className="space-y-3">
        <h2 className="font-display text-2xl md:text-3xl font-bold">
          Welcome{name ? `, ${name.split(" ")[0]}` : ""}!
        </h2>
        <p className="text-foreground-muted text-base max-w-sm mx-auto leading-relaxed">
          You're joining a platform designed to make AI literacy accessible for every student. Let's get your classroom set up.
        </p>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent-surface border border-accent/20 text-sm text-accent-light">
        <Lightbulb className="w-4.5 h-4.5 flex-shrink-0" />
        <span>Students can't join until you create your first class.</span>
      </div>
    </motion.div>
  );
}

function FeaturesStep() {
  return (
    <motion.div
      key="features"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl font-bold">Your Teacher Tools</h2>
        <p className="text-foreground-muted text-sm mt-1.5">Everything you need to run an AI-powered classroom</p>
      </div>

      <div className="space-y-3">
        {TEACHER_FEATURES.map((item, i) => (
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SetupStep({
  schoolName,
  className,
  subject,
  setSchoolName,
  setClassName,
  setSubject,
  error,
}: {
  schoolName: string;
  className: string;
  subject: string;
  setSchoolName: (v: string) => void;
  setClassName: (v: string) => void;
  setSubject: (v: string) => void;
  error?: string;
}) {
  const SUBJECTS = [
    "Computer Science", "Mathematics", "Science", "English",
    "History", "Art", "Business", "Other"
  ];

  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="space-y-5"
    >
      <div className="text-center mb-4">
        <h2 className="font-display text-2xl font-bold">Set Up Your Class</h2>
        <p className="text-foreground-muted text-sm mt-1.5">Create your school profile and first classroom</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-error/8 border border-error/20 text-error text-sm">
          <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="schoolName" className="text-sm font-medium flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-foreground-subtle" />
            School Name
            <span className="text-error ml-auto text-xs font-normal">required</span>
          </label>
          <input
            id="schoolName"
            type="text"
            required
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="input-base"
            placeholder="Springfield High School"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="className" className="text-sm font-medium flex items-center gap-1.5">
            <Users className="w-4 h-4 text-foreground-subtle" />
            Class Name
            <span className="text-error ml-auto text-xs font-normal">required</span>
          </label>
          <input
            id="className"
            type="text"
            required
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="input-base"
            placeholder="AI Explorers — Period 2"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="subject" className="text-sm font-medium flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-foreground-subtle" />
            Subject
          </label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input-base"
          >
            <option value="">Select subject (optional)</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function TeacherOnboarding() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [schoolName, setSchoolName] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const userName = session?.user?.name ?? "";

  const handleSubmit = useCallback(async () => {
    if (!schoolName.trim() || !className.trim()) {
      setError("School name and class name are required.");
      return;
    }
    setSubmitting(true);
    setError(undefined);

    try {
      const token = (session?.user as any)?.token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/v1/users/onboarding/teacher`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            schoolName: schoolName.trim(),
            className: className.trim(),
            subject: subject || undefined,
          }),
        }
      );

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message ?? "Setup failed. Please try again.");
      }

      await update({ onboardingStatus: "COMPLETED" });
      router.replace("/dashboard/teacher");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }, [schoolName, className, subject, session, update, router]);

  const isLastStep = step === STEPS.length - 1;
  const canNext = step < STEPS.length - 1;
  const isSetupValid = schoolName.trim().length > 0 && className.trim().length > 0;

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                  i < step
                    ? "w-6 h-6 bg-success"
                    : i === step
                    ? "w-6 h-6 bg-accent"
                    : "w-2 h-2 bg-card-border"
                }`}
              >
                {i < step && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                {i === step && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-8 rounded-full transition-all duration-500 ${i < step ? "bg-success" : "bg-card-border"}`} />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-foreground-subtle">
          Step {step + 1} of {STEPS.length} — {STEPS[step].title}
        </p>

        {/* Card */}
        <div className="card p-6 md:p-8 min-h-[340px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {step === 0 && <WelcomeStep name={userName} />}
              {step === 1 && <FeaturesStep />}
              {step === 2 && (
                <SetupStep
                  schoolName={schoolName}
                  className={className}
                  subject={subject}
                  setSchoolName={setSchoolName}
                  setClassName={setClassName}
                  setSubject={setSubject}
                  error={error}
                />
              )}
            </AnimatePresence>
          </div>

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
                disabled={submitting || !isSetupValid}
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
                    Launch My Classroom!
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