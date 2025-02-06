// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const http = require('http');
const User = require('./models/user'); // Import User model

// Load environment variables from .env file
dotenv.config();

// Create an Express app and a HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB Connection (using the URI from .env)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.log('Error connecting to MongoDB:', err);
});

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
// Sign up route
app.post('/api/auth/signup', (req, res) => {
    const { username, firstname, lastname, password } = req.body;

    // Create a new user instance
    const newUser = new User({
        username,
        firstname,
        lastname,
        password,
    });

    // Save the new user to MongoDB
    newUser.save()
        .then(() => res.status(201).send('User created successfully'))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Handle receiving and sending chat messages
    socket.on('sendMessage', (messageData) => {
        console.log('Message received:', messageData);
        
        // Emit the message to all users in the room
        io.to(messageData.room).emit('receiveMessage', messageData);

        // Optionally, store the message in MongoDB (to be added later)
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server on the specified port (from .env or default to 5000)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
