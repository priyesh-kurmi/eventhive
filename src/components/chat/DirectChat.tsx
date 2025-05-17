"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, ArrowLeft } from "lucide-react";
import { getDirectMessageChannelName, DirectChatMessage } from "@/lib/ably";
import { useChannel } from "@/hooks/useChannel";
import { useRouter } from "next/navigation";

interface DirectChatProps {
  userId: string;
  currentUserId: string;
  currentUserName: string;
}

interface ChatUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export default function DirectChat({
  userId,
  currentUserId,
  currentUserName,
}: DirectChatProps) {
  const [messages, setMessages] = useState<DirectChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ChatUser | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Subscribe to Ably channel
  const channelName = getDirectMessageChannelName(currentUserId, userId);
  useChannel(channelName, (message) => {
    // Handle new message from Ably
    const newMsg = message.data as DirectChatMessage;
    setMessages((prev) => [...prev, newMsg]);
  });

  // Fetch past messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setMessages(data.messages || []);
          setUser(data.user);
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
  }, [userId]);

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
      const response = await fetch(`/api/messages/${userId}`, {
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

  // Go back to messages list
  const handleBack = () => {
    router.push("/dashboard/messages");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <button 
          onClick={handleBack}
          className="mr-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <div className="flex items-center">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full mr-3"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{user?.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id || `temp-message-${index}`}
                className={`flex ${
                  message.senderId === currentUserId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.senderId === currentUserId
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.senderId !== currentUserId ? (
                      user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-indigo-600" />
                        </div>
                      )
                    ) : null}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`mx-2 px-4 py-2 rounded-lg ${
                      message.senderId === currentUserId
                        ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100"
                        : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {formatTime(message.timestamp)}
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
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-r-md px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:ring-offset-gray-800"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}