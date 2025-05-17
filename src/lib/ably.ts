import * as Ably from 'ably';

export function getAblyClient() {
  const client = new Ably.Realtime({
    authUrl: '/api/ably-token',
    authMethod: 'POST'
  });
  return client;
}

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

// Message format for chat
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
  username: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
}