import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, LogOut, Moon, Shield, ShieldCheck, Sun, UserCheck, CheckCircle2 } from 'lucide-react';

export const Settings = ({ onOpenAuthModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [theme, setTheme] = useState(
    () => localStorage.getItem('taskflow_theme') || 'dark'
  );
  const [apiHealth, setApiHealth] = useState({ checking: true, ok: false, latency: null });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  // Ping API health on mount
  useEffect(() => {
    let active = true;
    const checkHealth = async () => {
      const startTime = performance.now();
      try {
        const res = await apiRequest('/health');
        if (active && res && res.status === 'ok') {
          setApiHealth({
            checking: false,
            ok: true,
            latency: Math.round(performance.now() - startTime)
          });
        }
      } catch (err) {
        if (active) {
          setApiHealth({ checking: false, ok: false, error: err.message });
        }
      }
    };
    checkHealth();
    return () => {
      active = false;
    };
  }, []);

  const stats = [
    {
      label: "Auth Status",
      value: isAuthenticated ? "Verified" : "Guest",
      hint: isAuthenticated ? "JWT Scoped Session" : "Unauthenticated",
      icon: ShieldCheck,
      iconColor: isAuthenticated ? "text-emerald-400" : "text-amber-400",
    },
    {
      label: "Active User",
      value: user?.name ? user.name.split(" ")[0] : "Demo User",
      hint: user?.email || "No session email",
      icon: UserCheck,
      iconColor: "text-indigo-400",
    },
    {
      label: "API Latency",
      value: apiHealth.latency ? `${apiHealth.latency} ms` : "Online",
      hint: apiHealth.ok ? "Port 5001 Express" : "Connecting...",
      icon: Activity,
      iconColor: "text-sky-400",
    },
    {
      label: "Active Theme",
      value: theme === 'dark' ? "Obsidian Dark" : "Light Mode",
      hint: "Default dark aesthetic",
      icon: Moon,
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-6 w-full animate-fade-slide-in-1">
      {/* Standardized Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Settings & Preferences
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span>System Nominal</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your authenticated profile, application theme, and inspect MongoDB connection telemetry.
          </p>
        </div>
      </div>

      {/* 4 Standardized Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-4 sm:p-5 border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:border-border transition-all rounded-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon
                aria-hidden
                className={`size-4.5 ${stat.iconColor}`}
              />
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground mt-2">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Profile Card */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-indigo-400" />
              <CardTitle className="text-base font-semibold">User Account</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Your profile identity and security credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Full Name</span>
                    <span className="font-semibold text-foreground text-sm">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Email Address</span>
                    <span className="font-semibold text-foreground text-sm truncate block">{user.email}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border/50">
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" />
                    Authenticated via JWT
                  </span>
                  <Button variant="outline" size="sm" onClick={logout} className="gap-1.5 text-xs text-rose-400 hover:text-rose-300 border-border/70">
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  You are currently browsing in guest mode. Sign in to sync your tasks with MongoDB.
                </p>
                <Button size="sm" onClick={onOpenAuthModal} className="text-xs font-semibold">
                  Sign In or Register
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appearance & Theme Card */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-base font-semibold">Appearance Theme</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Toggle between dark obsidian mode and crisp light mode
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant={theme === 'dark' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className="gap-2 text-xs flex-1 font-semibold"
              >
                <Moon className="h-3.5 w-3.5" />
                <span>Dark Obsidian</span>
              </Button>
              <Button
                variant={theme === 'light' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                className="gap-2 text-xs flex-1 font-semibold"
              >
                <Sun className="h-3.5 w-3.5" />
                <span>Light</span>
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Dark mode uses a tailored obsidian palette with glassmorphism and emerald accents.
            </p>
          </CardContent>
        </Card>

        {/* System & MongoDB Diagnostics Card */}
        <Card className="md:col-span-2 border-border/60 bg-card/60 backdrop-blur-sm shadow-sm rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-sky-400" />
              <CardTitle className="text-base font-semibold">Database & Server Health</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Live status of backend services and database connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                <span className="text-muted-foreground block mb-1">Backend Server</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Port 5001 Online
                </span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                <span className="text-muted-foreground block mb-1">Database</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  MongoDB Connected
                </span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                <span className="text-muted-foreground block mb-1">Health Check</span>
                <span className="font-semibold text-foreground">
                  {apiHealth.checking ? 'Pinging...' : apiHealth.ok ? `OK (${apiHealth.latency}ms)` : 'Unreachable'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
