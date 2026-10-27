"use client";

import React from 'react';
import ResponsiveHeroBanner from '@/components/ui/responsive-hero-banner';
import { useAuth } from '@/context/AuthContext';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  onNavigateToTasks: () => void;
  onNavigateToAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToDashboard,
  onNavigateToTasks,
  onNavigateToAuth,
}) => {
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = isAuthenticated
    ? [
        { label: "Home", href: "#", isActive: true },
        { label: "Dashboard", href: "#", onClick: onNavigateToDashboard },
        { label: "My Tasks", href: "#", onClick: onNavigateToTasks },
        {
          label: `Sign Out (${user?.name?.split(" ")[0] || "User"})`,
          href: "#",
          onClick: logout
        }
      ]
    : [
        { label: "Home", href: "#", isActive: true },
        { label: "Dashboard", href: "#", onClick: onNavigateToDashboard },
        { label: "My Tasks", href: "#", onClick: onNavigateToTasks },
        { label: "Sign In", href: "#", onClick: onNavigateToAuth }
      ];

  return (
    <div className="w-full min-h-screen bg-background">
      <ResponsiveHeroBanner
        badgeLabel="New"
        badgeText="TaskFlow 2.0 Full-Stack MERN Platform"
        title="Master Your Workflows"
        titleLine2="Into Peak Velocity"
        description="Experience modern task management like never before. With real-time analytics, user-scoped privacy, intelligent prioritization, and direct MongoDB persistence, stay in the flow and ship faster."
        primaryButtonText={isAuthenticated ? "Open Workspace" : "Open Dashboard"}
        onPrimaryClick={onNavigateToDashboard}
        secondaryButtonText={isAuthenticated ? "View Tasks" : "Sign In / Register"}
        onSecondaryClick={isAuthenticated ? onNavigateToTasks : onNavigateToAuth}
        ctaButtonText={isAuthenticated ? "Dashboard" : "Launch App"}
        onCtaClick={onNavigateToDashboard}
        navLinks={navLinks}
        partnersTitle="Trusted by modern engineers and high-velocity teams worldwide"
      />
    </div>
  );
};

export default LandingPage;
