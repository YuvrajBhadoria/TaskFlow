import React from 'react';
import { TaskFilters } from '../components/TaskFilters';
import { TaskList } from '../components/TaskList';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, FileText, ListTodo, Percent, Plus } from 'lucide-react';

export const MyTasks = ({
  tasks,
  loading,
  error,
  onRetry,
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  sortBy,
  setSortBy,
  order,
  setOrder,
  onOpenCreate,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: "All Tasks",
      value: total.toString(),
      hint: `${pending} pending, ${completed} done`,
      icon: FileText,
      iconColor: "text-indigo-400",
    },
    {
      label: "Pending",
      value: pending.toString(),
      hint: "Requires attention",
      icon: Clock,
      iconColor: "text-sky-400",
    },
    {
      label: "Completed",
      value: completed.toString(),
      hint: "Archived & verified",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
    },
    {
      label: "Progress Rate",
      value: `${rate}%`,
      hint: "Completion velocity",
      icon: Percent,
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
              Task Manager
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <ListTodo className="h-3.5 w-3.5" />
              <span>{total} Total Tasks</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Filter, search, organize, and prioritize your personal and sprint workflows with live MongoDB persistence.
          </p>
        </div>

        <Button
          size="sm"
          onClick={onOpenCreate}
          className="gap-1.5 text-xs font-semibold bg-primary text-primary-foreground shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Task</span>
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

      {/* Interactive Filters Bar */}
      <TaskFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
        onOpenCreate={onOpenCreate}
      />

      {/* Task List */}
      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onRetry={onRetry}
        onToggleStatus={onToggleStatus}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenCreate={onOpenCreate}
      />
    </div>
  );
};

export default MyTasks;
