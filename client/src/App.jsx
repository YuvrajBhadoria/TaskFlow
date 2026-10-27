import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { TaskFlowDashboard } from './pages/TaskFlowDashboard';
import { MyTasks } from './pages/MyTasks';
import { CompletedTasks } from './pages/CompletedTasks';
import { ProjectsPage } from './pages/ProjectsPage';
import { Settings } from './pages/Settings';
import { AuthPage } from './pages/AuthPage';
import { TaskForm } from './components/TaskForm';
import { taskService } from './services/taskService';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/app-1-utils/sidebar';
import { App1Sidebar } from './components/ui/app-1-utils/app-1-sidebar';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { LogOut, Plus } from 'lucide-react';
import { app1User } from './components/ui/app-1-utils/app-1-data';

function TaskFlowApp() {
  const { isAuthenticated, user, loading: authLoading, logout } = useAuth();

  // Navigation pages: 'landing' | 'dashboard' | 'tasks' | 'completed' | 'projects' | 'settings' | 'auth'
  const [activePage, setActivePage] = useState(() => {
    try {
      const saved = sessionStorage.getItem('taskflow_active_page');
      return saved || 'landing';
    } catch {
      return 'landing';
    }
  });

  const handleNavigate = useCallback((targetPage) => {
    try {
      sessionStorage.setItem('taskflow_active_page', targetPage);
    } catch (e) {
      console.warn('sessionStorage error:', e);
    }
    setActivePage(targetPage);
  }, []);

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Enforce Protected Access: Dashboard and workspace pages require login
  const navigateWithAuth = (targetPage) => {
    const protectedPages = ['dashboard', 'tasks', 'completed', 'projects', 'settings'];
    if (protectedPages.includes(targetPage) && !isAuthenticated) {
      showToast('Please sign in or create an account to access the dashboard workspace.', 'error');
      handleNavigate('auth');
      return;
    }
    handleNavigate(targetPage);
  };

  // If user logs out while on a protected page, redirect to landing
  useEffect(() => {
    if (authLoading) return; // Do not prematurely redirect while verifying token
    const protectedPages = ['dashboard', 'tasks', 'completed', 'projects', 'settings'];
    if (!isAuthenticated && protectedPages.includes(activePage)) {
      handleNavigate('landing');
    }
  }, [isAuthenticated, activePage, authLoading, handleNavigate]);

  // Fetch tasks for authenticated user
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks([]);
      setTasksLoading(false);
      return;
    }

    setTasksLoading(true);
    setTasksError(null);
    try {
      const data = await taskService.getTasks({
        search,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        order
      });
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[TaskFlow] Fetch error:', err);
      setTasksError(err.message || 'Failed to load tasks from server');
    } finally {
      setTasksLoading(false);
    }
  }, [isAuthenticated, search, statusFilter, priorityFilter, sortBy, order]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenCreate = () => {
    if (!isAuthenticated) {
      navigateWithAuth('auth');
      return;
    }
    setEditingTask(null);
    setTaskFormOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask._id || editingTask.id, formData);
        setTasks((prev) =>
          prev.map((t) => ((t._id || t.id) === (updated._id || updated.id) ? updated : t))
        );
        showToast('Task updated in MongoDB database!');
      } else {
        const created = await taskService.createTask(formData);
        setTasks((prev) => [created, ...prev]);
        showToast('Task persisted to MongoDB!');
      }
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
      throw err;
    }
  };

  const handleToggleStatus = async (task) => {
    const taskId = task._id || task.id;
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const updated = await taskService.updateTask(taskId, { status: nextStatus });
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === taskId ? updated : t))
      );
      showToast(`Task marked as ${nextStatus}!`);
    } catch (err) {
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== taskId));
      showToast('Task deleted from MongoDB.');
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('taskflow_active_page');
    } catch {}
    await logout();
    handleNavigate('landing');
    showToast('You have been signed out.');
  };

  // Toast Notification Overlay
  const ToastOverlay = () =>
    toastMessage ? (
      <div className="fixed top-5 right-5 z-50 animate-fade-slide-in-1">
        <div
          className={`px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl border ${
            toastMessage.type === 'error'
              ? 'bg-destructive/95 text-destructive-foreground border-destructive'
              : 'bg-emerald-600/95 text-white border-emerald-400/40 backdrop-blur-md'
          }`}
        >
          {toastMessage.message}
        </div>
      </div>
    ) : null;

  // Initial Authentication Verification State
  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center gap-3">
        <div className="size-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-500/30 animate-pulse">
          TF
        </div>
        <p className="text-xs text-muted-foreground animate-pulse font-medium">
          Loading TaskFlow workspace...
        </p>
      </div>
    );
  }

  // View: Landing Page (Public default)
  if (activePage === 'landing') {
    return (
      <>
        <ToastOverlay />
        <LandingPage
          onNavigateToDashboard={() => navigateWithAuth('dashboard')}
          onNavigateToTasks={() => navigateWithAuth('tasks')}
          onNavigateToAuth={() => handleNavigate('auth')}
        />
      </>
    );
  }

  // View: Auth Page (Sign In / Register)
  if (activePage === 'auth') {
    return (
      <>
        <ToastOverlay />
        <AuthPage
          onSuccess={() => {
            showToast('Welcome back! Loading your workspace...');
            handleNavigate('dashboard');
          }}
          onBackToHome={() => handleNavigate('landing')}
        />
      </>
    );
  }

  // Strict Authentication Guard: Protect dashboard and workspace views
  if (!isAuthenticated) {
    return (
      <>
        <ToastOverlay />
        <AuthPage
          onSuccess={() => {
            showToast('Welcome back! Loading your workspace...');
            handleNavigate('dashboard');
          }}
          onBackToHome={() => handleNavigate('landing')}
        />
      </>
    );
  }

  const displayName = user?.name || app1User.name;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const pageTitleMap = {
    dashboard: 'Dashboard Overview',
    tasks: 'My Tasks',
    completed: 'Completed Tasks',
    projects: 'Projects & Sprints',
    settings: 'Settings & Preferences'
  };

  // Protected Views: Unified Workspace Shell
  return (
    <SidebarProvider>
      <ToastOverlay />

      <App1Sidebar
        activeNav={activePage}
        onNavSelect={(id) => {
          if (id === 'landing') handleNavigate('landing');
          else navigateWithAuth(id);
        }}
      />

      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border/60 bg-background/95 backdrop-blur-md px-4 sm:px-6">
          <SidebarTrigger aria-label="Toggle navigation" />
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground hidden sm:inline-block">
              Workspace
            </span>
            <span className="text-muted-foreground/50 hidden sm:inline-block">/</span>
            <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">
              {pageTitleMap[activePage] || 'Workspace'}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleOpenCreate}
              className="gap-1.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNavigate('landing')}
              className="text-xs border-border/70 hidden sm:inline-flex"
            >
              Home
            </Button>

            <div className="h-5 w-[1px] bg-border/60 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2 pl-1">
              <Avatar className="size-8 ring-1 ring-border">
                <AvatarImage
                  src={app1User.avatar}
                  alt={displayName}
                  className="object-[50%_15%]"
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <span className="text-xs font-medium text-foreground hidden md:inline-block max-w-[120px] truncate">
                {displayName.split(" ")[0]}
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Sign out"
                aria-label="Sign out"
                className="size-8 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <TaskFlowDashboard
              tasks={tasks}
              loading={tasksLoading}
              error={tasksError}
              onOpenCreate={handleOpenCreate}
              onToggleStatus={handleToggleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteTask}
              onNavigatePage={(page) => {
                if (page === 'landing') handleNavigate('landing');
                else navigateWithAuth(page);
              }}
            />
          )}

          {activePage === 'tasks' && (
            <MyTasks
              tasks={tasks}
              loading={tasksLoading}
              error={tasksError}
              onRetry={fetchTasks}
              search={search}
              setSearch={setSearch}
              status={statusFilter}
              setStatus={setStatusFilter}
              priority={priorityFilter}
              setPriority={setPriorityFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              order={order}
              setOrder={setOrder}
              onOpenCreate={handleOpenCreate}
              onToggleStatus={handleToggleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteTask}
            />
          )}

          {activePage === 'completed' && (
            <CompletedTasks
              tasks={tasks}
              loading={tasksLoading}
              error={tasksError}
              onRetry={fetchTasks}
              onToggleStatus={handleToggleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteTask}
              onNavigateToTasks={() => handleNavigate('tasks')}
            />
          )}

          {activePage === 'projects' && (
            <ProjectsPage onNavigateToTasks={() => handleNavigate('tasks')} />
          )}

          {activePage === 'settings' && (
            <Settings onOpenAuthModal={() => handleNavigate('auth')} />
          )}
        </main>
      </SidebarInset>

      <TaskForm
        isOpen={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
      />
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TaskFlowApp />
    </AuthProvider>
  );
}
