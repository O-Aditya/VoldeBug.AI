import { type ReactNode } from "react";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen space-y-6 flex items-center justify-center">
      <div className="w-full max-w-xl px-4 py-8">
        {children}
      </div>
    </div>
  );
}