"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@web/lib/api";
import { Trophy, Crown, Flame, Medal, Sparkles } from "lucide-react";
import { GradientMesh } from "@web/components/ui/background";
import { useSession } from "next-auth/react";

// ─── Types ──────────────────────────────────────────────────────────────

interface LeaderboardEntry {
  userId: string;
  name: string | null;
  image: string | null;
  totalXP: number;
  level: number;
  rank: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  classId: string;
}

// ─── Hooks ──────────────────────────────────────────────────────────────

function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => api.get<LeaderboardResponse>("/v1/gamification/scoreboard"),
    staleTime: 30_000,
    refetchInterval: 15_000,
    retry: 2,
  });
}

// ─── Motion Variants ──────────────────────────────────────────────────────

const smoothEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const podiumVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.4, duration: 0.8 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: smoothEase },
  },
};

// ─── Premium UI Sub-components ────────────────────────────────────────────

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 shadow-2xl transition-all duration-500 hover:border-white/10 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] ${className}`}>
      {children}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────

export default function ScoreboardPage() {
  const { data, isLoading } = useLeaderboard();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const top3 = useMemo(
    () => data?.leaderboard?.slice(0, 3) ?? [],
    [data?.leaderboard],
  );

  const rest = useMemo(
    () => data?.leaderboard?.slice(3) ?? [],
    [data?.leaderboard],
  );

  const userRank = data?.userRank;

  // We ensure we have exactly 3 spots for the podium layout even if empty
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  return (
    <div className="min-h-screen relative selection:bg-accent/30 overflow-hidden">
      <GradientMesh className="opacity-40" />

      <div className="max-w-4xl mx-auto space-y-10 pb-24 lg:pb-12 px-4 md:px-8 pt-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-accent/20 to-purple-500/10 border border-accent/20 shadow-[0_0_40px_rgba(99,102,241,0.2)] mb-2">
            <Trophy className="w-10 h-10 text-accent-light" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Hall of Fame
          </h1>
          <p className="text-base text-foreground-subtle font-medium tracking-wide max-w-md mx-auto">
            Compete with your classmates, earn XP, and climb to the top of the leaderboard!
          </p>
        </motion.div>

        {/* Podium Section */}
        {!isLoading && top3.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex items-end justify-center gap-2 md:gap-6 mt-12 mb-8 h-64 md:h-72"
          >
            {/* 2nd Place */}
            {second && <PodiumCard entry={second} rank={2} height="h-[75%]" />}

            {/* 1st Place */}
            {first && <PodiumCard entry={first} rank={1} height="h-[95%]" isWinner />}

            {/* 3rd Place */}
            {third && <PodiumCard entry={third} rank={3} height="h-[60%]" />}
          </motion.div>
        )}

        {/* Loading State for Podium */}
        {isLoading && (
          <div className="flex items-end justify-center gap-4 mt-12 mb-8 h-64">
            <div className="w-28 md:w-36 h-[75%] bg-white/5 rounded-t-3xl animate-pulse" />
            <div className="w-32 md:w-40 h-[95%] bg-white/10 rounded-t-3xl animate-pulse" />
            <div className="w-28 md:w-36 h-[60%] bg-white/5 rounded-t-3xl animate-pulse" />
          </div>
        )}

        {/* Full Ranked List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: smoothEase, delay: 0.4 }}
        >
          <GlassCard className="!p-3 md:!p-6">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : rest.length === 0 && top3.length === 0 ? (
              <EmptyScoreboard />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center px-4 py-2 text-[10px] font-bold text-foreground-subtle uppercase tracking-widest">
                  <span className="w-12 text-center">Rank</span>
                  <span className="flex-1 ml-4">Student</span>
                  <span className="text-right w-24">Level</span>
                  <span className="text-right w-24 hidden md:block">Total XP</span>
                </div>

                <AnimatePresence>
                  {rest.map((entry, i) => (
                    <LeaderboardRow
                      key={entry.userId}
                      entry={entry}
                      isCurrentUser={entry.userId === userId}
                      delay={0.05 * i}
                    />
                  ))}
                </AnimatePresence>

                {/* Pinned user row if logged-in student is far down the list */}
                {userId && userRank && rest.length > 0 &&
                  !rest.find((e) => e.userId === userId) &&
                  !top3.find((e) => e.userId === userId) && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-[10px] font-bold text-accent-light uppercase tracking-widest mb-3 ml-4">Your Current Rank</p>
                      {/* Note: We need the actual entry data for the pinned row, falling back to a placeholder if not in memory */}
                      <LeaderboardRow
                        entry={{
                          userId: userId,
                          rank: userRank,
                          name: "You",
                          image: null,
                          level: 0,
                          totalXP: 0
                        }}
                        isCurrentUser
                        delay={0}
                        pinned
                      />
                    </div>
                  )}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────

function PodiumCard({
  entry,
  rank,
  height,
  isWinner = false,
}: {
  entry: LeaderboardEntry;
  rank: number;
  height: string;
  isWinner?: boolean;
}) {
  const getStyles = () => {
    if (rank === 1) return {
      bg: "from-amber-400/20 to-yellow-600/10 border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.2)]",
      text: "text-yellow-400",
      badge: "bg-yellow-400 text-yellow-950",
      icon: <Crown className="w-5 h-5 mb-1 text-yellow-400 drop-shadow-md" />
    };
    if (rank === 2) return {
      bg: "from-slate-300/20 to-slate-500/10 border-slate-300/30",
      text: "text-slate-300",
      badge: "bg-slate-300 text-slate-900",
      icon: <Medal className="w-5 h-5 mb-1 text-slate-300" />
    };
    return {
      bg: "from-orange-400/20 to-red-600/10 border-orange-400/30",
      text: "text-orange-400",
      badge: "bg-orange-400 text-orange-950",
      icon: <Medal className="w-5 h-5 mb-1 text-orange-400" />
    };
  };

  const styles = getStyles();

  return (
    <motion.div
      variants={podiumVariants}
      className={`relative flex flex-col items-center justify-start rounded-t-3xl border-t border-x bg-gradient-to-b w-28 md:w-36 ${height} ${styles.bg} pt-6 md:pt-8 px-2`}
    >
      {/* Sparkles for 1st Place */}
      {isWinner && (
        <div className="absolute -top-6 animate-pulse">
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
      )}

      {/* Rank Badge */}
      <div className={`absolute -top-4 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-xl ${styles.badge}`}>
        {rank}
      </div>

      {styles.icon}

      {/* Avatar */}
      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[1.25rem] bg-surface flex items-center justify-center text-xl md:text-2xl font-black shadow-inner border border-white/10 ${styles.text}`}>
        {entry.name?.[0]?.toUpperCase() ?? "?"}
      </div>

      <p className="text-sm md:text-base font-bold mt-3 text-center truncate w-full px-2 text-foreground">
        {entry.name?.split(" ")[0] ?? "Unknown"}
      </p>

      <p className={`font-black text-lg md:text-xl mt-1 ${styles.text}`}>
        {entry.totalXP.toLocaleString()} <span className="text-xs font-bold uppercase">XP</span>
      </p>

      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mt-1 bg-white/5 px-2 py-0.5 rounded-full">
        Lvl {entry.level}
      </p>
    </motion.div>
  );
}

function LeaderboardRow({
  entry,
  isCurrentUser,
  delay = 0,
  pinned = false,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  delay?: number;
  pinned?: boolean;
}) {
  return (
    <motion.div
      variants={rowVariants}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      className={`flex items-center p-3 md:p-4 rounded-2xl transition-all duration-300 group ${isCurrentUser
        ? "bg-accent/10 border border-accent/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] relative overflow-hidden"
        : "bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10"
        }`}
    >
      {/* Current user pulsing background effect */}
      {isCurrentUser && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 animate-[shimmer_2s_infinite]" />
      )}

      {/* Rank */}
      <div className="w-12 flex justify-center relative z-10">
        <span className={`text-base font-black ${isCurrentUser ? "text-accent-light" : "text-foreground-muted"}`}>
          #{entry.rank}
        </span>
      </div>

      {/* Avatar */}
      <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center text-sm font-bold ml-2 md:ml-4 relative z-10 shadow-inner ${isCurrentUser ? "bg-accent text-white" : "bg-white/10 text-foreground"}`}>
        {entry.name?.[0]?.toUpperCase() ?? "?"}
      </div>

      {/* Name */}
      <div className="flex-1 ml-4 relative z-10">
        <span className={`text-sm md:text-base ${isCurrentUser ? "text-white font-bold" : "text-foreground font-medium group-hover:text-white transition-colors"}`}>
          {entry.name ?? "Unknown"}
        </span>
        {isCurrentUser && (
          <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-accent-light bg-accent/20 px-2 py-0.5 rounded-md">
            You
          </span>
        )}
      </div>

      {/* Level */}
      <div className="w-24 text-right relative z-10">
        <span className="text-xs font-bold text-foreground-subtle bg-white/5 px-3 py-1 rounded-lg border border-white/5">
          Lvl {entry.level}
        </span>
      </div>

      {/* Total XP */}
      <div className="w-24 text-right hidden md:flex items-center justify-end gap-1.5 relative z-10">
        <Flame className={`w-4 h-4 ${isCurrentUser ? "text-accent-light" : "text-orange-400"}`} />
        <span className={`text-sm font-black ${isCurrentUser ? "text-accent-light" : "text-foreground"}`}>
          {entry.totalXP.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}

function EmptyScoreboard() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <Trophy className="w-8 h-8 text-foreground-subtle opacity-50" />
      </div>
      <p className="text-lg font-bold text-foreground">No rankings yet</p>
      <p className="text-sm font-medium text-foreground-subtle mt-1 max-w-sm mx-auto">
        Complete assignments to earn XP and be the first to climb the leaderboard!
      </p>
    </div>
  );
}