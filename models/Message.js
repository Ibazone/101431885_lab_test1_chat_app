const mongoose = require('mongoose');

// Group Message Schema
const groupMessageSchema = new mongoose.Schema({
    from_user: String,
    room: String,
    message: String,
    date_sent: {
        type: Date,
        default: Date.now
    }
});

// Private Message Schema
const privateMessageSchema = new mongoose.Schema({
    from_user: String,
    to_user: String,
    message: String,
    date_sent: {
        type: Date,
        default: Date.now
    }
});

const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);
const PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);

module.exports = { GroupMessage, PrivateMessage };
