"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap, Trophy, Star, Users, BookOpen, ChevronRight,
  Flame, Award, ArrowRight, Bot, Code2, Pen, Search, Image
} from "lucide-react";

// ─── Stagger ─────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 },
  }),
};

// ─── Data ────────────────────────────────────────────────────────────────

const STATS = [
  { value: "12,400+", label: "Students Learning" },
  { value: "350+", label: "AI Tools Curated" },
  { value: "98%", label: "Teacher Satisfaction" },
  { value: "4.2M", label: "XP Awarded This Month" },
];

const FEATURES = [
  {
    icon: Trophy,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    title: "Earn XP & Level Up",
    desc: "Every assignment, challenge, and tool you use earns XP. Watch your level climb the leaderboard.",
  },
  {
    icon: Bot,
    color: "text-accent-light",
    bg: "bg-accent/10 border-accent/20",
    title: "350+ AI Tools",
    desc: "A curated library of the best AI tools — categorized, rated, and matched to your assignments.",
  },
  {
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
    title: "Daily Streaks & Challenges",
    desc: "Come back every day to maintain your streak and tackle fresh challenges for bonus XP rewards.",
  },
  {
    icon: Users,
    color: "text-info",
    bg: "bg-info/10 border-info/20",
    title: "Class Leaderboard",
    desc: "Compete with classmates in real-time. Rankings update live as assignments are submitted and graded.",
  },
  {
    icon: Award,
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
    title: "Achievement Badges",
    desc: "Unlock rare badges for milestones: First Submission, Tool Explorer, Streak Master, and more.",
  },
  {
    icon: BookOpen,
    color: "text-success",
    bg: "bg-success/10 border-success/20",
    title: "Teacher-Designed Missions",
    desc: "Teachers create targeted assignments that guide you to the right AI tools for each subject.",
  },
];

const TOOL_CATEGORIES = [
  { icon: Bot, label: "Chat AI", color: "#6366f1" },
  { icon: Code2, label: "Code AI", color: "#06b6d4" },
  { icon: Image, label: "Image AI", color: "#ec4899" },
  { icon: Pen, label: "Writing AI", color: "#22c55e" },
  { icon: Search, label: "Research AI", color: "#f59e0b" },
];

const LEADERBOARD_PREVIEW = [
  { rank: 1, name: "Zara Ahmed", xp: 4820, level: 12, badge: "🥇" },
  { rank: 2, name: "Marcus Lee", xp: 4310, level: 11, badge: "🥈" },
  { rank: 3, name: "Priya Nair", xp: 3990, level: 10, badge: "🥉" },
  { rank: 4, name: "Diego Santos", xp: 3540, level: 9 },
  { rank: 5, name: "Aisha Green", xp: 3120, level: 8 },
];

// ─── Page ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Atmospheric background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-accent/8 blur-[160px]" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-purple-600/6 blur-[140px]" />
        <div className="absolute -bottom-40 right-1/3 w-[600px] h-[600px] rounded-full bg-info/5 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-base font-bold tracking-tight">
            <span className="text-gradient">VOLDEBUG</span>
            <span className="text-foreground-subtle text-xs ml-1 font-sans font-normal">AI PORTAL</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <Link
            href="/login"
            className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium shadow-lg shadow-accent/25 hover:bg-accent-light transition-all hover:shadow-accent/35"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            <motion.div
              custom={0} variants={fadeUp} initial="hidden" animate="show"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/8 text-accent-light text-xs font-medium"
            >
              <Star className="w-3 h-3 fill-current" />
              The AI Education Platform for Students 12–18
            </motion.div>

            <motion.h1
              custom={1} variants={fadeUp} initial="hidden" animate="show"
              className="font-display text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08]"
            >
              Learn AI.{" "}
              <span className="text-gradient">Earn XP.</span>{" "}
              Level Up{" "}
              <span className="relative whitespace-nowrap">
                for Real.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M1 9 C75 3, 175 3, 299 9" stroke="url(#gl)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gl" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </motion.h1>

            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate="show"
              className="text-foreground-muted text-lg leading-relaxed max-w-xl"
            >
              Voldebug connects students with 350+ AI tools through gamified teacher-assigned activities.
              Earn XP, unlock badges, and climb the leaderboard — all while mastering skills that matter.
            </motion.p>

            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate="show"
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-white font-semibold text-base shadow-lg shadow-accent/30 hover:bg-accent-light hover:shadow-accent/45 transition-all"
              >
                <Zap className="w-4.5 h-4.5" />
                Start Learning Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-card-border bg-surface/30 hover:bg-surface/60 hover:border-card-border-hover text-sm font-medium transition-all"
              >
                I&apos;m a Teacher <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              custom={4} variants={fadeUp} initial="hidden" animate="show"
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {["Z", "M", "P", "D", "A"].map((l, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-bg flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: ["#6366f1", "#06b6d4", "#ec4899", "#f59e0b", "#22c55e"][i] }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground-muted">
                <span className="text-foreground font-semibold">12,400+</span> students already learning
              </p>
            </motion.div>
          </div>

          {/* Right: Preview cards */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Leaderboard preview card */}
            <div className="card p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4.5 h-4.5 text-yellow-400" />
                  <span className="font-display text-sm font-semibold">Class Leaderboard</span>
                </div>
                <span className="xp-badge xp-badge-new text-xs">Live</span>
              </div>
              <div className="space-y-2">
                {LEADERBOARD_PREVIEW.map((entry, i) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.07, duration: 0.4 }}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                      i === 0 ? "bg-yellow-400/8 border border-yellow-400/15" : "hover:bg-surface/40"
                    }`}
                  >
                    <span className="w-5 text-center text-sm font-mono text-foreground-subtle">
                      {entry.badge ?? `#${entry.rank}`}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-xs font-bold">
                      {entry.name[0]}
                    </div>
                    <span className="flex-1 text-sm font-medium truncate">{entry.name}</span>
                    <span className="text-xs text-foreground-subtle">Lv {entry.level}</span>
                    <span className="stat-number text-sm text-accent-light">{entry.xp.toLocaleString()} XP</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating XP toast */}
            <motion.div
              initial={{ opacity: 0, y: 12, x: 12 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="absolute -right-6 top-1/3 card px-4 py-3 shadow-xl border-success/20 bg-success/5"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-success" />
                <div>
                  <p className="text-xs font-bold text-success">+75 XP Earned!</p>
                  <p className="text-xs text-foreground-subtle">Early submission bonus</p>
                </div>
              </div>
            </motion.div>

            {/* Floating level badge */}
            <motion.div
              initial={{ opacity: 0, y: 12, x: -12 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="absolute -left-6 bottom-12 card px-4 py-3 shadow-xl border-accent/20 bg-accent/5"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-accent-light fill-current" />
                <div>
                  <p className="text-xs font-bold text-accent-light">Level Up!</p>
                  <p className="text-xs text-foreground-subtle">You&apos;re now Level 12</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="relative z-10 border-y border-white/5 bg-card/30 backdrop-blur-sm py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="stat-number text-3xl md:text-4xl text-gradient">{s.value}</p>
              <p className="text-sm text-foreground-subtle mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Everything you need to{" "}
            <span className="text-gradient">master AI tools</span>
          </h2>
          <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
            A complete gamified learning platform designed with students and teachers in mind.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="card p-6 group"
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border mb-4 ${f.bg} ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── AI Tool Categories ─────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="font-display text-2xl font-bold">350+ AI Tools, Organized for Students</h2>
          <Link
            href="/login"
            className="hidden md:flex items-center gap-1.5 text-sm text-accent-light hover:underline"
          >
            Browse all tools <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {TOOL_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="card p-5 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${cat.color}18`, border: `1px solid ${cat.color}30` }}
              >
                <cat.icon className="w-6 h-6" style={{ color: cat.color }} />
              </div>
              <span className="text-sm font-medium text-center">{cat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-accent/10 to-purple-600/10 border border-accent/20 p-10 md:p-14 text-center"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent/10 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-purple-600/10 blur-[80px]" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 mb-2">
              <Zap className="w-8 h-8 text-accent-light" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Ready to start your AI journey?
            </h2>
            <p className="text-foreground-muted text-lg max-w-xl mx-auto">
              Join thousands of students already earning XP, unlocking badges, and learning the tools that power tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold text-base shadow-xl shadow-accent/30 hover:bg-accent-light hover:shadow-accent/45 transition-all"
              >
                <Zap className="w-5 h-5" />
                Create Student Account
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-all"
              >
                Sign in as Teacher <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-foreground-subtle">
        <p>© 2025 Voldebug AI Education Portal · Empowering the next generation of AI-literate learners</p>
      </footer>
    </div>
  );
}