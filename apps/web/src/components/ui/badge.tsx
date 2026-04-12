import type { HTMLAttributes } from "react";
import { cn } from "@web/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "silver" | "bronze" | "new" | "default";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  gold: "xp-badge-gold",
  silver: "xp-badge-silver",
  bronze: "xp-badge-bronze",
  new: "xp-badge-new",
  default: "tag",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn("xp-badge", variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
}