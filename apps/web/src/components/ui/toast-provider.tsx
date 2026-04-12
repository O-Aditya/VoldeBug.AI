"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Award, TrendingUp, X, Star } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────

type ToastType = "xp" | "badge" | "level_up" | "error" | "success";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  xp?: number;
}

interface ToastContextValue {
  showXP: (xp: number, source?: string) => void;
  showBadge: (name: string) => void;
  showLevelUp: (level: number) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ─── Icons & Styles per type ─────────────────────────────────────────────

function toastConfig(type: ToastType) {
  switch (type) {
    case "xp":
      return { icon: Zap, bg: "bg-accent-surface border-accent/20", text: "text-accent-light" };
    case "badge":
      return { icon: Award, bg: "bg-warning/10 border-warning/20", text: "text-yellow-400" };
    case "level_up":
      return { icon: Star, bg: "bg-success/10 border-success/20", text: "text-success" };
    case "error":
      return { icon: X, bg: "bg-error/10 border-error/20", text: "text-error" };
    case "success":
      return { icon: TrendingUp, bg: "bg-success/10 border-success/20", text: "text-success" };
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3500);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const ctx: ToastContextValue = {
    showXP: (xp, source) =>
      add({ type: "xp", title: `+${xp} XP Earned!`, message: source ?? "Keep it up!" }),
    showBadge: (name) =>
      add({ type: "badge", title: "Badge Unlocked!", message: name }),
    showLevelUp: (level) =>
      add({ type: "level_up", title: `Level Up! You're Level ${level}`, message: "Amazing progress!" }),
    showSuccess: (title, message) => add({ type: "success", title, message }),
    showError: (title) => add({ type: "error", title }),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* Toast stack */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const { icon: Icon, bg, text } = toastConfig(toast.type);
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.88 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.88 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl border backdrop-blur-md shadow-xl ${bg} min-w-[220px] max-w-xs`}
              >
                <div className={`flex-shrink-0 ${text}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${text}`}>{toast.title}</p>
                  {toast.message && (
                    <p className="text-xs text-foreground-subtle truncate">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => remove(toast.id)}
                  className="flex-shrink-0 text-foreground-subtle hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
