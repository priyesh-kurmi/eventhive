"use client";

import { useState, useEffect, useCallback } from "react";
import * as Ably from "ably";
import { useAbly } from "@/components/providers/AblyProvider";
import { useSession } from "next-auth/react";

// Use the correct message type from Ably
type Message = Ably.Message;
type MessageCallback = (message: Message) => void;

export function useChannel(
  channelName: string,
  callbackOnMessage?: MessageCallback
) {
  const { data: session } = useSession();
  const [channel, setChannel] = useState<Ably.RealtimeChannel | null>(null);
  
  // Use try/catch to handle the case when useAbly might throw an error
  let ably: Ably.Realtime | null = null;
  try {
    ably = useAbly();
  } catch (error) {
    // Silently handle the error when Ably is not available yet
    console.log("Ably client not available yet");
  }

  // In your useEffect for subscribing:
  useEffect(() => {
    if (!ably || !session?.user) return;
    
    try {
      const newChannel = ably.channels.get(channelName);
      setChannel(newChannel);

      if (callbackOnMessage) {
        newChannel.subscribe(callbackOnMessage);
      }

      return () => {
        // Safe cleanup function that checks channel state
        if (newChannel) {
          if (callbackOnMessage) {
            newChannel.unsubscribe(callbackOnMessage);
          }
          
          // Don't try to release the channel, just let Ably's built-in
          // cleanup handle it when the client disconnects
          // This avoids the "was attaching" error
        }
      };
    } catch (error) {
      console.error("Error setting up Ably channel:", error);
    }
  }, [ably, channelName, callbackOnMessage, session?.user]);

  const publish = useCallback(
    async (message: any) => {
      if (channel) {
        try {
          await channel.publish("new-message", message);
        } catch (error) {
          console.error("Error publishing message:", error);
        }
      }
    },
    [channel]
  );

  return { channel, publish };
}