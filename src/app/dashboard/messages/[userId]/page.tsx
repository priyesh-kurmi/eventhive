"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import DirectChat from "@/components/chat/DirectChat";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback() {
  return (
    <div className="p-4 text-center">
      <p>Loading chat functionality...</p>
    </div>
  );
}

export default function ChatPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const userId = params.userId as string;
  
  // Check if users are connected
  useEffect(() => {
    async function checkConnection() {
      try {
        if (!session?.user) return;
        
        // Make a request to verify the users are connected
        const response = await fetch(`/api/messages/${userId}`);
        
        if (response.ok) {
          setIsConnected(true);
        } else {
          const data = await response.json();
          setError(data.error || "Could not load chat");
        }
      } catch (err) {
        setError("Failed to verify connection");
      } finally {
        setIsLoading(false);
      }
    }
    
    if (session?.user) {
      checkConnection();
    }
  }, [userId, session]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
          <p className="text-red-800 dark:text-red-400">{error}</p>
          <p className="text-sm text-red-600 dark:text-red-500 mt-2">
            You can only message users you are connected with.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {isConnected && session?.user && (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <DirectChat 
            userId={userId}
            currentUserId={session.user.id}
            currentUserName={session.user.name || ""}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}