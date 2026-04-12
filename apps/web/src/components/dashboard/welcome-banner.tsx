"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface WelcomeBannerProps {
  name: string;
  level: number;
  xpToNext: number;
  currentXP: number;
}

export function WelcomeBanner({ name, level, xpToNext, currentXP }: WelcomeBannerProps) {
  const displayName = name.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 via-accent-surface to-transparent border border-accent/10 p-6 md:p-8"
    >
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-info/5 blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-light" />
            <p className="text-sm font-medium text-accent-light uppercase tracking-wider">
              Level {level}
            </p>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {displayName}!
          </h1>
          <p className="text-foreground-muted text-sm">
            You&apos;re {xpToNext} XP away from Level {level + 1}. Keep going!
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="stat-number text-4xl font-bold text-gradient">
            {currentXP}
          </span>
          <span className="text-foreground-muted text-sm font-medium">XP</span>
        </div>
      </div>
    </motion.div>
  );
}
