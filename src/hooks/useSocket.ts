"use client";

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { initSocket, getSocket } from '@/lib/socket';
import type { Socket } from 'socket.io-client';

type MessageCallback = (message: any) => void;

export function useSocket() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    try {
      const socketInstance = initSocket();
      setSocket(socketInstance);

      const handleConnect = () => {
        setIsConnected(true);
        setError(null);
      };

      const handleDisconnect = () => {
        setIsConnected(false);
      };

      const handleError = (error: Error) => {
        setError(error);
      };

      socketInstance.on('connect', handleConnect);
      socketInstance.on('disconnect', handleDisconnect);
      socketInstance.on('connect_error', handleError);

      // Set initial connection state
      setIsConnected(socketInstance.connected);

      return () => {
        socketInstance.off('connect', handleConnect);
        socketInstance.off('disconnect', handleDisconnect);
        socketInstance.off('connect_error', handleError);
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [session?.user]);

  return { socket, isConnected, error };
}

export function useEventChat(eventId: string, onMessage?: MessageCallback) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !eventId) return;

    // Join the event chat room
    socket.emit('join-event-chat', eventId);

    // Listen for new messages
    if (onMessage) {
      socket.on('new-event-message', onMessage);
    }

    return () => {
      // Leave the room and remove listeners
      socket.emit('leave-event-chat', eventId);
      if (onMessage) {
        socket.off('new-event-message', onMessage);
      }
    };
  }, [socket, eventId, onMessage]);

  const sendMessage = useCallback((message: any) => {
    if (socket && socket.connected) {
      socket.emit('send-event-message', { ...message, eventId });
      return true;
    }
    return false;
  }, [socket, eventId]);

  return { sendMessage };
}

export function useDirectChat(chatId: string, onMessage?: MessageCallback) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !chatId) return;

    // Join the direct chat room
    socket.emit('join-direct-chat', chatId);

    // Listen for new messages
    if (onMessage) {
      socket.on('new-direct-message', onMessage);
    }

    return () => {
      // Leave the room and remove listeners
      socket.emit('leave-direct-chat', chatId);
      if (onMessage) {
        socket.off('new-direct-message', onMessage);
      }
    };
  }, [socket, chatId, onMessage]);

  const sendMessage = useCallback((message: any) => {
    if (socket && socket.connected) {
      socket.emit('send-direct-message', { ...message, chatId });
      return true;
    }
    return false;
  }, [socket, chatId]);

  return { sendMessage };
}
