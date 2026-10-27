import React from 'react';
import { ArrowUpDown, Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export const TaskFilters = ({
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
  onOpenCreate
}) => {
  return (
    <Card className="p-4 mb-6 border-border/60 bg-card/60 backdrop-blur-sm shadow-sm space-y-4">
      {/* Top Search & Create Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search tasks by title or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-9 bg-background/80 border-border/70 h-10 text-sm focus-visible:ring-indigo-400"
            aria-label="Search tasks"
          />
          {search && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {onOpenCreate && (
          <Button
            onClick={onOpenCreate}
            className="gap-1.5 font-semibold bg-primary text-primary-foreground h-10 rounded-lg shadow-sm shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        )}
      </div>

      {/* Bottom Filter Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border/40">
        {/* Status Filter Tabs */}
        <div className="flex p-0.5 bg-muted/60 rounded-lg ring-1 ring-border/50 self-start sm:self-auto">
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              status === 'all'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setStatus('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              status === 'pending'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setStatus('pending')}
          >
            Pending
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              status === 'completed'
                ? 'bg-background text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setStatus('completed')}
          >
            Completed
          </button>
        </div>

        {/* Priority & Sorting Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="h-8 rounded-lg bg-background/80 border border-border/70 px-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <select
            className="h-8 rounded-lg bg-background/80 border border-border/70 px-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort by field"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs px-2.5 border-border/70"
            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            title={`Sort order: ${order === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>{order === 'asc' ? 'Asc' : 'Desc'}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskFilters;
