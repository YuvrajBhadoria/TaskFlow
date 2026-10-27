"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onSuccess: () => void;
  onBackToHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onSuccess,
  onBackToHome,
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const backgroundImageUrl =
    "https://cdn.21st.dev/assets/mirror/a8/a8cf38f65f7315f95eba8c803c4a80a9d78cb2ea36fbfee49828396e4a0b9737.jpg";

  const handleFillDemo = () => {
    setEmail('demo@taskflow.dev');
    setPassword('demo1234');
    if (mode === 'register') {
      setName('Alex Morgan');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden isolate">
      {/* Background Image */}
      <img
        src={backgroundImageUrl}
        alt=""
        className="w-full h-full object-cover absolute inset-0 z-0 opacity-40 scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />

      {/* Top Bar Back Link */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          className="gap-2 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur rounded-full px-4"
          onClick={onBackToHome}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-slide-in-2">
        <Card className="border-white/15 bg-black/60 backdrop-blur-xl shadow-2xl text-white">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto size-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white mb-3 shadow-lg shadow-indigo-500/30">
              <Sparkles className="size-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              {mode === 'login' ? 'Welcome Back to TaskFlow' : 'Create TaskFlow Account'}
            </CardTitle>
            <CardDescription className="text-white/60 text-sm">
              {mode === 'login'
                ? 'Sign in to access your private MongoDB task stream'
                : 'Start organizing your projects with state-of-the-art tools'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-white/10 rounded-xl mb-6 ring-1 ring-white/10">
              <button
                type="button"
                className={`py-2 text-sm font-medium rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`py-2 text-sm font-medium rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/20 border border-destructive/40 text-rose-200 text-sm flex items-center gap-2">
                <span className="shrink-0">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <Label htmlFor="auth-name" className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                    Full Name
                  </Label>
                  <Input
                    id="auth-name"
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-indigo-400 h-11"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="auth-email" className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                  Email Address
                </Label>
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-indigo-400 h-11"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-password" className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                    Password
                  </Label>
                  <span className="text-[11px] text-white/50">Min 6 characters</span>
                </div>
                <Input
                  id="auth-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-indigo-400 h-11"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  ⚡ Auto-fill Demo Account
                </button>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  bcrypt + JWT
                </span>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-white text-neutral-900 hover:bg-white/90 font-semibold rounded-xl text-sm transition-transform active:scale-[0.98] mt-2 cursor-pointer"
              >
                {submitting
                  ? 'Authenticating...'
                  : mode === 'login'
                  ? 'Sign In to Workspace'
                  : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
