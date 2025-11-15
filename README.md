# Huddle Marketplace

A student marketplace webapp for Ghana universities where students can buy and sell items within their university communities.

## Features

- **User Authentication**: Register and login as buyer or seller
- **Item Management**: Sellers can add, edit, and delete items
- **Search & Filter**: Search items by title, description, university, category, and price
- **Image Upload**: Multiple image support for items
- **University-based**: Items are organized by university
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Express Validator for input validation

### Frontend
- React 19
- React Router for navigation
- Axios for API calls
- Context API for state management
- CSS3 for styling

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Huddle
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd huddle-frontend
   npm install
   cd ..
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/huddle
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run separately:
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Items
- `GET /api/items` - Get all items (with search/filter)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (sellers only)
- `PUT /api/items/:id` - Update item (seller only)
- `DELETE /api/items/:id` - Delete item (seller only)
- `GET /api/items/seller/my-items` - Get seller's items

### Universities
- `GET /api/universities` - Get all universities

## Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   CLIENT_URL=your_production_frontend_url
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## Project Structure

```
Huddle/
├── server/                 # Backend API
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js          # Server entry point
├── huddle-frontend/   # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── App.js         # Main app component
│   └── public/            # Static assets
├── uploads/               # File uploads
└── package.json          # Root package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
