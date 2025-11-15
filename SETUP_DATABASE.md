# Database Setup Guide

The "server error" during registration is likely because MongoDB is not installed or running on your system.

## Quick Fix Options:

### Option 1: Install MongoDB Locally (Recommended)

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download the Windows version
   - Install with default settings

2. **Start MongoDB Service:**
   ```bash
   # Open Command Prompt as Administrator
   net start MongoDB
   ```

3. **Verify MongoDB is running:**
   ```bash
   mongo --version
   ```

### Option 2: Use MongoDB Atlas (Cloud Database)

1. **Create free MongoDB Atlas account:**
   - Go to: https://www.mongodb.com/atlas
   - Sign up for free account
   - Create a new cluster (free tier available)

2. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update server configuration:**
   - Create `server/.env` file with:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/huddle
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

### Option 3: Use Docker (If you have Docker installed)

1. **Run MongoDB with Docker:**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## Test Database Connection:

After setting up MongoDB, restart the server:

```bash
cd server
node index.js
```

You should see: "MongoDB connected successfully"

## Troubleshooting:

### If you see "MongoDB connection error":
1. Make sure MongoDB is running
2. Check if port 27017 is available
3. Try restarting MongoDB service

### If you see "Database connection failed":
1. Check your MongoDB connection string
2. Ensure MongoDB is accessible
3. Verify network connectivity

## Quick Test:

Once MongoDB is running, try registering again. The error should be resolved.

## Alternative: Use In-Memory Database (For Testing)

If you want to test without MongoDB, I can modify the code to use an in-memory database for development purposes.
