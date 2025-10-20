# Convo Backend API

A real-time chat application backend built with Node.js, Express.js, and Socket.IO.

## Features

- 🔐 JWT Authentication (Register/Login)
- 💬 Real-time messaging with Socket.IO
- 👥 User management
- 🏠 Chat rooms/channels
- 🔍 User search functionality
- 📱 Online/offline status tracking
- ✏️ Message editing and deletion
- 🚀 RESTful API endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv
- **CORS**: cors middleware

## Project Structure

```
backend/
├── src/
│   ├── controllers/          # Route controllers
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js         # Authentication middleware
│   │   └── errorHandler.js # Error handling middleware
│   ├── models/             # Data models (for future database integration)
│   ├── routes/             # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── chat.js        # Chat/messaging routes
│   │   └── user.js        # User management routes
│   ├── utils/              # Utility functions
│   │   └── helpers.js     # Helper functions
│   └── server.js          # Main server file
├── .env                    # Environment variables
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Installation

1. **Clone the repository and navigate to backend folder**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the `.env` file and update the values as needed:

   ```bash
   cp .env.example .env
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   Or for production:

   ```bash
   npm start
   ```

## Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (for future MongoDB integration)
MONGODB_URI=mongodb://localhost:27017/convo

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5177

# Socket.IO Configuration
SOCKET_ORIGINS=http://localhost:5177
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### Users

- `GET /api/users` - Get all users (with search and pagination)
- `GET /api/users/:userId` - Get user profile by ID
- `PUT /api/users/:userId` - Update user profile
- `PATCH /api/users/:userId/status` - Update user online status
- `GET /api/users/:userId/contacts` - Get user's contacts

### Chat

- `GET /api/chat/rooms` - Get all chat rooms
- `POST /api/chat/rooms` - Create a new chat room
- `GET /api/chat/rooms/:roomId/messages` - Get messages for a room
- `POST /api/chat/rooms/:roomId/messages` - Send a message
- `PUT /api/chat/messages/:messageId` - Edit a message
- `DELETE /api/chat/messages/:messageId` - Delete a message

### System

- `GET /` - API information
- `GET /health` - Health check endpoint

## Socket.IO Events

### Client → Server

- `join_room` - Join a chat room
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `user_online` - Set user online status

### Server → Client

- `receive_message` - Receive a new message
- `user_typing` - User is typing
- `user_stopped_typing` - User stopped typing
- `user_status_update` - User status changed

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error type",
  "message": "Human readable error message"
}
```

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

### Testing the API

You can test the API endpoints using tools like:

- **Postman**
- **curl**
- **VS Code REST Client**

Example curl command:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!@#"}'
```

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] File upload support
- [ ] Message reactions
- [ ] User roles and permissions
- [ ] Rate limiting
- [ ] Message encryption
- [ ] Push notifications
- [ ] Voice/video calling
- [ ] Message threading

## License

MIT License
