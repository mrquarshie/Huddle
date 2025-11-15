# Production Deployment Guide

This guide covers deploying Huddle Marketplace to production environments.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or MongoDB server
- Domain name (optional)
- SSL certificate (recommended)

## Environment Setup

### 1. Environment Variables

Create a `.env` file in the `server` directory with production values:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/huddle

# JWT Secret (Generate a strong secret)
JWT_SECRET=your_super_strong_jwt_secret_here_use_openssl_rand_hex_64

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL
CLIENT_URL=https://yourdomain.com

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
```

### 2. Generate JWT Secret

```bash
# Generate a secure JWT secret
openssl rand -hex 64
```

## Deployment Options

### Option 1: VPS/Cloud Server (Recommended)

#### Using PM2 (Process Manager)

1. **Install PM2 globally**
   ```bash
   npm install -g pm2
   ```

2. **Build the frontend**
   ```bash
   npm run build
   ```

3. **Create PM2 ecosystem file**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'huddle-api',
       script: 'server/index.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 5000
       }
     }]
   };
   ```

4. **Start the application**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

#### Using Docker

1. **Create Dockerfile**
   ```dockerfile
   # Dockerfile
   FROM node:16-alpine

   WORKDIR /app

   # Copy package files
   COPY package*.json ./
   RUN npm ci --only=production

   # Copy server code
   COPY server/ ./server/

   # Build frontend
   COPY huddle-frontend/ ./huddle-frontend/
   RUN cd huddle-frontend && npm ci && npm run build

   # Copy built frontend to server
   RUN cp -r huddle-frontend/build ./server/

   EXPOSE 5000

   CMD ["node", "server/index.js"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - MONGODB_URI=${MONGODB_URI}
         - JWT_SECRET=${JWT_SECRET}
       volumes:
         - ./uploads:/app/uploads
     mongodb:
       image: mongo:5
       volumes:
         - mongodb_data:/data/db
       ports:
         - "27017:27017"

   volumes:
     mongodb_data:
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

### Option 2: Platform as a Service (PaaS)

#### Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

#### Railway

1. **Connect GitHub repository**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on push**

#### DigitalOcean App Platform

1. **Create new app from GitHub**
2. **Configure build settings**
3. **Set environment variables**
4. **Deploy**

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas account**
2. **Create cluster**
3. **Create database user**
4. **Whitelist your server IP**
5. **Get connection string**

### Local MongoDB

1. **Install MongoDB**
2. **Start MongoDB service**
3. **Create database and user**

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use strong, unique secrets
- Rotate secrets regularly

### 2. Database Security
- Use strong passwords
- Enable authentication
- Use SSL/TLS connections
- Regular backups

### 3. Server Security
- Keep dependencies updated
- Use HTTPS
- Configure firewall
- Regular security audits

### 4. File Upload Security
- Validate file types
- Limit file sizes
- Scan for malware
- Store outside web root

## Monitoring and Maintenance

### 1. Logging
```javascript
// Add to server/index.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 2. Health Checks
```javascript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

### 3. Performance Monitoring
- Use tools like New Relic, DataDog, or PM2 monitoring
- Monitor database performance
- Set up alerts for errors

## Backup Strategy

### 1. Database Backups
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/huddle" --out=backup/

# Restore
mongorestore --uri="mongodb://localhost:27017/huddle" backup/huddle/
```

### 2. File Backups
- Regular uploads folder backups
- Use cloud storage for redundancy

## Scaling Considerations

### 1. Horizontal Scaling
- Use load balancers
- Multiple server instances
- Database clustering

### 2. Caching
- Redis for session storage
- CDN for static assets
- Database query caching

### 3. Database Optimization
- Proper indexing
- Query optimization
- Connection pooling

## Troubleshooting

### Common Issues

1. **CORS errors**
   - Check CLIENT_URL environment variable
   - Verify CORS configuration

2. **Database connection issues**
   - Check MONGODB_URI
   - Verify network connectivity
   - Check authentication credentials

3. **File upload issues**
   - Check upload directory permissions
   - Verify file size limits
   - Check disk space

4. **Memory issues**
   - Monitor memory usage
   - Implement proper garbage collection
   - Use PM2 cluster mode

### Logs and Debugging

```bash
# PM2 logs
pm2 logs

# Docker logs
docker-compose logs -f

# System logs
tail -f /var/log/syslog
```

## Performance Optimization

### 1. Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images

### 2. Backend
- Use compression middleware
- Implement caching
- Optimize database queries
- Use connection pooling

### 3. Database
- Create proper indexes
- Use aggregation pipelines
- Implement pagination
- Regular maintenance

## Maintenance Schedule

### Daily
- Monitor error logs
- Check system resources
- Verify backups

### Weekly
- Update dependencies
- Review security logs
- Performance analysis

### Monthly
- Security audit
- Database optimization
- Backup testing
- Disaster recovery testing
