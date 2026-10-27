import React from 'react';
import { TaskItem } from '../components/TaskItem';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Percent, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const CompletedTasks = ({
  tasks,
  loading,
  error,
  onRetry,
  onToggleStatus,
  onEdit,
  onDelete,
  onNavigateToTasks
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const stats = [
    {
      label: "Accomplished",
      value: completedTasks.length.toString(),
      hint: `${completedTasks.length} tasks resolved`,
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      hint: `${completedTasks.length} of ${totalTasks} done`,
      icon: Percent,
      iconColor: "text-indigo-400",
    },
    {
      label: "Pending Remaining",
      value: pendingTasks.toString(),
      hint: "Tasks still in flight",
      icon: Clock,
      iconColor: "text-sky-400",
    },
    {
      label: "Workflow Milestone",
      value: completedTasks.length > 0 ? "On Track" : "Starting",
      hint: "Production velocity",
      icon: Trophy,
      iconColor: "text-amber-400",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4 w-full">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Card className="p-4 border-destructive/40 bg-destructive/10 text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="h-8 text-xs border-destructive/50">
              Retry
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-fade-slide-in-1">
      {/* Standardized Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Completed Tasks</h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{completedTasks.length} Accomplished</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Review the milestones you've completed. You can reopen any task at any time with a single click.
          </p>
        </div>

        {onNavigateToTasks && (
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToTasks}
            className="gap-1.5 text-xs font-medium border-border/70 self-start sm:self-auto"
          >
            <span>Active Tasks</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
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

      {completedTasks.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed rounded-2xl border-border/70 bg-card/40 flex flex-col items-center justify-center">
          <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 shadow-inner">
            <Trophy className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No completed tasks yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4 leading-relaxed">
            As you finish tasks from your workspace, check them off to archive them here and track your productivity.
          </p>
          {onNavigateToTasks && (
            <Button size="sm" onClick={onNavigateToTasks} className="gap-1.5 font-semibold text-xs">
              <span>Go to Active Tasks</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3" role="list">
          {completedTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
