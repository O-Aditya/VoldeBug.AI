import { type ReactNode } from "react";
import { Navigation } from "@web/components/dashboard/navigation";
import { NotificationBell } from "@web/components/dashboard/notification-bell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex relative">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 p-4">
        <div className="px-2 py-4 mb-6">
          <a href="/dashboard/student" className="font-display text-lg font-bold tracking-tight">
            <span className="text-gradient">VOLDEBUG</span>
            <span className="text-foreground-muted text-xs ml-1.5 font-sans font-normal">
              AI PORTAL
            </span>
          </a>
        </div>

        <Navigation variant="sidebar" />
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar: notification bell + user */}
        <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-sm border-b border-white/5 h-14 flex items-center justify-end px-4 md:px-6 lg:px-8 gap-2">
          <NotificationBell />
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent-light border border-accent/20">
            V
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden h-16 bg-card border-t border-white/5 z-40">
        <Navigation variant="mobile" />
      </nav>
    </div>
  );
}