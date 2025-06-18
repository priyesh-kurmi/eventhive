"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, Smile, Paperclip, MoreVertical } from "lucide-react";
import { useEventChat } from "@/hooks/useSocket";

// Use the Message interface that matches the hook's expectation
interface EventMessage {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: Date;
  eventId?: string;
  targetUserId?: string;
  // Add properties needed by the component
  senderId?: string;
  senderName?: string;
  avatar?: string;
}

interface EventChatProps {
  eventId: string;
  userId: string;
  userName: string;
}

export default function EventChat({
  eventId,
  userId,
  userName,
}: EventChatProps) {  const [messages, setMessages] = useState<EventMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle new messages from Socket.IO
  const handleNewMessage = (message: EventMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  // Subscribe to Socket.IO channel
  const { sendMessage } = useEventChat(eventId, handleNewMessage);

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

    setIsTyping(true);

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

      const { message } = await response.json();
      
      // Send via Socket.IO (this will broadcast to other users)
      sendMessage(message);

      // Clear input after successful send
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for day separators
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }  };

  // Group messages by date
  const groupMessagesByDate = (messages: EventMessage[]) => {
    const groups: { [key: string]: EventMessage[] } = {};
    messages.forEach((message) => {
      const dateKey = new Date(message.timestamp).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);
  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Event Chat</h3>
              <p className="text-indigo-100 text-sm">
                {messages.length} {messages.length === 1 ? 'message' : 'messages'}
              </p>
            </div>
          </div>
          <button className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="text-center">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Start the conversation!</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Be the first to share your thoughts and connect with other attendees.</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {Object.entries(messageGroups).map(([dateKey, dayMessages]) => (
              <div key={dateKey}>
                {/* Date separator */}
                <div className="flex items-center justify-center py-3">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1.5">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {formatDate(new Date(dayMessages[0].timestamp).getTime())}
                    </span>
                  </div>
                </div>
                
                {/* Messages for this date */}
                <div className="space-y-3">
                  {dayMessages.map((message, index) => (
                    <div
                      key={message.id || `temp-message-${index}`}
                      className={`flex ${
                        message.userId === userId ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[75%] ${
                          message.userId === userId ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {message.avatar ? (
                            <img
                              src={message.avatar}
                              alt={message.userName}
                              className="h-8 w-8 rounded-xl object-cover ring-2 ring-white dark:ring-gray-700 shadow-lg"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-700 shadow-lg">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Message bubble */}
                        <div className={`mx-2 ${message.userId === userId ? "mr-0" : "ml-0"}`}>                          <div
                            className={`px-3 py-2 rounded-xl shadow-lg ${
                              message.userId === userId
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm"
                                : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm"
                            }`}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center space-x-1.5 mb-0.5">
                                <span className={`text-xs font-medium ${
                                  message.userId === userId
                                    ? "text-indigo-100"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}>
                                  {message.userId === userId ? "You" : message.userName}
                                </span>                                <span className={`text-xs ${
                                  message.userId === userId
                                    ? "text-indigo-200"
                                    : "text-gray-500 dark:text-gray-500"
                                }`}>
                                  {formatTime(new Date(message.timestamp).getTime())}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              style={{ minHeight: '40px', maxHeight: '100px' }}
            />
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
              >
                <Smile className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
              >
                <Paperclip className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || isTyping}
            className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        
        {isTyping && (
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">Sending...</span>
          </div>
        )}
      </div>
    </div>
  );
}