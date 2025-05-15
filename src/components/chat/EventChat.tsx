"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User } from "lucide-react";
import { getEventChannelName, ChatMessage } from "@/lib/ably";
import { useChannel } from "@/hooks/useChannel";

interface EventChatProps {
  eventId: string;
  userId: string;
  userName: string;
}

export default function EventChat({
  eventId,
  userId,
  userName,
}: EventChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to Ably channel
  const channelName = getEventChannelName(eventId);
  useChannel(channelName, (message) => {
    // Handle new message from Ably
    const newMsg = message.data as ChatMessage;
    setMessages((prev) => [...prev, newMsg]);
  });

  // Fetch past messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/messages`);
        const data = await response.json();

        if (response.ok) {
          setMessages(data.messages || []);
        } else {
          console.error("Error fetching messages:", data.error);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [eventId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    try {
      // Send the message to the API
      const response = await fetch(`/api/events/${eventId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send message");
      }

      // Clear input after successful send
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-lg bg-white">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Event Chat</h3>
        <p className="text-sm text-gray-500">Chat with all event attendees</p>
      </div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm">Be the first to say hello!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id || `temp-message-${index}`}
                className={`flex ${
                  message.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.senderId === userId
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.avatar ? (
                      <img
                        src={message.avatar}
                        alt={message.senderName}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`mx-2 px-4 py-2 rounded-lg ${
                      message.senderId === userId
                        ? "bg-indigo-100 text-indigo-900"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1">
                        {message.senderId === userId
                          ? "You"
                          : message.senderName}{" "}
                        • {formatTime(message.timestamp)}
                      </span>
                      <span>{message.content}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-r-md px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
