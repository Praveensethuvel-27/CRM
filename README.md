# CRM Portal SaaS

A modern SaaS CRM application built with **React + Tailwind CSS (Clean Light UI Theme)** and **Node.js (Express) + MongoDB Atlas (Mongoose)**.

---

## 🚀 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS (Modern Light SaaS Theme), Axios, React Router DOM v6
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), BcryptJS
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Architecture:** RESTful API Architecture with Role-Based Access Control (Admin, Manager, Employee)

---

## 📁 Project Structure

```text
crm_portal/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MongoDB Atlas Mongoose connection
│   │   ├── middleware/auth.js    # JWT & RBAC Middleware
│   │   ├── models/               # Mongoose Models (User, Customer, Lead, Deal, Task, etc.)
│   │   ├── routes/               # Express API routes (Auth, Dashboard, Leads, Deals, etc.)
│   │   ├── scripts/seed.js       # MongoDB Atlas database seeder
│   │   └── server.js             # Express application entry point
│   ├── .env                      # Environment variables (MongoDB Atlas URI, JWT Secret)
│   ├── .env.example              # Sample environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Light UI Layouts & Guards
│   │   ├── hooks/useAuth.jsx     # Auth state management
│   │   ├── pages/                # Light Theme CRM pages (Dashboard, Leads, Customers, etc.)
│   │   └── services/api.js       # Axios client configured for Node.js API (Port 5000)
│   └── package.json
└── README.md
```

---

## ⚙️ Quick Setup

### 1. Backend (Node.js & MongoDB Atlas)

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   npm install
   ```

2. Configure your MongoDB Atlas connection string in `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/crm_portal?retryWrites=true&w=majority
   JWT_SECRET=supersecretjwtkey_crm_portal_2026_secured
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

3. (Optional) Seed initial demo data into MongoDB Atlas:
   ```bash
   npm run seed
   ```

4. Start the Node.js server:
   ```bash
   npm run dev    # with nodemon auto-reload
   # or
   npm start
   ```
   Backend will run at `http://localhost:5000`.

---

### 2. Frontend (React Light UI)

1. Open a terminal in `frontend/`:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🔑 Default Seed Credentials

After running `npm run seed`:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@crm.local` | `Admin123!` |
| **Manager** | `manager@crm.local` | `Manager123!` |
| **Employee** | `employee@crm.local` | `Employee123!` |

*(One-click demo buttons are also provided directly on the Login page).*
