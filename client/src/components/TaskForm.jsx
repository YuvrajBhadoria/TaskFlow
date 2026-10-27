import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TaskForm = ({ isOpen, onClose, onSubmit, initialTask = null }) => {
  const dialogRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'medium');
      setStatus(initialTask.status || 'pending');
      setDueDate(
        initialTask.dueDate
          ? new Date(initialTask.dueDate).toISOString().split('T')[0]
          : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('pending');
      setDueDate('');
    }
    setValidationError('');
  }, [initialTask, isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    // Only close if user clicked directly on the dialog backdrop, not child elements or native date pickers
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Please enter a task title.');
      return;
    }

    setIsSubmitting(true);
    setValidationError('');

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null
      });
      onClose();
    } catch (err) {
      setValidationError(err.message || 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={handleBackdropClick}
      aria-labelledby="task-form-title"
      className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xl backdrop-blur-xl text-card-foreground w-[92%] max-w-lg fixed inset-0 m-auto"
    >
      <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-5">
        <h2 id="task-form-title" className="text-lg font-bold tracking-tight text-foreground">
          {initialTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {validationError && (
          <div className="p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="task-title-input" className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Title <span className="text-rose-400">*</span>
          </Label>
          <Input
            id="task-title-input"
            type="text"
            placeholder="e.g. Implement user authentication test suite"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            className="bg-background/80 border-border/70 h-10 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="task-description-input" className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Description
          </Label>
          <textarea
            id="task-description-input"
            className="w-full min-h-[90px] rounded-lg border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            placeholder="Add relevant notes, checklist items, or details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Priority Level
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'low', label: 'Low', activeClass: 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-semibold' },
              { id: 'medium', label: 'Medium', activeClass: 'border-amber-500 bg-amber-500/15 text-amber-400 font-semibold' },
              { id: 'high', label: 'High', activeClass: 'border-rose-500 bg-rose-500/15 text-rose-400 font-semibold' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  "py-2 text-xs rounded-lg border border-border/70 bg-background/60 transition-all cursor-pointer text-muted-foreground hover:text-foreground",
                  priority === item.id && item.activeClass
                )}
                onClick={() => setPriority(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="task-duedate-input" className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Due Date
            </Label>
            <Input
              id="task-duedate-input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-background/80 border-border/70 h-10 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-status-input" className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Status
            </Label>
            <select
              id="task-status-input"
              className="w-full h-10 rounded-lg border border-border/70 bg-background/80 px-3 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-9 px-4 text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground shadow-sm"
          >
            {isSubmitting ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </dialog>
  );
};

export default TaskForm;
