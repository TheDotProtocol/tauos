import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: "default" | "glass";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, variant = "default", ...props }, ref) => {
    const baseClasses =
      "w-full px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      default:
        "bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-md",
      glass:
        "bg-white/5 backdrop-blur-md border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary rounded-md",
    };

    return (
      <div className="space-y-2">
        {label ? (
          <label className="block text-sm font-medium text-muted-foreground">{label}</label>
        ) : null}
        <div className="relative">
          {icon ? (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>
          ) : null}
          <input
            ref={ref}
            className={cn(
              baseClasses,
              variants[variant],
              icon && "pl-10",
              error && "border-destructive focus:border-destructive focus:ring-destructive/50",
              className
            )}
            {...props}
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
