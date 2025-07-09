const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todoboard')
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('🌍 Database:', mongoose.connection.name);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('🔍 Please check your MongoDB connection string');
  console.log('💡 Make sure MongoDB Atlas cluster is accessible or use local MongoDB');
});

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const activityRoutes = require('./routes/activity');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activity', activityRoutes);

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room (board)
  socket.on('join-board', (userId) => {
    socket.join('board-room');
    console.log(`User ${userId} joined board room`);
  });

  // Handle task updates
  socket.on('task-updated', (data) => {
    socket.to('board-room').emit('task-updated', data);
  });

  // Handle new tasks
  socket.on('task-created', (data) => {
    socket.to('board-room').emit('task-created', data);
  });

  // Handle task deletion
  socket.on('task-deleted', (data) => {
    socket.to('board-room').emit('task-deleted', data);
  });

  // Handle activity updates
  socket.on('activity-logged', (data) => {
    socket.to('board-room').emit('activity-logged', data);
  });

  // Handle conflict detection
  socket.on('task-editing', (data) => {
    socket.to('board-room').emit('task-editing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };