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
    const baseClasses = "w-full px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      default: "bg-tau-dark-700 border border-tau-dark-600 text-white placeholder-gray-400 focus:border-tau-primary focus:ring-tau-primary/50 rounded-lg",
      glass: "bg-tau-glass-light backdrop-blur-md border border-tau-glass-medium text-white placeholder-gray-300 focus:border-tau-primary focus:ring-tau-primary/50 rounded-glass",
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              baseClasses,
              variants[variant],
              icon && "pl-10",
              error && "border-error focus:border-error focus:ring-error/50",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input }; 