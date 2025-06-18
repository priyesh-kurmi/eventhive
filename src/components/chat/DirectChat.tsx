"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, ArrowLeft } from "lucide-react";
import {
  getDirectMessageChannelName,
  DirectChatMessage as BaseDirectChatMessage,
} from "@/lib/socket";

// Extend DirectChatMessage to include isCurrentUser
interface DirectChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;  isCurrentUser?: boolean; // This is the key addition
  senderName?: string;
  avatar?: string;
}
import { useDirectChat } from "@/hooks/useSocket";
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
  const processedMessageIds = useRef<Set<string>>(new Set());
  const messagesRef = useRef<DirectChatMessage[]>([]);

  // Keep messagesRef in sync with messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  // Subscribe to direct chat channel using Socket.IO
  const chatId = getDirectMessageChannelName(currentUserId, userId);
  
  // Handle new messages from Socket.IO
  const handleNewMessage = (message: DirectChatMessage) => {
    handleIncomingMessage(message);
  };

  const { sendMessage } = useDirectChat(chatId, handleNewMessage);

  // Common handler for all incoming messages
  // Update the handleIncomingMessage function:
const handleIncomingMessage = (newMsg: DirectChatMessage) => {
  console.log("Received real-time message:", newMsg);
  
  if (processedMessageIds.current.has(newMsg.id)) {
    console.log("Skipping already processed message:", newMsg.id);
    return;
  }
  
  // Ensure the isCurrentUser property is set correctly
  const messageSenderId = String(newMsg.senderId || "").trim();
  const currentUserIdStr = String(currentUserId || "").trim();
  newMsg.isCurrentUser = messageSenderId === currentUserIdStr;
  
  console.log(`Message from ${messageSenderId}, current user: ${currentUserIdStr}, isCurrentUser: ${newMsg.isCurrentUser}`);
  
  // Add to processed set first to prevent duplicates during state update
  processedMessageIds.current.add(newMsg.id);
  
  setMessages(prevMessages => {
    // Check for temporary message to replace
    const tempIndex = prevMessages.findIndex(m => 
      m.id.startsWith('temp-') && 
      m.content === newMsg.content && 
      Math.abs(m.timestamp - newMsg.timestamp) < 10000
    );
    
    if (tempIndex >= 0) {
      // Replace temp message
      console.log("Replacing temp message with real message");
      const newMessages = [...prevMessages];
      newMessages[tempIndex] = newMsg;
      return newMessages;
    }
      // Add as new message
    console.log("Adding new message");
    return [...prevMessages, newMsg];
  });
};

  // Fetch past messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for userId:", userId);
        const response = await fetch(`/api/messages/${userId}`);
        const data = await response.json();

        if (response.ok) {
          console.log("Messages loaded:", data.messages?.length);

          // Record all message IDs as processed
          data.messages.forEach((msg: DirectChatMessage) => {
            processedMessageIds.current.add(msg.id);
          });

          // If the API returns currentUserId, we can validate our local ID
          if (data.currentUserId) {
            console.log("API currentUserId:", data.currentUserId);
            console.log("Component currentUserId:", currentUserId);
            // You could optionally use the server-provided ID if needed
          }

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
    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      console.log("Sending message:", messageContent);

      // Send the message to the API
      const response = await fetch(`/api/messages/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: messageContent }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send message");
      }

      const { message } = await response.json();
      
      // Send via Socket.IO (this will broadcast to other users)
      sendMessage(message);

      console.log("Message sent successfully");
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

  // Function to check if a message is from the current user
  // Function to check if a message is from the current user
  const isCurrentUserMessage = (message: DirectChatMessage) => {
    // Convert both IDs to strings and normalize them
    const messageSenderId = String(message.senderId || "").trim();
    const currentUserIdStr = String(currentUserId || "").trim();

    // Check for MongoDB ObjectId format and extract just the hex part if needed
    const extractIdHex = (id: string) => {
      // If it's a MongoDB ObjectId string representation
      if (id.match(/^[0-9a-f]{24}$/)) {
        return id;
      }
      // Extract hex value from ObjectId format if needed
      const match = id.match(
        /(?:ObjectId\(["']?([0-9a-f]{24})["']?\)|["']?([0-9a-f]{24})["']?)/i
      );
      return match ? match[1] || match[2] : id;
    };

    const normalizedMessageSenderId = extractIdHex(messageSenderId);
    const normalizedCurrentUserId = extractIdHex(currentUserIdStr);

    console.log(
      `Comparing sender IDs (normalized): "${normalizedMessageSenderId}" === "${normalizedCurrentUserId}"`
    );

    return normalizedMessageSenderId === normalizedCurrentUserId;
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {user?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{user?.username}
            </p>
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
            {messages.map((message, index) => {
              const isCurrent = !!message.isCurrentUser;

              return (
                <div
                  key={message.id || `temp-message-${index}`}
                  className={`flex ${
                    isCurrent ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] ${
                      isCurrent ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {!isCurrent ? (
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
                        isCurrent
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
              );
            })}
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
