import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import database connection
import connectDB from "./utils/database.js";

// Import routes
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/user.js";
import uploadRoutes from "./routes/upload.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { authenticate } from "./middleware/auth.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow any localhost origin
      if (!origin || origin.startsWith("http://localhost:")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any localhost origin
      if (!origin || origin.startsWith("http://localhost:")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io instance available to routes via app.locals
app.set("io", io);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Convo Chat API Server",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", authenticate, chatRoutes);
app.use("/api/users", authenticate, userRoutes);
app.use("/api/upload", authenticate, uploadRoutes);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Store user ID when they connect
  socket.on("user-connected", (userId) => {
    socket.userId = userId;
    socket.join(`user_${userId}`);

    // Broadcast to all clients that this user is online
    socket.broadcast.emit("user-status-changed", {
      userId: userId,
      isOnline: true,
    });
  });

  // Join a room (for private messaging)
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    // Broadcast message to room
    socket.to(data.roomId).emit("receive_message", data);
    console.log("Message sent:", data);
  });

  // Handle typing indicators
  socket.on("typing_start", (data) => {
    socket.to(data.roomId).emit("user_typing", {
      userId: data.userId,
      username: data.username,
    });
  });

  socket.on("typing_stop", (data) => {
    socket.to(data.roomId).emit("user_stopped_typing", {
      userId: data.userId,
    });
  });

  // Handle user status updates
  socket.on("user_online", (userId) => {
    socket.broadcast.emit("user_status_update", {
      userId,
      isOnline: true,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Broadcast to all clients that this user is offline
    if (socket.userId) {
      socket.broadcast.emit("user-status-changed", {
        userId: socket.userId,
        isOnline: false,
      });
    }
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Convo server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
  console.log(`📡 Socket.IO server ready for connections`);
});

export default app;
