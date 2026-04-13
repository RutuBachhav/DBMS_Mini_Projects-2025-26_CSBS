# StockUp - Inventory Management System

A full-stack inventory management system built with Node.js, Express, React, and MySQL.

## Project Structure

- `backend/`: Node.js + Express API
- `frontend/`: React + Vite + Tailwind CSS UI
- `database/`: SQL schema files

---

## 🚀 Quick Start (Recommended)

Run the entire application (backend + frontend) with a **single command**:

### Step 1 — Install all dependencies (first time only)

```bash
# Root dependencies (concurrently, wait-on)
npm install

# Backend dependencies
cd backend && npm install && cd ..

# Frontend dependencies
cd frontend && npm install && cd ..
```

### Step 2 — Configure the Database

1. Import `database/schema.sql` into your MySQL server.
2. Create a `.env` file inside `backend/` with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=stockup
JWT_SECRET=your_jwt_secret
```

### Step 3 — Launch Everything

```bash
npm run start-all
```

This single command will:
- 🟣 **BACKEND** — Start the Express API on `http://localhost:5000` (with nodemon auto-restart on file changes)
- 🔵 **FRONTEND** — Start the Vite dev server on `http://localhost:5173` (waits for backend to be ready first)

Then open your browser at: **http://localhost:5173**

---

## Manual Setup Instructions

### Backend (standalone)
```bash
cd backend
npm install
npm run dev
```

### Frontend (standalone)
```bash
cd frontend
npm install
npm run dev
```

---

## Technologies Used

| Layer       | Tech Stack                                          |
|-------------|-----------------------------------------------------|
| Frontend    | React, Vite, Tailwind CSS, React Router, Axios      |
| Backend     | Node.js, Express, MySQL2, CORS, Dotenv, Bcrypt, JWT |
| Dev Tools   | Nodemon, Concurrently, Wait-on                      |

---

## Security & Data Isolation

StockUp implements strict **user-based data isolation**:
- Every data record (Products, Categories, Suppliers, Transactions) contains a `user_id` field.
- All API endpoints are protected by `authMiddleware` which extracts the `user_id` from the JWT.
- Database queries use `WHERE user_id = ?` to ensure users only access their own data.
- User sessions are managed via JWTs with a 1-hour expiry.
