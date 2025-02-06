const socket = io(); // Connect to WebSocket

const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}

document.getElementById("sendMessageBtn").addEventListener("click", async () => {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    const room = document.getElementById("roomSelect").value;
    const from_user = localStorage.getItem("username");

    if (!message) return;

    await fetch("/chat/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from_user, room, message })
    });

    messageInput.value = "";
});

// Listen for new messages in real-time
socket.on("newMessage", (data) => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML += `<p><strong>${data.from_user}:</strong> ${data.message}</p>`;
});

// Load messages when the room changes
async function loadMessages(room) {
    const response = await fetch(`/chat/messages/${room}`);
    const messages = await response.json();
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = messages.map(msg => `<p><strong>${msg.from_user}:</strong> ${msg.message}</p>`).join("");

    // Join the room using Socket.io
    socket.emit("joinRoom", room);
}

// Change room
document.getElementById("roomSelect").addEventListener("change", () => {
    const room = document.getElementById("roomSelect").value;
    loadMessages(room);
});

// Load messages when page loads
window.onload = () => {
    const room = document.getElementById("roomSelect").value;
    loadMessages(room);
};
