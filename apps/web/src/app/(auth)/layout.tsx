import { type ReactNode } from "react";
import { GradientMesh } from "@web/components/ui/background";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <GradientMesh />

      {/* Extra atmospheric orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-accent/6 blur-[140px]" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[120px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Top nav bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-md shadow-accent/30">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight">
            <span className="text-gradient">VOLDEBUG</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 text-sm text-foreground-subtle">
          <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
          <Link
            href="/register"
            className="px-3.5 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent-light hover:bg-accent/15 transition-colors text-xs font-medium"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-3xl px-4 py-10">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-6 text-xs text-foreground-subtle">
        © 2025 Voldebug AI Education Portal · Secure & private
      </div>
    </div>
  );
}