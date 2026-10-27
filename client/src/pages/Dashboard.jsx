import React from 'react';
import { TaskItem } from '../components/TaskItem';

export const Dashboard = ({
  tasks,
  loading,
  error,
  stats,
  onOpenCreate,
  onToggleStatus,
  onEdit,
  onDelete,
  onNavigateToTasks
}) => {
  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="dashboard-page">
      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Tasks</span>
            <span className="metric-value">{stats.total}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box pending">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Pending</span>
            <span className="metric-value">{stats.pending}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box completed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Completed</span>
            <span className="metric-value">{stats.completed}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box rate">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20V10"></path>
              <path d="M12 20V4"></path>
              <path d="M6 20v-6"></path>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Completion Rate</span>
            <span className="metric-value">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* Progress banner */}
      <div
        style={{
          background: 'var(--bg-surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Overall Workflow Progress</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onOpenCreate}>
            + Add Task
          </button>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'var(--bg-input)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${completionRate}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent-cyan) 100%)',
              transition: 'width 0.5s ease'
            }}
          />
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Recent Tasks</h3>
        <button
          className="btn btn-ghost btn-sm"
          onClick={onNavigateToTasks}
          style={{ color: 'var(--primary)' }}
        >
          View All Tasks →
        </button>
      </div>

      {loading ? (
        <div className="task-list">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : error ? (
        <div className="alert-banner error">
          <span>{error}</span>
        </div>
      ) : recentTasks.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No tasks created yet. Create one to see it here!</p>
          <button className="btn btn-primary btn-sm" onClick={onOpenCreate}>
            + Create New Task
          </button>
        </div>
      ) : (
        <div className="task-list">
          {recentTasks.map((task) => (
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
