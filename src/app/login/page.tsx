"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import AuthPageShell from "@/components/marketing/AuthPageShell";
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    router.push("/taumail/dashboard");
  };

  return (
    <AuthPageShell
      title={isLogin ? "Welcome back" : "Create your account"}
      subtitle={
        isLogin
          ? "Sign in to Tau Mail — private email from Tau Core Inc."
          : "Join Tau Mail with end-to-end encryption and zero tracking."
      }
      backHref="/taumail"
      backLabel="← Back to Tau Mail"
    >
      <Card variant="glass" className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              icon={<Lock className="w-4 h-4" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {!isLogin ? (
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              icon={<Lock className="w-4 h-4" />}
              required
            />
          ) : null}

          <Button type="submit" className="w-full" loading={loading} icon={<ArrowRight className="w-4 h-4" />}>
            {isLogin ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/80 font-medium"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary" />
            End-to-end encryption
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            Zero tracking
          </span>
        </div>
      </Card>

      <p className="text-center mt-6 text-xs text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link href="/legal/terms" className="text-primary hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthPageShell>
  );
}
