# TaskFlow — MERN Full-Stack Project Architecture & Implementation Guide

> **Purpose:** A beginner-friendly, milestone-based plan for building TaskFlow yourself. Use this document as the project roadmap. Build one milestone, test it, and understand it before moving on.

## 1. Project Overview

TaskFlow is a task-management website. Users will be able to create tasks, view their tasks, edit them, mark them as completed, delete them, search, filter, and sort them. Later, users will register and log in so that each account can access only its own tasks.

### Main features

- Dashboard summary: total, pending, and completed tasks.
- Create, view, edit, complete, and delete tasks.
- Search by task title; filter by status; sort tasks.
- Optional descriptions, priorities, and due dates.
- Responsive desktop and mobile interface.
- Loading states, empty states, validation, and useful error messages.
- Registration, login, logout, and private task data.
- Basic backend tests and setup documentation.

### Technology choices

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | Build the interactive user interface |
| Styling | Plain CSS | Layout, colors, spacing, and responsive behavior |
| Backend | Node.js + Express | Run the API and business logic |
| Database | MongoDB + Mongoose | Store tasks and users persistently |
| HTTP client | Fetch API | Send requests from React to Express |
| Authentication | bcrypt + JWT | Hash passwords and authenticate requests |
| Version control | Git + GitHub | Track changes and back up the project |
| Testing | Node test tooling / Supertest (introduced later) | Check API behavior automatically |

Use JavaScript throughout. Do not add TypeScript, Redux, Docker, or a UI framework for this project.

---

## 2. High-Level Architecture

```text
┌──────────────────────────────────────────────┐
│ Browser                                      │
│ React + Vite + CSS                           │
│ Dashboard, forms, filters, task list          │
└──────────────────────┬───────────────────────┘
                       │ HTTP requests / JSON responses
                       │ Fetch API
                       ▼
┌──────────────────────────────────────────────┐
│ Node.js + Express API                        │
│                                              │
│ Routes → Middleware → Controllers → Models   │
│                 │                            │
│       Validation / Authentication            │
└──────────────────────┬───────────────────────┘
                       │ Mongoose queries
                       ▼
┌──────────────────────────────────────────────┐
│ MongoDB                                      │
│ Collections: tasks, users                    │
└──────────────────────────────────────────────┘
```

### What each layer does

**React frontend:** Displays the page and reacts to user actions. It holds temporary UI state, such as the current search text, selected filter, and tasks currently displayed. It should not connect directly to MongoDB.

**Express API:** Receives HTTP requests, checks the request, runs the relevant logic, and sends an HTTP response. It is the controlled entry point to your data.

**MongoDB:** Stores tasks and users beyond a browser refresh or server restart. MongoDB stores documents in collections; Mongoose gives JavaScript code schemas and convenient database operations.

### Example: creating a task

1. A user fills in the “New task” form in React.
2. React sends `POST /api/tasks` with a JSON body using `fetch()`.
3. Express matches the request to the task route.
4. Middleware parses JSON and, later, verifies the logged-in user.
5. The controller validates the data and asks the Mongoose model to save it.
6. MongoDB stores the task.
7. Express responds with a status code and JSON containing the created task.
8. React handles success or failure and updates the displayed task list.

The browser never receives the database password and never talks directly to MongoDB.

---

## 3. Proposed Folder Structure

The project will use two main applications: `client` (frontend) and `server` (backend).

```text
taskflow/
├── client/                         # React frontend
│   ├── public/                     # Static files copied as-is
│   ├── src/
│   │   ├── assets/                 # Images and other imported assets
│   │   ├── components/             # Reusable UI pieces
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskFilters.jsx
│   │   ├── pages/                  # Larger page-level views
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyTasks.jsx
│   │   │   ├── CompletedTasks.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/               # Functions that call the backend API
│   │   │   └── taskService.js
│   │   ├── styles/                 # Optional organized CSS files
│   │   ├── App.jsx                 # Main app composition
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles and resets
│   ├── .env.example                # Example frontend environment config (no secrets)
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection setup
│   │   ├── models/
│   │   │   ├── Task.js             # Task database schema
│   │   │   └── User.js             # User schema (added in auth milestone)
│   │   ├── controllers/
│   │   │   ├── taskController.js   # Request handling and task logic
│   │   │   └── authController.js   # Register/login logic (added later)
│   │   ├── routes/
│   │   │   ├── taskRoutes.js       # Task endpoint definitions
│   │   │   └── authRoutes.js       # Authentication endpoints (added later)
│   │   ├── middleware/
│   │   │   ├── errorHandler.js     # Consistent error responses
│   │   │   └── authMiddleware.js   # JWT verification (added later)
│   │   ├── app.js                  # Express app and middleware wiring
│   │   └── server.js               # Environment setup, DB connection, listen()
│   ├── tests/                      # API tests (introduced later)
│   ├── .env                        # Local secrets; never commit this
│   ├── .env.example                # Names of required variables, no real secrets
│   └── package.json
│
├── .gitignore
├── README.md
└── TASKFLOW_GUIDE.md               # This guide
```

### Why separate backend files?

- **Routes:** Say which URL and HTTP method maps to which handler. Example: `PATCH /api/tasks/:id`.
- **Controllers:** Handle a request, call the model, and choose the response.
- **Models:** Define the shape and validation rules for stored documents.
- **Middleware:** Runs between receiving a request and reaching the controller. Examples include JSON parsing, authentication, and error handling.
- **Config:** Keeps setup code, such as the database connection, separate from task logic.
- **`app.js` vs `server.js`:** `app.js` builds and configures the Express app; `server.js` starts the process and opens the listening port. This separation makes the app easier to test.

Do not create every file on day one. Add files when their milestone needs them.

---

## 4. Task Data Design

### Task document

The initial task shape is:

```js
{
  title: "Finish React lesson",
  description: "Build the task list component",
  priority: "medium",       // "low" | "medium" | "high"
  status: "pending",        // "pending" | "completed"
  dueDate: null,            // optional date
  createdAt: "automatic timestamp"
}
```

Mongoose will define the actual schema and automatically create `createdAt` through timestamps. In the authentication stage, add an `owner` field referencing the user who created the task.

### Suggested validation rules

- `title`: required string; trim whitespace; reject an empty title.
- `description`: optional string.
- `priority`: only `low`, `medium`, or `high`; default to `medium`.
- `status`: only `pending` or `completed`; default to `pending`.
- `dueDate`: optional valid date.
- `createdAt`: generated by the server/database layer, not trusted from the client.
- `owner`: set from the authenticated user on the server, never accept an arbitrary owner ID from the frontend.

### Important data rule

Before authentication, tasks are shared test data. Once authentication is implemented, every task query and mutation must be scoped to the authenticated user. For example, the server should look up a task by both its ID and the current user's ID, not by ID alone.

---

## 5. REST API Plan

The API base path is `/api`.

| Method | Endpoint | Purpose | Typical success status |
|---|---|---|---|
| `GET` | `/api/tasks` | List tasks | `200 OK` |
| `GET` | `/api/tasks/:id` | Read one task | `200 OK` |
| `POST` | `/api/tasks` | Create task | `201 Created` |
| `PATCH` | `/api/tasks/:id` | Update selected fields | `200 OK` |
| `DELETE` | `/api/tasks/:id` | Delete task | `204 No Content` |

Later authentication endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Create a user account |
| `POST` | `/api/auth/login` | Verify credentials and establish a session/token |
| `POST` | `/api/auth/logout` | End the client session; for cookie-based auth, clear the cookie |

### HTTP status codes to learn

- `200`: request succeeded.
- `201`: a new resource was created.
- `204`: request succeeded and there is no response body.
- `400`: invalid request data.
- `401`: missing or invalid authentication.
- `403`: authenticated but not allowed to perform the action.
- `404`: requested resource does not exist (or is not visible to this user).
- `500`: unexpected server error.

Return a consistent JSON error shape for errors, for example:

```json
{
  "error": {
    "message": "Title is required",
    "code": "VALIDATION_ERROR"
  }
}
```

For a `204` response, do not send a JSON body.

---

## 6. Milestone-Based Implementation Plan

**Rule:** Do not move on until the current milestone runs and you can explain what you built.

### Milestone 0 — Tools and project setup

**Goal:** Confirm the development tools work and create the frontend skeleton.

Learn:
- What Node.js does.
- What npm does.
- What Vite provides.
- Why frontend and backend are separate processes during development.

Tasks:
1. Install a current supported Node.js LTS release.
2. Install Git.
3. Create a project directory named `taskflow`.
4. Use Vite to create the React app in `client`.
5. Start the Vite development server and open the local URL it prints.
6. Create a Git repository and make the first commit.

Commands for Windows PowerShell, run from the folder where you want the project:

```powershell
mkdir taskflow
cd taskflow
npm create vite@latest client -- --template react
cd client
npm install
npm run dev
```

Open the local URL shown in the terminal. To stop the server, press `Ctrl+C`.

**First small task:** Replace the default Vite heading in `client/src/App.jsx` with a heading that says `TaskFlow` and a short subtitle. Do not build the whole dashboard yet.

**Check your understanding:**
1. What does Vite do during development?
2. Is React a database?
3. Which command starts the frontend server?

### Milestone 1 — Static frontend dashboard

**Goal:** Build the layout using sample tasks in JavaScript.

Build:
- Sidebar navigation.
- Dashboard summary cards.
- New-task form.
- Task list and task item.
- Status and priority labels.
- Responsive CSS for mobile and desktop.

Start with a small array of sample tasks in `App.jsx`. At this stage, data will reset if you refresh the page. That is expected.

Learn:
- JSX and React components.
- Props: passing information from a parent component to a child.
- State: values that change and cause the UI to update.
- Rendering arrays with `.map()`.
- Event handlers and controlled form inputs.
- CSS Flexbox/Grid and media queries.

**Implementation tasks:**
1. Create `Sidebar.jsx` and render it from `App.jsx`.
2. Create `TaskItem.jsx` that receives a task through props.
3. Create `TaskList.jsx` that renders task items with `.map()`.
4. Add sample tasks and dashboard counts.
5. Add the form and controlled input state.
6. Add search and All/Pending/Completed filters.
7. Add edit, delete, and complete actions.
8. Make the layout responsive.

**Acceptance checklist:**
- [ ] Sample tasks render correctly.
- [ ] Counts match the sample data.
- [ ] Search is case-insensitive.
- [ ] Filters can be combined with search.
- [ ] Creating a task adds it to the visible list.
- [ ] Completing a task updates the status and counts.
- [ ] Editing and deleting work.
- [ ] Layout works at narrow screen widths.

**Exercise:** Explain why a normal local variable is not enough for values that must update the React UI.

### Milestone 2 — Express server and first route

**Goal:** Start a backend server and understand request/response flow before adding the database.

Install dependencies from `server` only when you reach this milestone:

```powershell
mkdir ..\server
cd ..\server
npm init -y
npm install express
npm install --save-dev nodemon
```

Add a development script to `server/package.json`, for example:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js"
  }
}
```

Keep any existing `package.json` fields; merge the script rather than replacing the entire file.

Build in this order:
1. Create `src/app.js` and configure the Express application.
2. Add `express.json()` so Express can parse JSON request bodies.
3. Create `src/server.js` to listen on a port such as `5000`.
4. Add a simple `GET /api/health` route that returns `{ "status": "ok" }`.
5. Test it in the browser or with `curl`.

Learn:
- HTTP methods and URLs.
- Express routing.
- Middleware and request lifecycle.
- Why the frontend and backend have different ports.
- Why JSON parsing is required for JSON request bodies.

**Exercise:** What should happen if the client sends malformed JSON?

### Milestone 3 — REST routes and controller separation

**Goal:** Implement the API contract with temporary in-memory data before connecting MongoDB.

Suggested files:
- `src/routes/taskRoutes.js`
- `src/controllers/taskController.js`
- `src/app.js`

Implement all five task routes using a temporary array. This is a learning step; in-memory data disappears when the server restarts and is not the final storage solution.

Learn:
- Route parameters such as `:id`.
- Request body vs route parameters.
- `req.params`, `req.body`, and `res`.
- `async` / `await` and error handling.
- Why controllers keep route files readable.

**Acceptance checklist:**
- [ ] List tasks.
- [ ] Read one task by ID.
- [ ] Create a task.
- [ ] Update selected fields.
- [ ] Delete a task.
- [ ] Return appropriate status codes for missing tasks and invalid input.

**Exercise:** Why is `PATCH` useful when changing only a task's status?

### Milestone 4 — MongoDB and Mongoose

**Goal:** Replace the temporary array with permanent database storage.

Learn:
- Database vs in-memory variables.
- Collections and documents.
- Schema, model, and validation.
- Database connection failures and asynchronous operations.
- Why credentials belong in environment variables.

Install dependencies inside `server`:

```powershell
npm install mongoose dotenv
```

Implementation tasks:
1. Create a local MongoDB instance or a MongoDB Atlas database.
2. Add `MONGODB_URI` and `PORT` to `server/.env`.
3. Add `.env` to `.gitignore`.
4. Create `src/config/db.js` for the connection.
5. Create `src/models/Task.js` with schema validation and timestamps.
6. Update controllers to use Mongoose methods.
7. Handle malformed MongoDB IDs and validation errors.
8. Test each route again.

Example `server/.env.example` (use placeholders only):

```dotenv
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
```

Never commit the real `.env`. Never place database credentials in `client` environment variables. Frontend variables are visible to users after bundling.

**Acceptance checklist:**
- [ ] Tasks survive a server restart.
- [ ] Invalid title/priority/status is rejected.
- [ ] Invalid IDs return a useful client error.
- [ ] Missing tasks return `404`.
- [ ] Database errors do not expose secrets or stack traces to users.

**Exercise:** What is the difference between a Mongoose schema and a MongoDB collection?

### Milestone 5 — Connect React to the API

**Goal:** Remove sample data and use real API responses.

Create `client/src/services/taskService.js` for reusable `fetch()` calls. If you use a Vite environment variable for the API URL, name it with the `VITE_` prefix, such as `VITE_API_URL`. This is public configuration, not a place for secrets.

Implementation tasks:
1. Fetch tasks when the app loads.
2. Show a loading state while waiting.
3. Show a useful error state if the API is unavailable.
4. Submit new tasks with `POST`.
5. Update tasks with `PATCH`.
6. Delete tasks with `DELETE`.
7. Refresh or update local state after successful mutations.
8. Handle an empty list.
9. Configure CORS on Express if the frontend and API use different origins.

Important: `fetch()` does not automatically throw for HTTP error status codes. Check `response.ok` and handle non-success responses.

**Acceptance checklist:**
- [ ] Refreshing the browser still shows saved tasks.
- [ ] Every CRUD action changes the database.
- [ ] Loading and error states are visible.
- [ ] The UI does not claim success when the API request fails.
- [ ] Empty, loading, error, and normal states are distinct.

**Exercise:** What is the difference between a network failure and a response with status `404`?

### Milestone 6 — Authentication and task ownership

**Goal:** Add registration and login only after unauthenticated CRUD works.

Install later, when you reach this milestone:

```powershell
npm install bcryptjs jsonwebtoken cookie-parser
```

You may choose `bcrypt` instead of `bcryptjs` if your environment supports it. Use one password-hashing package, not both.

Implementation tasks:
1. Add a `User` model with a unique, normalized email and a password hash.
2. Register users; hash passwords before saving.
3. Log in by comparing the submitted password against the hash.
4. Add authentication middleware to verify the token.
5. Add a task `owner` reference.
6. Set `owner` from the verified user in the backend.
7. Scope every task list, read, update, and delete operation to that user.
8. Add login/register UI and logout behavior.
9. Test that one user cannot access another user's tasks.

### Authentication storage trade-offs

A JWT is a signed token, not an encrypted container. Do not put passwords or sensitive data inside it.

For a browser app, an **HttpOnly, Secure, SameSite cookie** is often a good default because JavaScript cannot read an HttpOnly cookie. You must configure cookie options correctly and consider CSRF protections. Local storage is simpler for a beginner demo, but JavaScript can read it, so an XSS vulnerability can expose the token. Choose deliberately rather than assuming JWT automatically makes the app secure.

Production considerations include HTTPS, rate limiting login attempts, safe error messages, secret rotation, token expiry, and a logout strategy that actually invalidates or clears the session/token as designed.

**Acceptance checklist:**
- [ ] Passwords are never stored in plain text.
- [ ] Login failures return a safe error.
- [ ] Protected endpoints reject missing/invalid credentials.
- [ ] Every task query is scoped to the authenticated user.
- [ ] User A cannot read, update, or delete User B's tasks.
- [ ] Logout clears the chosen client session/token mechanism.

**Exercise:** Why is hiding another user's task in React not a security control?

### Milestone 7 — Quality, tests, and finishing

**Goal:** Make the project easier to use, debug, and share.

Add:
- Form validation and helpful field messages.
- Delete confirmation.
- Filtering and sorting by status, priority, and due date.
- Consistent API error shape.
- Basic tests for success and failure cases.
- README installation and usage instructions.
- `.gitignore` and `.env.example`.
- A final manual test of all core flows.

Suggested test cases:
- `GET /api/tasks` returns a list.
- Creating a valid task returns `201`.
- Creating a task without a title fails.
- Reading a nonexistent ID returns `404`.
- Updating a task changes only permitted fields.
- Deleting a task succeeds.
- Unauthenticated access to protected routes is rejected.
- A user cannot change another user's task.

**Definition of done:**
- [ ] App can be installed from a fresh clone using the README.
- [ ] No secrets are committed.
- [ ] All core task flows work.
- [ ] Authentication and ownership checks are tested.
- [ ] Error and empty states are handled.
- [ ] Code is organized and understandable.

---

## 7. Git and GitHub Workflow

Initialize Git at the project root:

```powershell
git init
```

Create a root `.gitignore` containing at least:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
coverage/
.DS_Store
```

If using `client/.env.example` or `server/.env.example`, the ignore rule above keeps those example files tracked.

A useful commit rhythm:

1. `chore: create Vite React app`
2. `feat: build static dashboard layout`
3. `feat: add task interactions`
4. `feat: add Express health endpoint`
5. `feat: implement task CRUD API`
6. `feat: persist tasks with MongoDB`
7. `feat: connect React to task API`
8. `feat: add user authentication`
9. `test: cover task API endpoints`
10. `docs: add setup instructions`

Commit small, working changes. Do not commit `.env`, credentials, or real user data.

---

## 8. Debugging Checklist

When something fails, avoid guessing. Collect the exact evidence.

1. Read the full terminal error, not just the last line.
2. Identify which process failed: Vite, Express, or MongoDB.
3. Check the URL, HTTP method, status code, and response body.
4. Check the browser console and Network tab.
5. Confirm environment variables are loaded by the backend.
6. Confirm the database connection succeeded.
7. Reproduce the smallest failing case.
8. Share the exact error and relevant code when asking for help; remove secrets first.

### Common symptoms

| Symptom | First thing to check |
|---|---|
| Vite page will not load | Terminal output and URL printed by Vite |
| API returns `404` | Route path, HTTP method, and route mounting |
| `req.body` is undefined | Is `express.json()` registered before the route? |
| Browser reports CORS | Express CORS configuration and origin |
| MongoDB connection fails | URI, network access, database status, credentials |
| Changes vanish after restart | Are controllers still using an in-memory array? |
| `fetch()` seems successful on `404` | Check `response.ok`; `fetch()` does not reject for HTTP errors |
| Another user can access a task | Add and test owner-scoped database queries |

Never paste passwords, tokens, or database connection strings into chat or public issue trackers.

---

## 9. Learning Glossary

- **Frontend:** The part users see and interact with.
- **Backend:** Server-side code that handles requests and rules.
- **API:** A defined way for programs to communicate.
- **REST:** A common API style that uses resources, URLs, and HTTP methods.
- **Route:** Connects an HTTP method and URL to code.
- **Middleware:** Code that runs during request processing, often before a controller.
- **Controller:** Handles request logic and creates a response.
- **Model:** Defines how application code represents and stores data.
- **Schema:** Rules describing the fields and types in a document.
- **CRUD:** Create, Read, Update, Delete.
- **JSON:** A text format for exchanging structured data.
- **Promise / async-await:** JavaScript tools for working with operations that finish later.
- **Environment variable:** Configuration supplied outside source code.
- **JWT:** A signed token format often used to carry authentication claims.
- **Hashing:** A one-way transformation used to store password verifiers safely.
- **CORS:** Browser rules controlling cross-origin requests.
- **Validation:** Checking data before accepting or storing it.

---

## 10. First Session Checklist

Do only this first:

- [ ] Confirm Node.js and Git are installed.
- [ ] Create `taskflow/client` using Vite's React template.
- [ ] Run `npm install`.
- [ ] Run `npm run dev`.
- [ ] Open the local URL in your browser.
- [ ] Change the starter page to show the TaskFlow heading and subtitle.
- [ ] Stop the server and make your first Git commit.

**Do not start the backend or install MongoDB dependencies yet.** First make sure the React app runs. Once it works, build the static dashboard in small steps.

## 11. How to Ask for Code Review

When a milestone fails, send:
1. The milestone you are working on.
2. The exact error text.
3. The relevant file(s).
4. What you expected to happen.
5. What actually happened.

The mentoring rule is: start with a hint and explain the reason. Provide the full corrected implementation when explicitly requested or when a complete example is the best way to unblock learning.
