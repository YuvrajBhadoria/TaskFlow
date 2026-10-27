# TaskFlow — Modern MERN Full-Stack Task Management Application

TaskFlow is a modern full-stack web application designed for organizing, prioritizing, and managing personal workflows and tasks. Built with the MERN stack (MongoDB, Express, React, Node.js), TaskFlow provides private, user-scoped task tracking, real-time filtering, search, sorting, and responsive aesthetics.

---

## 🌟 Key Features

- **Dashboard Metrics:** Real-time visibility into total, pending, and completed tasks with completion rate tracking.
- **Full CRUD Capabilities:** Create, read, update (PATCH permitted fields), and delete tasks.
- **Search & Filter:** Instant case-insensitive search by title and description, combined with status filters (`all`, `pending`, `completed`) and priority filters (`low`, `medium`, `high`).
- **Flexible Sorting:** Sort by creation date, due date, title, or priority in ascending or descending order.
- **User Authentication & Ownership Isolation:** Secure password hashing with `bcryptjs` and stateless session verification using `jsonwebtoken` (JWT via Bearer header or HTTP-only cookies). Every task query and mutation is strictly scoped to the authenticated user.
- **Clean Architecture:** Strict separation of Concerns across Models, Controllers, Routes, Middleware, and Services.
- **Design System:** Custom Vanilla CSS with dark/light themes, subtle gradients, glassmorphism, responsive navigation drawer, and accessible native `<dialog>` modals.
- **Automated API Testing:** Comprehensive integration test suite using Node's native test runner (`node:test`, `node:assert`) and `supertest`.

---

## 🏗️ Architecture & Folder Structure

```text
MERN_yuvi/
├── client/                         # React frontend (Vite)
│   ├── public/                     # Static files
│   ├── src/
│   │   ├── components/             # Reusable UI pieces
│   │   │   ├── Sidebar.jsx         # Responsive sidebar navigation
│   │   │   ├── TaskFilters.jsx     # Search, status pills, priority & sort dropdowns
│   │   │   ├── TaskForm.jsx        # Accessible <dialog> modal for create & edit
│   │   │   ├── TaskItem.jsx        # Individual task card with actions & badges
│   │   │   ├── TaskList.jsx        # Task collection renderer with skeletons & empty states
│   │   │   └── AuthModal.jsx       # Modal for Sign In & Registration
│   │   ├── pages/                  # Page-level views
│   │   │   ├── Dashboard.jsx       # Metrics & summary view
│   │   │   ├── MyTasks.jsx         # Filterable task management page
│   │   │   ├── CompletedTasks.jsx  # Archive of finished tasks
│   │   │   └── Settings.jsx        # Account details & API health diagnostics
│   │   ├── services/               # API clients
│   │   │   ├── api.js              # Fetch wrapper & token management
│   │   │   ├── authService.js      # Register, login, logout, getMe
│   │   │   └── taskService.js      # Task CRUD operations
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state & user rehydration
│   │   ├── App.jsx                 # Main application composition
│   │   ├── main.jsx                # React DOM entry point
│   │   └── index.css               # Vanilla CSS design system
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection setup
│   │   ├── models/
│   │   │   ├── Task.js             # Task schema with validation & indexing
│   │   │   └── User.js             # User schema with bcrypt password hashing
│   │   ├── controllers/
│   │   │   ├── taskController.js   # User-scoped task business logic
│   │   │   └── authController.js   # Registration, login, and auth logic
│   │   ├── routes/
│   │   │   ├── taskRoutes.js       # Protected task REST endpoints
│   │   │   └── authRoutes.js       # Auth endpoints
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT validation
│   │   │   └── errorHandler.js     # Uniform JSON error format
│   │   ├── app.js                  # Express app wiring
│   │   └── server.js               # Server bootstrap & DB connection
│   ├── tests/
│   │   └── api.test.js             # Automated API integration tests
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── TASKFLOW_GUIDE.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.x or newer recommended)
- **MongoDB** running locally on default port `27017` or a MongoDB Atlas URI

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env
cp .env.example .env

# Run database & API tests
npm test

# Start server in development mode (with nodemon)
npm run dev

# Or start in production mode
npm start
```

The Express API will be available at `http://localhost:5000`.  
Health check endpoint: `http://localhost:5000/api/health`

### 2. Frontend Setup

In a new terminal window:

```bash
cd client

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The React frontend will be accessible at `http://localhost:5173`.  
Vite is preconfigured with a development proxy forwarding `/api` requests to `http://localhost:5000`.

---

## 📡 REST API Reference

All API routes are prefixed with `/api`.

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Log in user (`email`, `password`) | No |
| `POST` | `/api/auth/logout` | Clears auth token / session cookie | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Yes |

### Task Endpoints (User-Scoped)

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/tasks` | List user's tasks (supports `search`, `status`, `priority`, `sortBy`, `order`) | `200 OK` |
| `GET` | `/api/tasks/:id` | Read a single task by ID | `200 OK` |
| `POST` | `/api/tasks` | Create a new task (`title`, `description`, `priority`, `dueDate`) | `201 Created` |
| `PATCH` | `/api/tasks/:id` | Update selected fields on a task | `200 OK` |
| `DELETE` | `/api/tasks/:id` | Delete a task | `204 No Content` |
| `GET` | `/api/tasks/stats/summary` | Get aggregated task counts (`total`, `pending`, `completed`) | `200 OK` |

### Error Format

Non-success responses adhere to the standard error specification:

```json
{
  "error": {
    "message": "Title is required",
    "code": "VALIDATION_ERROR"
  }
}
```

---

## 🧪 Testing

The backend includes 12 automated integration tests checking:
- Public health endpoint availability
- User registration and JWT generation
- Access denial without credentials (`401 Unauthorized`)
- Input validation on task creation (`400 Validation Error`)
- Task creation, modification, and deletion (`201`, `200`, `204`)
- Cross-user isolation (User B cannot read, list, update, or delete User A's tasks)

Run tests anytime:
```bash
cd server
npm test
```
