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