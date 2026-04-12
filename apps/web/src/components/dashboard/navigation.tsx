"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home, Zap, GraduationCap, Trophy, UserCircle,
  History, Shield, BookOpen, BarChart3
} from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@web/lib/utils";

// ─── Nav item definitions ─────────────────────────────────────────────────

const STUDENT_NAV = [
  { label: "Home", href: "/dashboard/student", icon: Home },
  { label: "Tools", href: "/dashboard/tools", icon: Zap },
  { label: "Classroom", href: "/dashboard/classroom", icon: GraduationCap },
  { label: "Scores", href: "/dashboard/scoreboard", icon: Trophy },
  { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
];

const TEACHER_NAV = [
  { label: "Dashboard", href: "/dashboard/teacher", icon: Home },
  { label: "Assignments", href: "/dashboard/teacher/grading", icon: BookOpen },
  { label: "Analytics", href: "/dashboard/teacher/analytics", icon: BarChart3 },
  { label: "Scores", href: "/dashboard/scoreboard", icon: Trophy },
  { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
];

const SIDEBAR_EXTRA_STUDENT = [
  { label: "History", href: "/dashboard/submissions", icon: History },
];

// ─── Component ────────────────────────────────────────────────────────────

export function Navigation({ variant }: { variant: "sidebar" | "mobile" }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isTeacher = session?.user?.role === "TEACHER";
  const navItems = isTeacher ? TEACHER_NAV : STUDENT_NAV;

  function isActive(href: string) {
    if (href === "/dashboard/student" || href === "/dashboard/teacher") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  if (variant === "sidebar") {
    return (
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive(item.href)
                ? "bg-accent-surface text-accent-light border border-accent/15 shadow-sm"
                : "text-foreground-muted hover:bg-surface/60 hover:text-foreground"
            )}
          >
            <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Student-only extras in sidebar */}
        {!isTeacher && (
          <>
            <div className="mt-2 mb-1 px-3">
              <p className="text-[10px] font-semibold text-foreground-subtle uppercase tracking-widest">More</p>
            </div>
            {SIDEBAR_EXTRA_STUDENT.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive(item.href)
                    ? "bg-accent-surface text-accent-light border border-accent/15"
                    : "text-foreground-muted hover:bg-surface/60 hover:text-foreground"
                )}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>
    );
  }

  // Mobile bottom tab bar — show 5 items max
  const mobileItems = navItems.slice(0, 5);

  return (
    <nav className="flex items-center justify-around w-full h-full px-2">
      {mobileItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-0 flex-1",
              active ? "text-accent-light" : "text-foreground-muted hover:text-foreground"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
              active ? "bg-accent-surface" : "transparent"
            )}>
              <item.icon className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] font-medium truncate max-w-full">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
