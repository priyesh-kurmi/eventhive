const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join event chat room
  socket.on('join-event-chat', (eventId) => {
    const roomName = `event-chat:${eventId}`;
    socket.join(roomName);
    console.log(`User ${socket.id} joined event chat: ${eventId}`);
  });

  // Leave event chat room
  socket.on('leave-event-chat', (eventId) => {
    const roomName = `event-chat:${eventId}`;
    socket.leave(roomName);
    console.log(`User ${socket.id} left event chat: ${eventId}`);
  });

  // Join direct message room
  socket.on('join-direct-chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined direct chat: ${chatId}`);
  });

  // Leave direct message room
  socket.on('leave-direct-chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left direct chat: ${chatId}`);
  });

  // Handle event messages
  socket.on('send-event-message', (data) => {
    const roomName = `event-chat:${data.eventId}`;
    socket.to(roomName).emit('new-event-message', data);
    console.log(`Message sent to event ${data.eventId}:`, data.content);
  });

  // Handle direct messages
  socket.on('send-direct-message', (data) => {
    socket.to(data.chatId).emit('new-direct-message', data);
    console.log(`Direct message sent to ${data.chatId}:`, data.content);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
