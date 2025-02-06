const express = require('express');
const { GroupMessage } = require('../models/groupMessage'); // Ensure correct path
const router = express.Router();

module.exports = (io) => {
    // Send message in a room
    router.post('/sendMessage', async (req, res) => {
        const { from_user, room, message } = req.body;
        try {
            const newMessage = new GroupMessage({ from_user, room, message });
            await newMessage.save();

            // Emit message to all users in the room
            io.to(room).emit("newMessage", { from_user, message });

            res.status(200).send("Message sent");
        } catch (err) {
            res.status(500).send("Error sending message");
        }
    });

    // Fetch messages for a room
    router.get('/messages/:room', async (req, res) => {
        const { room } = req.params;
        try {
            const messages = await GroupMessage.find({ room }).sort({ date_sent: 1 });
            res.json(messages);
        } catch (err) {
            res.status(500).send("Error fetching messages");
        }
    });

    return router;
};
