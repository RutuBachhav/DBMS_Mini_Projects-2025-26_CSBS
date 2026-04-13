# Docker Setup Guide for MongoDB

## Prerequisites

1. **Install Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop
   - Verify installation: 
   ```powershell
   docker --version
   docker-compose --version
   ```

## 🚀 Quick Start

### Step 1: Navigate to Project Root
```powershell
cd C:\Users\harsh\vedantproject
```

### Step 2: Start MongoDB Container
```powershell
docker-compose up -d
```

This will:
- ✅ Download MongoDB image
- ✅ Create and start MongoDB container
- ✅ Create persistent volumes for data
- ✅ Run in the background

**Expected output:**
```
[+] Running 3/3
 ✔ Network ecommerce_network Created
 ✔ Volume "mongodb_data" Created
 ✔ Container ecommerce_mongodb Started
```

### Step 3: Verify MongoDB is Running
```powershell
docker ps
```

You should see `ecommerce_mongodb` running.

### Step 4: Start Backend
```powershell
cd ecommerce-backend
npm run dev
```

You should now see:
- ✅ MongoDB Connected: localhost
- ✅ Server running on port 5000

---

## 📊 Docker Commands

### View Logs
```powershell
docker logs ecommerce_mongodb
```

### Stop MongoDB
```powershell
docker-compose down
```

### Stop MongoDB but Keep Data
```powershell
docker-compose stop
```

### Resume MongoDB
```powershell
docker-compose start
```

### Remove Everything (Warning: Deletes Data)
```powershell
docker-compose down -v
```

### Connect to MongoDB in Container
```powershell
docker exec -it ecommerce_mongodb mongosh -u admin -p password123
```

---

## 🔧 Configuration

### Default Credentials
- **Username**: admin
- **Password**: password123
- **Database**: ecommerce
- **Port**: 27017

### Update Connection String

If you change the credentials in `docker-compose.yml`, update `.env`:

```env
MONGODB_URI=mongodb://username:password@localhost:27017/ecommerce?authSource=admin
```

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# See what's using port 27017
netstat -ano | findstr :27017

# Stop Docker container
docker-compose down
```

### Docker Not Starting
- Make sure Docker Desktop is running
- Try: `docker-compose down` then `docker-compose up -d`

### Connection Refused
```powershell
# Check if container is running
docker ps

# If not running, start it
docker-compose up -d

# Check logs
docker logs ecommerce_mongodb
```

### Data Persistence
- All data is saved in `mongodb_data` volume
- Data persists even after stopping container
- Use `docker-compose down -v` to remove volumes

---

## 🎯 Complete Workflow

### Terminal 1: Start MongoDB
```powershell
cd C:\Users\harsh\vedantproject
docker-compose up -d
```

### Terminal 2: Start Backend
```powershell
cd C:\Users\harsh\vedantproject\ecommerce-backend
npm run dev
```

### Terminal 3: Start Frontend
```powershell
cd C:\Users\harsh\vedantproject\ecommerce-frontend
npm start
```

---

## ✅ Verification

### Check MongoDB is Connected
```powershell
# In backend terminal, look for:
MongoDB Connected: localhost
Server running on port 5000
```

### Test API
```powershell
# In a new terminal:
curl http://localhost:5000/api/health

# Expected response:
{"message":"Server is running"}
```

---

## 📚 Additional Resources

- Docker Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- MongoDB Docker: https://hub.docker.com/_/mongo

---

**MongoDB is now running in Docker! 🐳**
