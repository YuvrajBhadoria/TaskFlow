"use client";

import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  BarChart3,
  ClipboardList,
  FileText,
  Plus,
  Users,
  ArrowRight,
  AlertCircle
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import {
  app1Activity,
  app1Chart,
  app1ChartConfig,
  app1Projects,
} from "@/components/ui/app-1-utils/app-1-data";
import { useAuth } from "@/context/AuthContext";
import { TaskItem } from "@/components/TaskItem";

interface TaskFlowDashboardProps {
  tasks: any[];
  loading: boolean;
  error: string | null;
  onOpenCreate: () => void;
  onToggleStatus: (task: any) => void;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
  onNavigatePage: (page: string) => void;
}

const STATUS_VARIANT = {
  "In progress": "default",
  "In review": "secondary",
  Planning: "outline",
} as const;

export function TaskFlowDashboard({
  tasks,
  loading,
  error,
  onOpenCreate,
  onToggleStatus,
  onEdit,
  onDelete,
  onNavigatePage,
}: TaskFlowDashboardProps) {
  const { isAuthenticated } = useAuth();
  const [taskViewFilter, setTaskViewFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate live stats from MongoDB tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks.toString(),
      hint: `${pendingTasks} pending in workspace`,
      icon: FileText,
      iconColor: "text-indigo-400",
    },
    {
      label: "Active Tasks",
      value: pendingTasks.toString(),
      hint: `${completedTasks} marked finished`,
      icon: ClipboardList,
      iconColor: "text-sky-400",
    },
    {
      label: "Team Members",
      value: "4 Active",
      hint: isAuthenticated ? "MongoDB Connected" : "Guest Mode",
      icon: Users,
      iconColor: "text-purple-400",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      hint: `${completedTasks} of ${totalTasks} accomplished`,
      icon: BarChart3,
      iconColor: "text-emerald-400",
    },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (taskViewFilter === 'pending' && t.status !== 'pending') return false;
    if (taskViewFilter === 'completed' && t.status !== 'completed') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 w-full animate-fade-slide-in-1">
      {/* Standardized Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Dashboard Overview
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              MongoDB Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Live task throughput, team metrics, MongoDB sync status, and active project streams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigatePage("tasks")}
            className="gap-1.5 text-xs font-medium border-border/70 shadow-sm"
          >
            <ClipboardList className="h-3.5 w-3.5" />
            <span>Manage Tasks</span>
          </Button>

          <Button
            size="sm"
            onClick={onOpenCreate}
            className="gap-1.5 text-xs font-semibold bg-primary text-primary-foreground shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </Button>
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

      {/* Task Throughput Area Chart Card */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold">Task Throughput</CardTitle>
            <CardDescription className="text-xs">
              Tasks opened against tasks completed over the last eight weeks
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-medium border-border/80">
            Live Analytics
          </Badge>
        </CardHeader>
        <CardContent>
          <ChartContainer config={app1ChartConfig} className="h-64 w-full">
            <AreaChart
              data={app1Chart}
              margin={{ left: 4, right: 4, top: 8 }}
              accessibilityLayer
            >
              <defs>
                <linearGradient
                  id="app1Completed"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-completed)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-completed)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.25} />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs text-muted-foreground"
              />
              <YAxis tickLine={false} axisLine={false} width={32} className="text-xs text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="opened"
                type="monotone"
                stroke="var(--color-opened)"
                strokeDasharray="4 4"
                fill="none"
                strokeWidth={2}
              />
              <Area
                dataKey="completed"
                type="monotone"
                stroke="var(--color-completed)"
                fill="url(#app1Completed)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Live MongoDB Task Stream Section */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">Live Task Stream</CardTitle>
              <CardDescription className="text-xs">
                Organize, track, and complete your tasks with real-time MongoDB synchronization
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex p-0.5 bg-muted/60 rounded-lg ring-1 ring-border/50">
                <button
                  type="button"
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${taskViewFilter === 'all'
                    ? 'bg-background text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                  onClick={() => setTaskViewFilter('all')}
                >
                  All ({totalTasks})
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${taskViewFilter === 'pending'
                    ? 'bg-background text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                  onClick={() => setTaskViewFilter('pending')}
                >
                  Pending ({pendingTasks})
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${taskViewFilter === 'completed'
                    ? 'bg-background text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                  onClick={() => setTaskViewFilter('completed')}
                >
                  Done ({completedTasks})
                </button>
              </div>
              <Button size="sm" onClick={onOpenCreate} className="gap-1 font-semibold text-xs h-8">
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3.5 rounded-xl border border-destructive/40 bg-destructive/10 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              <div className="h-16 rounded-xl bg-muted/40 animate-pulse" />
              <div className="h-16 rounded-xl bg-muted/40 animate-pulse" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-xl border-border/70 p-6">
              <p className="text-sm font-medium text-foreground">No tasks in this view</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Add" to create a task, or view all tasks on the Task Manager page.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredTasks.slice(0, 5).map((task) => (
                <TaskItem
                  key={task._id || task.id}
                  task={task}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}

              {filteredTasks.length > 5 && (
                <div className="pt-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigatePage("tasks")}
                    className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <span>View remaining {filteredTasks.length - 5} tasks on My Tasks</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Projects & Team Activity Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Active Projects</CardTitle>
              <CardDescription className="text-xs">Your current project progress</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigatePage("projects")}
              className="text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {app1Projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-medium">
                    {project.name}
                  </h3>
                  <Badge variant={STATUS_VARIANT[project.status]}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex items-center gap-3">
                  <Progress
                    value={project.progress}
                    aria-label={`${project.name} progress`}
                  />
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {project.progress}%
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1">
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
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Due {project.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <CardDescription className="text-xs">Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-4">
              {app1Activity.map((entry) => (
                <li key={entry.id} className="flex items-start gap-3">
                  <Avatar className="size-8 ring-1 ring-border shrink-0">
                    <AvatarImage
                      src={entry.person.avatar}
                      alt={entry.person.name}
                      className="object-[50%_15%]"
                    />
                    <AvatarFallback className="text-xs">
                      {entry.person.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      <span className="font-medium text-foreground">
                        {entry.person.name}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {entry.action}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry.time}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TaskFlowDashboard;
