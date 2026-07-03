import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated";
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-card border border-border rounded-xl",
      glass: "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl",
      elevated: "bg-card border border-border rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary/5",
    };

    return (
      <div ref={ref} className={cn("p-6 transition-all duration-200", variants[variant], className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
