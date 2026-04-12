"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { api } from "@web/lib/api";
import { useSocket } from "@web/hooks/use-socket";
import { useToast } from "@web/components/ui/toast-provider";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      api.get<{ notifications: Notification[]; total: number }>(
        "/v1/notifications?limit=10",
      ),
    staleTime: 15_000,
  });
}

function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications-unread"],
    queryFn: () =>
      api.get<{ count: number }>("/v1/notifications/unread-count"),
    staleTime: 15_000,
  });
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data, refetch } = useNotifications();
  const { data: unread } = useUnreadCount();
  const unreadCount = unread?.count ?? 0;
  
  const { socket, connected } = useSocket();
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (!socket || !connected) return;

    const onNotification = (payload: any) => {
      // 1. Toast Notification natively
      if (payload.type === "GRADE_RECEIVED") toast.showSuccess(payload.title, payload.body);
      else if (payload.type !== "XP_AWARDED") toast.showSuccess(payload.title, payload.body);

      // 2. Safely push the notification down the TanStack Query pipeline
      queryClient.setQueryData(["notifications"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notifications: [payload, ...old.notifications].slice(0, 10),
          total: old.total + 1
        };
      });

      // 3. Increment unread count globally
      queryClient.setQueryData(["notifications-unread"], (old: any) => {
        return { count: (old?.count || 0) + 1 };
      });
    };

    socket.on("notification", onNotification);
    return () => {
      socket.off("notification", onNotification);
    };
  }, [socket, connected, queryClient, toast]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const typeIcons: Record<string, string> = {
    GRADE_RECEIVED: "✓",
    BADGE_EARNED: "🏅",
    ASSIGNMENT_CREATED: "📋",
    LEVEL_UP: "⬆",
    TEACHER_MESSAGE: "💬",
    DEADLINE_REMINDER: "⏰",
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); refetch(); }}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface/60 transition-colors"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-error text-[10px] font-bold flex items-center justify-center text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-card border border-card-border shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-card-border">
              <h3 className="text-sm font-semibold">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {!data?.notifications || data.notifications.length === 0 ? (
                <p className="text-xs text-center py-8 text-foreground-subtle">
                  No notifications
                </p>
              ) : (
                data.notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b border-card-border last:border-b-0 transition-colors ${
                      !n.read ? "bg-accent-surface/50" : ""
                    } hover:bg-surface/40`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm mt-0.5">
                        {typeIcons[n.type] ?? "·"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-foreground-subtle line-clamp-2">
                          {n.body}
                        </p>
                        <p className="text-xs text-foreground-subtle mt-1">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function timeAgo(d: string) {
  const diffMs = Date.now() - new Date(d).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}
