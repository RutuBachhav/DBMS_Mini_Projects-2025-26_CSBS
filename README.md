<<<<<<< HEAD
# BookNest — Smart Library Management System

## Local Development

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Seed admin user (one-time)
cd server && npm run seed
# Admin: admin@booknest.com / admin123

# 3. Start backend
cd server && npm run dev    # → http://localhost:5000

# 4. Start frontend
cd client && npm run dev    # → http://localhost:5173
```

## Vercel Deployment

This project is split into **two separate Vercel deployments**:

### 1. Deploy Backend (`server/`)

1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your repo, set **Root Directory** to `server`
4. Vercel auto-detects the `vercel.json` config
5. Add these **Environment Variables** in Vercel dashboard:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://tanishkaphalke08_db_user:h4pv2q9XyaWeYvL1@cluster0.mckdqhv.mongodb.net/booknest?appName=Cluster0` |
| `JWT_SECRET` | `booknest_jwt_secret_2024_xK9mP3nQ7wL` |

6. Deploy → note the URL (e.g. `https://booknest-server.vercel.app`)

### 2. Deploy Frontend (`client/`)

1. Go to Vercel → **Add New Project**
2. Import same repo, set **Root Directory** to `client`
3. Framework Preset: **Vite**
4. Add this **Environment Variable**:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend-url.vercel.app/api` |

5. Deploy

### Important Notes

- Set `VITE_API_URL` to your **actual deployed backend URL** + `/api`
- The backend must be deployed first so you have the URL
- Environment variables with `VITE_` prefix are baked into the frontend at build time
=======

>>>>>>> e468c4c52fc192dd755e03353b61b7c9aff6a9b6
