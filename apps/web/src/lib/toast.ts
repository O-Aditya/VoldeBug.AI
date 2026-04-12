import { useEffect, useRef, useState } from "react";

// ─── Lightweight Toast System (no external deps) ───────────────────────

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  title?: string;
  duration?: number;
}

let listeners: Set<(toasts: Toast[]) => void> = new Set();
let toasts: Toast[] = [];

function notify(toast: Omit<Toast, "id">) {
  const id = crypto.randomUUID();
  const newToasts = [...toasts, { ...toast, id }];
  toasts = newToasts;
  listeners.forEach((fn) => fn(newToasts));

  const duration = toast.duration ?? 4000;
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((fn) => fn([...toasts]));
  }, duration);
}

export function toastSuccess(message: string, title?: string) {
  notify({ message, type: "success", title });
}

export function toastInfo(message: string, title?: string) {
  notify({ message, type: "info", title });
}

export function toastWarning(message: string, title?: string) {
  notify({ message, type: "warning", title });
}

export function toastError(message: string, title?: string) {
  notify({ message, type: "error", title });
}

export function useToast() {
  const [current, set] = useState<Toast[]>([]);
  useEffect(() => {
    listeners.add(set);
    set([...toasts]);
    return () => { listeners.delete(set); };
  }, []);
  return current;
}
