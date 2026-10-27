"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  CheckCircle2,
  FolderKanban,
  Layers,
  Plus,
  TrendingUp,
  Users
} from 'lucide-react';
import { app1Projects } from '@/components/ui/app-1-utils/app-1-data';

const STATUS_VARIANT = {
  "In progress": "default",
  "In review": "secondary",
  Planning: "outline",
} as const;

export const ProjectsPage = ({ onNavigateToTasks }: { onNavigateToTasks: () => void }) => {
  const [projects, setProjects] = useState(app1Projects);

  const totalProjects = projects.length;
  const inProgress = projects.filter((p) => p.status === 'In progress').length;
  const avgCompletion = Math.round(
    projects.reduce((acc, p) => acc + p.progress, 0) / (totalProjects || 1)
  );

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects.toString(),
      hint: `${inProgress} currently active`,
      icon: FolderKanban,
      iconColor: "text-indigo-400",
    },
    {
      label: "In Progress",
      value: inProgress.toString(),
      hint: "Active sprint cycle",
      icon: Layers,
      iconColor: "text-sky-400",
    },
    {
      label: "Team Contributors",
      value: "4 Core",
      hint: "Engineering & Design",
      icon: Users,
      iconColor: "text-purple-400",
    },
    {
      label: "Avg Completion",
      value: `${avgCompletion}%`,
      hint: "Across all sprints",
      icon: TrendingUp,
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-6 w-full animate-fade-slide-in-1">
      {/* Standardized Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Projects & Sprints
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <FolderKanban className="h-3.5 w-3.5" />
              <span>{totalProjects} Active Streams</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Monitor multi-stage project milestones, deliverables, and team assignments across development sprints.
          </p>
        </div>

        <Button
          size="sm"
          className="gap-1.5 text-xs font-semibold bg-primary text-primary-foreground shadow-sm self-start sm:self-auto"
          onClick={onNavigateToTasks}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Project</span>
        </Button>
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

      {/* Projects Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="flex flex-col border-border/60 bg-card/60 backdrop-blur-sm hover:border-border transition-all shadow-sm rounded-xl"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold leading-tight text-foreground">
                  {project.name}
                </CardTitle>
                <Badge variant={STATUS_VARIANT[project.status]} className="shrink-0 text-[11px]">
                  {project.status}
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {project.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-auto space-y-4 pt-0">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Sprint Velocity</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {project.progress}%
                  </span>
                </div>
                <Progress value={project.progress} aria-label={`${project.name} progress`} />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                <div className="flex items-center gap-1">
                  {project.team.map((member) => (
                    <Avatar key={member.name} className="size-6 ring-1 ring-border">
                      <AvatarImage
                        src={member.avatar}
                        alt={member.name}
                        className="object-[50%_15%]"
                      />
                      <AvatarFallback className="text-[10px]">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Due {project.dueDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
