"use client";

import { useState, useEffect, useCallback } from "react";
import * as Ably from "ably";
import { useAbly } from "@/components/providers/AblyProvider";

// Use the correct message type from Ably
type Message = Ably.Message;
type MessageCallback = (message: Message) => void;

export function useChannel(
  channelName: string,
  callbackOnMessage?: MessageCallback
) {
  const ably = useAbly();
  const [channel, setChannel] = useState<Ably.RealtimeChannel | null>(null);

  // In your useEffect for subscribing:

  useEffect(() => {
    const newChannel = ably.channels.get(channelName);
    setChannel(newChannel);

    if (callbackOnMessage) {
      // Subscribe to ALL message events, not just 'new-message'
      // This ensures we catch all message types
      newChannel.subscribe(callbackOnMessage);

      // Or specify the exact event:
      // newChannel.subscribe('new-message', callbackOnMessage);
    }

    return () => {
      newChannel.unsubscribe();
    };
  }, [ably, channelName, callbackOnMessage]);

  const publish = useCallback(
    async (message: any) => {
      if (channel) {
        await channel.publish("new-message", message);
      }
    },
    [channel]
  );

  return { channel, publish };
}
