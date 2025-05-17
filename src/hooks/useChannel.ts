"use client";

import { useEffect, useState, useCallback } from 'react';
import * as Ably from 'ably';
import { useSession } from 'next-auth/react';

// Create a singleton Ably client
let globalAblyClient: Ably.Realtime | null = null;

const getAblyClient = async (): Promise<Ably.Realtime> => {
  if (globalAblyClient) return globalAblyClient;
  
  try {
    // Get token from your API
    const response = await fetch('/api/ably-token');
    if (!response.ok) throw new Error('Failed to get Ably token');
    const tokenData = await response.json();
    
    // Create new Ably Realtime client with correct auth options
    globalAblyClient = new Ably.Realtime({
      authCallback: (tokenParams, callback) => {
        // Return the token we already have
        callback(null, tokenData);
      }
    });
    
    return globalAblyClient;
  } catch (error) {
    console.error('Ably initialization error:', error);
    throw error;
  }
};

// Use the correct message type from Ably
type Message = Ably.Message;
type MessageCallback = (message: Message) => void;

export function useChannel(
  channelName: string,
  callbackOnMessage?: MessageCallback
) {
  const { data: session } = useSession();
  const [channel, setChannel] = useState<Ably.RealtimeChannel | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Set up the channel subscription
  useEffect(() => {
    if (!channelName || !session?.user) return;

    let ablyClient: Ably.Realtime | null = null;
    let channelInstance: Ably.RealtimeChannel | null = null;
    
    const setup = async () => {
      try {
        // Get or initialize Ably client
        ablyClient = await getAblyClient();
        
        // Get channel
        channelInstance = ablyClient.channels.get(channelName);
        setChannel(channelInstance);
        
        // Subscribe to new messages
        if (callbackOnMessage) {
          console.log(`Subscribing to channel: ${channelName}`);
          channelInstance.subscribe('new-message', callbackOnMessage);
        }
      } catch (err) {
        console.error(`Error setting up Ably channel ${channelName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };
    
    setup();
    
    // Cleanup function
    return () => {
      if (channelInstance && callbackOnMessage) {
        console.log(`Unsubscribing from channel: ${channelName}`);
        channelInstance.unsubscribe('new-message', callbackOnMessage);
      }
      
      // Note: We don't close the Ably client since it's shared
    };
  }, [channelName, callbackOnMessage, session?.user]);

  // Function to publish messages to the channel
  const publish = useCallback(
    async (message: any) => {
      if (!channel) {
        console.error('Cannot publish - channel not initialized');
        return;
      }
      
      try {
        await channel.publish('new-message', message);
        return true;
      } catch (err) {
        console.error('Error publishing message:', err);
        return false;
      }
    },
    [channel]
  );

  return { channel, publish, error };
}