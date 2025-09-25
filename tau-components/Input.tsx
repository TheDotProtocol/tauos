import React from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text',
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    ...props 
  }, ref) => {
    const baseStyles = "flex w-full px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-tau-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";
    
    const variants = {
      default: "bg-tau-bg-surface border border-tau-gray-600 rounded-lg text-tau-white-primary focus:border-tau-gold-500 focus:ring-1 focus:ring-tau-gold-500",
      filled: "bg-tau-gray-800 border-0 rounded-lg text-tau-white-primary focus:ring-2 focus:ring-tau-gold-500",
      outlined: "bg-transparent border-2 border-tau-gray-600 rounded-lg text-tau-white-primary focus:border-tau-gold-500 focus:ring-1 focus:ring-tau-gold-500",
    };

    const errorStyles = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-tau-white-primary mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tau-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              baseStyles,
              variants[variant],
              errorStyles,
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tau-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-tau-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
