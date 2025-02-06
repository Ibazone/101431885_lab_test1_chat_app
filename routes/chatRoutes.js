const express = require('express');
const { GroupMessage, PrivateMessage } = require('../models/Message');
const router = express.Router();

// Route for sending messages in a room
router.post('/sendMessage', async (req, res) => {
    const { from_user, room, message } = req.body;

    try {
        const newMessage = new GroupMessage({ from_user, room, message });
        await newMessage.save();
        res.status(200).send('Message sent');
    } catch (err) {
        res.status(500).send('Error sending message');
    }
});

module.exports = router;
