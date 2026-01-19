const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config(); // Load from server .env

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite default port
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware to attach io to req for real-time events
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/funds', require('./routes/funds'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/actions', require('./routes/actions'));
app.use('/api/students/requests', require('./routes/students'));
app.use('/api/startups', require('./routes/startups'));
app.use('/api/ideas', require('./routes/ideas'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/pitch', require('./routes/pitch'));
app.use('/api/investor', require('./routes/investor'));
app.use('/api/blockchain', require('./routes/blockchain'));
app.use('/api/calls', require('./routes/calls'));

// Socket.io with extended real-time events
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Map to store userId -> socketId
    socket.on('register', (userId) => {
        socket.join(userId); // User joins a room with their own ID
        console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        // Notify others in the room that a user has joined
        socket.to(roomId).emit('user_joined', { userId: socket.id });
    });

    socket.on('send_message', (data) => {
        io.to(data.roomId).emit('receive_message', data);
    });

    socket.on('signal', (data) => {
        socket.to(data.roomId).emit('signal', data);
    });

    // Call Signaling
    socket.on('call_invite', (data) => {
        const { toUserId, roomId, callerInfo } = data;
        console.log(`Call invite from ${callerInfo.name} to ${toUserId}`);
        io.to(toUserId).emit('incoming_call', { roomId, callerInfo });
    });

    socket.on('call_accepted', (data) => {
        const { toUserId, roomId } = data;
        console.log(`Call accepted by ${data.accepterId}`);
        io.to(toUserId).emit('call_accepted', { roomId });
    });

    socket.on('call_rejected', (data) => {
        const { toUserId } = data;
        console.log(`Call rejected`);
        io.to(toUserId).emit('call_rejected');
    });

    // Real-time event listeners for new posts
    socket.on('new_idea_posted', (data) => {
        io.emit('idea_posted', data);
        console.log('New idea posted:', data);
    });

    socket.on('startup_updated', (data) => {
        io.emit('startup_update', data);
        console.log('Startup updated:', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
