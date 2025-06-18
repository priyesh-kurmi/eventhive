import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });
  }
  
  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Helper to create a unique channel name for events
export function getEventChannelName(eventId: string) {
  return `event-chat:${eventId}`;
}

// Helper to create a unique channel name for direct messages
export function getDirectMessageChannelName(user1Id: string, user2Id: string) {
  // Sort IDs to ensure the same channel name regardless of who initiates
  const sortedIds = [user1Id, user2Id].sort();
  return `direct-chat:${sortedIds[0]}:${sortedIds[1]}`;
}

// Message format for event chat
export interface ChatMessage {
  id: string;
  eventId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  avatar?: string;
}

// Message format for direct messages
export interface DirectChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  content: string;
  timestamp: number;
  avatar?: string;
  read: boolean;
}

// Chat metadata for listing active chats
export interface ChatMetadata {
  userId: string;
  userName: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
}
