// Connect to the Socket.io server
const socket = io();

// Send message function
document.getElementById('sendMessage').addEventListener('click', () => {
    const message = document.getElementById('messageInput').value;
    socket.emit('sendMessage', message);  // Socket.io event to send the message
});

// Typing indicator
document.getElementById('messageInput').addEventListener('input', () => {
    socket.emit('typing');
});

// Listen for typing event and display typing indicator
socket.on('typing', () => {
    document.getElementById('typing-indicator').innerText = 'User is typing...';
});

socket.on('stopTyping', () => {
    document.getElementById('typing-indicator').innerText = '';
});
