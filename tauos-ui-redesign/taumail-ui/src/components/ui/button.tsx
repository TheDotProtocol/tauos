import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "glass" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, icon, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-tau-primary text-tau-dark-900 hover:bg-tau-primary/90 focus:ring-tau-primary/50 shadow-lg hover:shadow-xl transform hover:scale-105",
      secondary: "bg-tau-secondary text-white hover:bg-tau-secondary/90 focus:ring-tau-secondary/50 shadow-lg hover:shadow-xl transform hover:scale-105",
      ghost: "bg-transparent text-tau-primary hover:bg-tau-primary/10 focus:ring-tau-primary/50",
      glass: "bg-tau-glass-light backdrop-blur-md border border-tau-glass-medium text-white hover:bg-tau-glass-medium focus:ring-tau-primary/50 shadow-glass hover:shadow-glass-light",
      danger: "bg-error text-white hover:bg-error/90 focus:ring-error/50 shadow-lg hover:shadow-xl transform hover:scale-105",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-lg",
      md: "px-4 py-2 text-sm rounded-lg",
      lg: "px-6 py-3 text-base rounded-xl",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        ) : icon ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
