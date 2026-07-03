'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthPageShell from '@/components/marketing/AuthPageShell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TauIDLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/tauid/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        if (data.token) localStorage.setItem('tauos_token', data.token);
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/tauid/dashboard';
        }, 1000);
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Sign in to Tau ID"
      subtitle="Access your sovereign identity on the TAU CORE ecosystem."
      backHref="/tauid"
      backLabel="← Back to Tau ID"
    >
      <Card variant="glass" className="p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              icon={<Lock className="w-4 h-4" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {message ? (
            <div
              className={`p-4 rounded-lg text-sm border ${
                message.includes('successful')
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-destructive/10 text-destructive border-destructive/30'
              }`}
            >
              {message}
            </div>
          ) : null}

          <Button type="submit" className="w-full" loading={isLoading}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an identity?{' '}
          <Link href="/tauid/register" className="text-primary hover:text-primary/80">
            Create one
          </Link>
        </p>
      </Card>
    </AuthPageShell>
  );
}
