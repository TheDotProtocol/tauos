import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated";
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-tau-dark-700 border border-tau-dark-600 rounded-xl",
      glass: "bg-tau-glass-light backdrop-blur-md border border-tau-glass-medium rounded-glass shadow-glass",
      elevated: "bg-tau-dark-700 border border-tau-dark-600 rounded-xl shadow-lg hover:shadow-xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "p-6 transition-all duration-200",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card }; 