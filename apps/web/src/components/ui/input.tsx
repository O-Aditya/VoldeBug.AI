import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@web/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn("input-base", className)}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";