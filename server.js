// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io'); // Corrected import for Socket.io
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { GroupMessage } = require('./models/groupMessage'); // Import message model

dotenv.config(); // Load environment variables

// Initialize Express and create an HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } }); // Allow CORS for WebSocket

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Use routes
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes(io)); // Pass `io` to chat routes

// WebSocket connection handling
io.on("connection", (socket) => {
    console.log("A user connected");

    // Join a specific chat room
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    // Handle receiving and sending chat messages
    socket.on("sendMessage", async (messageData) => {
        console.log("Message received:", messageData);

        const { from_user, room, message } = messageData;

        // Store message in MongoDB
        const newMessage = new GroupMessage({ from_user, room, message });
        await newMessage.save();

        // Emit the message to users in the same room
        io.to(room).emit("receiveMessage", messageData);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
