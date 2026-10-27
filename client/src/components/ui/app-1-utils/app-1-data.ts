import { ChartConfig } from "@/components/ui/chart";

export const app1User = {
  name: "Alex Morgan",
  email: "alex.morgan@taskflow.dev",
  initials: "AM",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
};

export const app1ChartConfig: ChartConfig = {
  opened: {
    label: "Opened Tasks",
    color: "#818cf8"
  },
  completed: {
    label: "Completed Tasks",
    color: "#34d399"
  }
};

export const app1Chart = [
  { week: "W1", opened: 32, completed: 28 },
  { week: "W2", opened: 45, completed: 38 },
  { week: "W3", opened: 40, completed: 44 },
  { week: "W4", opened: 52, completed: 48 },
  { week: "W5", opened: 48, completed: 54 },
  { week: "W6", opened: 60, completed: 58 },
  { week: "W7", opened: 55, completed: 62 },
  { week: "W8", opened: 68, completed: 64 }
];

export const app1Projects = [
  {
    id: "proj-1",
    name: "MERN TaskFlow Core Refactor",
    description: "Complete REST API endpoints with user scoping and tests.",
    status: "In progress" as const,
    progress: 85,
    dueDate: "Tomorrow",
    team: [
      {
        name: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        initials: "AM"
      },
      {
        name: "David Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        initials: "DC"
      }
    ]
  },
  {
    id: "proj-2",
    name: "Shadcn UI & Tailwind 4 Migration",
    description: "Theme integration, area charts, and responsive hero components.",
    status: "In review" as const,
    progress: 92,
    dueDate: "Oct 30",
    team: [
      {
        name: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        initials: "ER"
      }
    ]
  },
  {
    id: "proj-3",
    name: "Authentication & Security Hardening",
    description: "Stateless JWT, bcrypt password hashes, and rate-limiting.",
    status: "Planning" as const,
    progress: 45,
    dueDate: "Nov 05",
    team: [
      {
        name: "Marcus Vance",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        initials: "MV"
      },
      {
        name: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        initials: "AM"
      }
    ]
  }
];

export const app1Activity = [
  {
    id: "act-1",
    person: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      initials: "DC"
    },
    action: "completed 6 tasks in Sprint Backlog",
    time: "12m ago"
  },
  {
    id: "act-2",
    person: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      initials: "ER"
    },
    action: "updated progress to 92% on UI Migration",
    time: "45m ago"
  },
  {
    id: "act-3",
    person: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      initials: "MV"
    },
    action: "verified JWT authorization integration tests",
    time: "2h ago"
  }
];
