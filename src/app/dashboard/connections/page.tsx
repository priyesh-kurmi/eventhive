"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import UserSearch from "@/components/dashboard/UserSearch";
import { Search, Users, UserPlus, Clock, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type UserSearchResult = {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
  profession?: string;
};

type ConnectionRequest = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  profession?: string;
  createdAt: string;
};

export default function ConnectionsPage() {
  const { data: session } = useSession();
  const { userData } = useUser();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"connections" | "requests" | "find">("connections");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);

  // Fetch connections
  useEffect(() => {
    async function fetchConnections() {
      try {
        const response = await fetch('/api/user/connections');
        if (!response.ok) throw new Error('Failed to fetch connections');
        const data = await response.json();
        setConnections(data.connections);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchConnections();
    }
  }, [session]);

  // Fetch connection requests
  useEffect(() => {
    async function fetchConnectionRequests() {
      try {
        setRequestsLoading(true);
        const response = await fetch('/api/user/connect/requests');
        if (!response.ok) throw new Error('Failed to fetch connection requests');
        const data = await response.json();
        setConnectionRequests(data.requests);
      } catch (error) {
        console.error("Error fetching connection requests:", error);
      } finally {
        setRequestsLoading(false);
      }
    }

    if (session?.user && activeTab === "requests") {
      fetchConnectionRequests();
    }
  }, [session, activeTab]);

  // Handle accepting connection request
  const handleAcceptRequest = async (userId: string) => {
    try {
      const response = await fetch('/api/user/connect/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) throw new Error('Failed to accept connection request');
      
      // Remove from requests and refresh connections
      setConnectionRequests(prev => prev.filter(req => req.id !== userId));
      
      // Refetch connections to show the new connection
      const connectionsResponse = await fetch('/api/user/connections');
      if (connectionsResponse.ok) {
        const data = await connectionsResponse.json();
        setConnections(data.connections);
      }
      
    } catch (error) {
      console.error("Error accepting connection request:", error);
    }
  };

  // Handle rejecting connection request
  const handleRejectRequest = async (userId: string) => {
    try {
      const response = await fetch('/api/user/connect/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) throw new Error('Failed to reject connection request');
      
      // Remove from requests
      setConnectionRequests(prev => prev.filter(req => req.id !== userId));
      
    } catch (error) {
      console.error("Error rejecting connection request:", error);
    }
  };

  // Handle deleting a connection
  const handleDeleteConnection = async (userId: string) => {
    try {
      const response = await fetch('/api/user/connect/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) throw new Error('Failed to delete connection');
      
      // Remove from connections list
      setConnections(prev => prev.filter(conn => conn.id !== userId));
      
    } catch (error) {
      console.error("Error deleting connection:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Connections</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("connections")}
            className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
              activeTab === "connections"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <Users className="mr-2 h-5 w-5" />
            Your Connections
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
              activeTab === "requests"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Connection Requests
            {connectionRequests.length > 0 && (
              <span className="ml-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded-full text-xs">
                {connectionRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("find")}
            className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
              activeTab === "find"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <Search className="mr-2 h-5 w-5" />
            Find Connections
          </button>
        </nav>
      </div>
      
      {/* Your Connections Tab Content */}
      {activeTab === "connections" && (
        <div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse">Loading connections...</div>
            </div>
          ) : connections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map((connection) => (
                <ConnectionCard 
                  key={connection.id} 
                  connection={connection} 
                  onDelete={handleDeleteConnection}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                You don't have any connections yet. Go to the "Find Connections" tab to discover people to connect with.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Connection Requests Tab Content */}
      {activeTab === "requests" && (
        <div>
          {requestsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse">Loading connection requests...</div>
            </div>
          ) : connectionRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectionRequests.map((request) => (
                <RequestCard 
                  key={request.id} 
                  request={request} 
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                You don't have any pending connection requests.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Find Connections Tab Content */}
      {activeTab === "find" && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Find People</h2>
          <UserSearch onResultsFound={setSearchResults} />
          
          {/* Search Results Display */}
          <div className="mt-4">
            {searchResults.length > 0 ? (
              <div>
                <h3 className="text-md font-medium mb-3">People matching your search</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((user) => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Search for users by name or username to find people to connect with.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Connection type
type Connection = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  profession?: string;
};

// Updated ConnectionCard with chat button
function ConnectionCard({ connection, onDelete }: { 
  connection: Connection; 
  onDelete: (userId: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(connection.id);
    setIsDeleting(false);
    setShowConfirm(false);
  };
  
  const viewProfile = () => {
    router.push(`/dashboard/profile/${connection.username}`);
    setShowDropdown(false);
  };
  
  const startChat = () => {
    router.push(`/dashboard/messages/${connection.id}`);
    setShowDropdown(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 relative">
      {/* Three-dot menu with chat button */}
      <div className="absolute top-2 right-2" ref={dropdownRef}>
        <div className="flex space-x-2">
          <button
            onClick={startChat}
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            title="Send message"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
        
        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
            <button
              onClick={viewProfile}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              View Profile
            </button>
            <button
              onClick={() => {
                setShowDropdown(false);
                setShowConfirm(true);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Remove Connection
            </button>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {connection.avatar ? (
            <img 
              src={connection.avatar} 
              alt={connection.name} 
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {connection.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium">{connection.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{connection.username}
            {connection.profession && ` • ${connection.profession}`}
          </p>
        </div>
      </div>
      
      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Are you sure you want to remove this connection?
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded disabled:opacity-50"
            >
              {isDeleting ? "Removing..." : "Yes, Remove"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-1 px-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RequestCard({ 
  request, 
  onAccept, 
  onReject 
}: { 
  request: ConnectionRequest; 
  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAccept = async () => {
    setIsProcessing(true);
    await onAccept(request.id);
    setIsProcessing(false);
  };
  
  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(request.id);
    setIsProcessing(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {request.avatar ? (
            <img 
              src={request.avatar} 
              alt={request.name} 
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {request.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-medium">{request.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{request.username}
            {request.profession && ` • ${request.profession}`}
          </p>
          <p className="text-xs text-gray-400 flex items-center mt-1">
            <Clock className="w-3 h-3 mr-1" />
            Requested {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleAccept}
          disabled={isProcessing}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded text-sm font-medium disabled:opacity-50"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-3 rounded text-sm font-medium disabled:opacity-50"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

// Updated UserCard with chat button for connected users
function UserCard({ user }: { user: UserSearchResult }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState<"idle" | "requested" | "alreadyRequested" | "connected">("idle");
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Check if already connected on mount
  useEffect(() => {
    async function checkConnectionStatus() {
      try {
        const response = await fetch(`/api/user/profile/${user.username}`);
        if (response.ok) {
          const data = await response.json();
          if (data.connectionStatus === 'connected') {
            setStatus('connected');
          } else if (data.connectionStatus === 'pending') {
            setStatus('requested');
          } else if (data.connectionStatus === 'received') {
            setStatus('alreadyRequested');
          }
        }
      } catch (error) {
        console.error("Error checking connection status:", error);
      }
    }
    
    checkConnectionStatus();
  }, [user.username]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user/connect/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.error === "Already connected with this user") {
          setStatus("connected");
        } else {
          throw new Error(data.error || "Failed to send connection request");
        }
      } else if (data.alreadyRequested) {
        setStatus("alreadyRequested");
      } else {
        setStatus("requested");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setStatus("idle");
    } finally {
      setIsConnecting(false);
    }
  };
  
  const viewProfile = () => {
    router.push(`/dashboard/profile/${user.username}`);
    setShowDropdown(false);
  };
  
  const startChat = () => {
    router.push(`/dashboard/messages/${user._id}`);
    setShowDropdown(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 relative">
      {/* Three-dot menu */}
      <div className="absolute top-2 right-2" ref={dropdownRef}>
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Options"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        
        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
            <button
              onClick={viewProfile}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              View Profile
            </button>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {user.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-medium">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{user.username}
            {user.profession && ` • ${user.profession}`}
          </p>
          
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
          
          {status === "requested" ? (
            <span className="mt-2 inline-block text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded">
              Request sent
            </span>
          ) : status === "alreadyRequested" ? (
            <span className="mt-2 inline-block text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded">
              Request already received
            </span>
          ) : status === "connected" ? (
            <div className="flex mt-2 space-x-2">
              <button
                onClick={startChat}
                className="inline-flex items-center text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Message
              </button>
            </div>
          ) : (
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="mt-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}