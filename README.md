# ⚡ TaskFlow — Full-Stack MERN Kanban App

> A production-grade project management SaaS built with MongoDB, Express, React & Node.js.

![TaskFlow Preview](https://img.shields.io/badge/Stack-MERN-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🚀 Features

- **JWT Authentication** — Secure register/login with bcrypt password hashing
- **Project Management** — Create, edit, delete projects with custom color accents
- **Kanban Board** — Drag-and-drop tasks across To Do / In Progress / Done columns
- **Task Management** — Full CRUD with title, description, priority, and assignee
- **Persistent Drag Order** — Task positions saved to MongoDB via REST API
- **Responsive UI** — Dark mode glassmorphism design, works on mobile

## 🛠️ Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | React 18, Vite, React Router  |
| Styling    | Vanilla CSS (dark glassmorphism) |
| HTTP       | Axios with JWT interceptor    |
| Drag & Drop| @hello-pangea/dnd             |
| Backend    | Node.js, Express.js           |
| Database   | MongoDB + Mongoose            |
| Auth       | JWT + bcryptjs                |

## 📁 Project Structure

```
taskflow/
├── server/           # Express REST API
│   ├── models/       # Mongoose schemas (User, Project, Task)
│   ├── routes/       # API routes (auth, projects, tasks)
│   ├── middleware/   # JWT auth middleware
│   └── index.js      # App entry point
└── client/           # React frontend (Vite)
    └── src/
        ├── api/      # Axios instance
        ├── context/  # AuthContext (useReducer)
        ├── pages/    # Login, Register, Dashboard, Board
        └── components/ # Navbar, KanbanBoard, TaskCard, Modals
```

## 🏃 Running Locally

### Prerequisites
- Node.js >= 18
- MongoDB running locally on port 27017 (or MongoDB Atlas URI)

### 1. Start the Backend

```bash
cd server
npm install
# Edit .env and set your MONGO_URI if using Atlas
npm run dev
# ✅ Server runs on http://localhost:5000
```

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev
# ✅ App runs on http://localhost:5173
```

### 3. Open the App

Navigate to **http://localhost:5173**, register an account, and start managing tasks!

## 🔌 API Endpoints

| Method | Route                    | Description              | Auth |
|--------|--------------------------|--------------------------|------|
| POST   | /api/auth/register       | Register new user        | No   |
| POST   | /api/auth/login          | Login & get JWT          | No   |
| GET    | /api/auth/me             | Get current user         | Yes  |
| GET    | /api/projects            | List user's projects     | Yes  |
| POST   | /api/projects            | Create project           | Yes  |
| PUT    | /api/projects/:id        | Update project           | Yes  |
| DELETE | /api/projects/:id        | Delete project + tasks   | Yes  |
| GET    | /api/tasks/:projectId    | Get tasks for project    | Yes  |
| POST   | /api/tasks               | Create task              | Yes  |
| PUT    | /api/tasks/:id           | Update task              | Yes  |
| DELETE | /api/tasks/:id           | Delete task              | Yes  |

## 🌐 Deployment

- **Backend** → [Render](https://render.com) (free tier, set MONGO_URI + JWT_SECRET env vars)
- **Frontend** → [Vercel](https://vercel.com) (free tier, set `VITE_API_URL` env var)

## 💡 Interview Talking Points

1. **JWT Auth flow** — stateless authentication, token stored in localStorage, auto-attached via Axios interceptor
2. **Mongoose schemas** — data validation at the model level, pre-save hooks for bcrypt
3. **Protected routes** — middleware checks token before every private API call
4. **Optimistic UI** — drag-drop updates state immediately, then syncs with API
5. **React Context** — global auth state shared across all components via `useReducer`

---

Built by [Your Name] | [LinkedIn](#) | [Live Demo](#)
