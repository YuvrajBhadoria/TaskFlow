"use client";

import React from "react";
import {
  BarChart3,
  CheckCircle2,
  FolderKanban,
  Home,
  ListTodo,
  LogOut,
  Settings,
  Sparkles,
  Users
} from "lucide-react";
import { useSidebar } from "./sidebar";
import { app1User } from "./app-1-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function App1Sidebar({
  activeNav = "dashboard",
  onNavSelect
}: {
  activeNav?: string;
  onNavSelect?: (id: string) => void;
}) {
  const { open, isMobile, toggleSidebar } = useSidebar();
  const { user, isAuthenticated, logout } = useAuth();

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "tasks", label: "My Tasks", icon: ListTodo },
    { id: "completed", label: "Completed", icon: CheckCircle2 },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const displayName = user?.name || app1User.name;
  const displayEmail = user?.email || app1User.email;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!open && !isMobile) {
    return (
      <aside className="sticky top-0 h-screen w-16 border-r bg-card flex flex-col items-center py-4 gap-4 transition-all">
        <button
          onClick={() => onNavSelect?.("landing")}
          className="size-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
          title="Return to Landing Page"
        >
          TF
        </button>
        <div className="flex-1 flex flex-col gap-2 mt-4">
          {navigation.map((item) => (
            <Button
              key={item.id}
              variant={activeNav === item.id ? "secondary" : "ghost"}
              size="icon"
              className="size-10"
              onClick={() => onNavSelect?.(item.id)}
              title={item.label}
            >
              <item.icon className="size-5" />
            </Button>
          ))}
        </div>
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            className="size-10 text-muted-foreground hover:text-rose-400"
            onClick={logout}
            title="Sign Out"
          >
            <LogOut className="size-5" />
          </Button>
        )}
      </aside>
    );
  }

  return (
    <>
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={cn(
          "h-screen border-r bg-card flex flex-col z-50 transition-all duration-300",
          isMobile
            ? open
              ? "fixed left-0 top-0 w-64 shadow-2xl"
              : "fixed -left-64 top-0 w-64"
            : "sticky top-0 w-64"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <button
            onClick={() => onNavSelect?.("landing")}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="size-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white flex items-center justify-center font-extrabold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="size-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-foreground text-base block">TaskFlow</span>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Pro Workspace</span>
            </div>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10 px-3 text-sm font-medium",
                  isActive
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => {
                  onNavSelect?.(item.id);
                  if (isMobile) toggleSidebar();
                }}
              >
                <item.icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "")} />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t mt-auto flex items-center justify-between gap-3 bg-muted/20">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-9 ring-1 ring-border shrink-0">
              <AvatarImage src={app1User.avatar} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{displayEmail}</p>
            </div>
          </div>

          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-rose-400 shrink-0"
              onClick={logout}
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}

export default App1Sidebar;
