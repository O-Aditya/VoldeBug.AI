import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@web/lib/utils";

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  glowOnNearComplete?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value, max = 100, size = "md", glowOnNearComplete = false, ...props },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const nearLevelUp = glowOnNearComplete && percentage >= 80;

    const sizeClasses: Record<NonNullable<ProgressProps["size"]>, string> = {
      sm: "h-[6px]",
      md: "h-[8px]",
      lg: "h-[12px]",
    };

    return (
      <div
        ref={ref}
        className={cn("xp-bar-track", sizeClasses[size], className)}
        {...props}
      >
        <div
          className={cn(
            "xp-bar-fill",
            nearLevelUp && "near-levelup",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  },
);

Progress.displayName = "Progress";