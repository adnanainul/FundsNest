const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite default port
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.use(cors());
app.use(express.json());

// In-memory storage
const users = [];
const funds = [];
const portfolios = [];
const messages = [];

// Helper to generate IDs
let userId = 1;
let fundId = 1;
let messageId = 1;

// Auth Routes
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        let user = users.find(u => u.email === email);

        if (!user) {
            // Auto-create user for demo
            user = {
                _id: userId++,
                email,
                password,
                name: email.split('@')[0],
                type: 'student',
                avatar: null
            };
            users.push(user);
        } else if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = 'demo_token_' + user._id;
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/signup', (req, res) => {
    try {
        const { email, password, type } = req.body;
        let user = users.find(u => u.email === email);
        if (user) return res.status(400).json({ error: 'User already exists' });

        user = {
            _id: userId++,
            email,
            password,
            type: type || 'student',
            name: email.split('@')[0],
            avatar: null
        };
        users.push(user);

        const token = 'demo_token_' + user._id;
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Funds Routes
app.get('/api/funds', (req, res) => {
    res.json(funds);
});

app.post('/api/funds', (req, res) => {
    try {
        const fund = {
            _id: fundId++,
            ...req.body,
            createdAt: new Date(),
            raisedAmount: 0,
            investors: []
        };
        funds.push(fund);
        res.json(fund);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/funds/:id', (req, res) => {
    const fund = funds.find(f => f._id == req.params.id);
    if (!fund) return res.status(404).json({ error: 'Fund not found' });
    res.json(fund);
});

app.put('/api/funds/:id', (req, res) => {
    const index = funds.findIndex(f => f._id == req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Fund not found' });

    funds[index] = { ...funds[index], ...req.body };
    res.json(funds[index]);
});

app.delete('/api/funds/:id', (req, res) => {
    const index = funds.findIndex(f => f._id == req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Fund not found' });

    funds.splice(index, 1);
    res.json({ message: 'Fund deleted' });
});

// Portfolio Routes
app.get('/api/portfolio', (req, res) => {
    res.json(portfolios);
});

app.post('/api/portfolio', (req, res) => {
    try {
        const { userId, fundId: fId, amount } = req.body;

        // Update fund
        const fund = funds.find(f => f._id == fId);
        if (fund) {
            fund.raisedAmount = (fund.raisedAmount || 0) + amount;
            if (!fund.investors) fund.investors = [];
            fund.investors.push(userId);
        }

        // Add to portfolio
        const portfolio = {
            userId,
            fundId: fId,
            amount,
            date: new Date()
        };
        portfolios.push(portfolio);

        res.json(portfolio);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Messages Routes
app.get('/api/messages/:roomId', (req, res) => {
    const roomMessages = messages.filter(m => m.roomId === req.params.roomId);
    res.json(roomMessages);
});

app.post('/api/messages', (req, res) => {
    try {
        const message = {
            _id: messageId++,
            ...req.body,
            timestamp: new Date()
        };
        messages.push(message);
        res.json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Socket.io
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('send_message', (data) => {
        io.to(data.roomId).emit('receive_message', data);
    });

    socket.on('signal', (data) => {
        socket.to(data.roomId).emit('signal', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (in-memory mode)`);
});
