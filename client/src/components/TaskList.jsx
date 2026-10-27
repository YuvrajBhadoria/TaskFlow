import React from 'react';
import { AlertCircle, ClipboardList, Plus } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const TaskList = ({
  tasks,
  loading,
  error,
  onRetry,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenCreate
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 border-destructive/40 bg-destructive/10 text-rose-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="h-8 text-xs border-destructive/50">
            Retry
          </Button>
        )}
      </Card>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-14 px-4 border border-dashed rounded-2xl border-border/70 bg-card/40 flex flex-col items-center justify-center">
        <div className="size-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
          <ClipboardList className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No tasks found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4 leading-relaxed">
          There are no tasks matching your current view or filter criteria. Create a new task to get started!
        </p>
        {onOpenCreate && (
          <Button size="sm" onClick={onOpenCreate} className="gap-1.5 font-semibold">
            <Plus className="h-4 w-4" />
            <span>Create New Task</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id || task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
