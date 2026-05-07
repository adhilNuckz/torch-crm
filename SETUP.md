# Setup Instructions

## Prerequisites
- **Node.js** v20+
- **MongoDB** v7.0+ (local or Atlas)
- **npm** or **yarn**

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/adhilNuckz/torch-crm.git
cd crm-app
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```

### 3. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env
```

### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Or on Linux/Ubuntu
sudo systemctl start mongod
sudo systemctl status mongod

# Verify connection
mongosh --eval "db.runCommand({ ping: 1 })"
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)
4. Update `MONGO_URI` in `server/.env`

### 5. Environment Variables

**Backend (`server/.env`)**:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
GEMINI_API_KEY=your_api_key_here
```

**Frontend (`client/.env`)**:
```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Seed Database
```bash
cd server
npm run seed
```

This creates:
- Default admin user
- Sample leads
- Sample campaigns

### 7. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### 8. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Production Deployment

See `DEPLOYMENT.md` for Apache + PM2 setup on DigitalOcean/VPS.

## Troubleshooting

**MongoDB Connection Error**:
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Restart if needed
sudo systemctl restart mongod
```

**Port Already in Use**:
```bash
# Backend uses 5000, Frontend uses 5173
# Change in server/.env (PORT) or client/vite.config.js if needed
```

**Module Not Found**:
```bash
cd server && npm install
cd ../client && npm install
```

**CORS Errors**:
- Ensure `CLIENT_URL` in `server/.env` matches your frontend URL
- For local dev: should be `http://localhost:5173`
