"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { User, MessageCircle } from "lucide-react";

interface Conversation {
  userId: string;
  username: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Fetch conversations
  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch("/api/messages");
        const data = await response.json();
        
        if (response.ok) {
          setConversations(data.conversations || []);
        } else {
          console.error("Error fetching conversations:", data.error);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (session?.user) {
      fetchConversations();
    }
  }, [session]);
  
  // Handle click on a conversation
  const openConversation = (userId: string) => {
    router.push(`/dashboard/messages/${userId}`);
  };
  
  // Format message timestamp
  const formatMessageTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a"); // Today at 3:45 PM
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"; // Yesterday
    } else if (now.getTime() - date.getTime() < 6 * 24 * 60 * 60 * 1000) {
      return format(date, "EEEE"); // Monday, Tuesday, etc.
    } else {
      return format(date, "MMM d"); // Jan 5, Feb 12, etc.
    }
  };
  
  // Truncate message preview
  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Messages</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="py-20">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
                <MessageCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No messages yet</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Connect with other users and start a conversation by visiting the Connections page
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.userId}
                className="w-full text-left px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => openConversation(conversation.userId)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 relative">
                    {conversation.avatar ? (
                      <img 
                        src={conversation.avatar} 
                        alt={conversation.name} 
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatMessageTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      conversation.unreadCount > 0 
                        ? 'text-gray-900 dark:text-white font-semibold'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {truncateMessage(conversation.lastMessage)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}