import React from 'react';
import { Calendar, Check, Edit3, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const TaskItem = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formattedDate = formatDueDate(task.dueDate);

  const priorityBadgeVariant = {
    high: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
    medium: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    low: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
  }[task.priority || 'medium'] || 'border-border bg-secondary text-secondary-foreground';

  return (
    <article
      className={cn(
        "flex items-start gap-3.5 p-4 rounded-xl border border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-border hover:shadow-sm",
        isCompleted && "opacity-65"
      )}
    >
      <button
        type="button"
        onClick={() => onToggleStatus(task)}
        aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        className={cn(
          "mt-0.5 size-5 shrink-0 rounded-md border flex items-center justify-center transition-all cursor-pointer",
          isCompleted
            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm"
            : "border-border hover:border-primary/60 bg-muted/40"
        )}
      >
        {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
      </button>

      <div className="min-w-0 flex-1 space-y-1">
        <h3
          className={cn(
            "text-sm font-semibold text-foreground tracking-tight break-words",
            isCompleted && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </h3>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed break-words">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1.5">
          <span
            className={cn(
              "inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider",
              priorityBadgeVariant
            )}
          >
            {task.priority || 'medium'}
          </span>

          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider bg-muted/60 px-2 py-0.5 rounded-full border border-border/50">
            {task.status}
          </span>

          {formattedDate && (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          title="Edit task"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10"
          onClick={() => onDelete(task._id || task.id)}
          aria-label="Delete task"
          title="Delete task"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </article>
  );
};

export default TaskItem;
