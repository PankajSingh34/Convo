# Convo - Real-time Chat Application 💬

A modern, full-stack chat application built with React, Node.js, and MongoDB. Features real-time messaging, user authentication, and an intuitive emoji picker.

## 🌟 Features

- **Real-time Messaging**: Send and receive messages instantly
- **User Authentication**: Secure login and registration system
- **Emoji Support**: Comprehensive emoji picker with 6 categories
- **Modern UI**: Dark theme with responsive design
- **MongoDB Integration**: Persistent data storage
- **RESTful API**: Well-structured backend with Express.js

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time communication (ready for implementation)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/convo.git
   cd convo
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/convo
   JWT_SECRET=your-super-secret-jwt-key
   ```

5. **Seed the Database (Optional)**
   ```bash
   cd backend
   # First start the server, then in another terminal:
   curl -X POST http://localhost:3001/api/seed/users
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   node src/server.js
   ```
   Server will run on http://localhost:3001

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173 (or next available port)

## 📁 Project Structure

```
convo/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Auth.jsx     # Authentication wrapper
│   │   │   ├── ChatArea.jsx # Main chat interface
│   │   │   ├── EmojiPicker.jsx # Emoji selection component
│   │   │   ├── Login.jsx    # Login form
│   │   │   ├── Signup.jsx   # Registration form
│   │   │   ├── Sidebar.jsx  # Chat contacts sidebar
│   │   │   └── MessageBubble.jsx # Individual message display
│   │   ├── services/        # API service layer
│   │   │   └── api.js       # HTTP client and API calls
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── backend/                  # Node.js backend application
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── User.js      # User model
│   │   │   ├── Message.js   # Message model
│   │   │   └── Conversation.js # Conversation model
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.js      # Authentication routes
│   │   │   ├── chat.js      # Chat/messaging routes
│   │   │   ├── user.js      # User management routes
│   │   │   └── seed.js      # Database seeding routes
│   │   ├── middleware/      # Express middleware
│   │   │   └── auth.js      # JWT authentication middleware
│   │   ├── utils/           # Utility functions
│   │   │   └── db.js        # Database connection
│   │   └── server.js        # Express server setup
│   └── package.json         # Backend dependencies
├── .gitignore               # Git ignore rules
└── README.md               # Project documentation
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- **Registration**: Create new user accounts with username, email, and password
- **Login**: Authenticate with email and password
- **Protected Routes**: API endpoints are protected with JWT middleware
- **Token Storage**: JWT tokens are stored in localStorage

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Chat
- `GET /api/chat/messages/:conversationId` - Get conversation messages
- `POST /api/chat/send` - Send new message

### Users
- `GET /api/users` - Get all users (for contacts)

### Seeding
- `POST /api/seed/users` - Seed database with sample users

## 🎨 UI Features

- **Dark Theme**: Modern dark color scheme
- **Responsive Design**: Works on desktop and mobile
- **Emoji Picker**: 200+ emojis organized in 6 categories
- **Real-time Updates**: Messages appear instantly
- **Loading States**: Visual feedback for async operations
- **Error Handling**: User-friendly error messages

## 🔮 Future Enhancements

- [ ] Real-time WebSocket implementation
- [ ] File sharing and image uploads
- [ ] Group chat functionality
- [ ] Message reactions and replies
- [ ] User presence indicators
- [ ] Push notifications
- [ ] Message search functionality
- [ ] Voice messages
- [ ] Video calling integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- UI framework by [Tailwind CSS](https://tailwindcss.com/)
- Emojis from the Unicode Emoji specification

## 📧 Contact

Your Name - [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/yourusername/convo](https://github.com/yourusername/convo)