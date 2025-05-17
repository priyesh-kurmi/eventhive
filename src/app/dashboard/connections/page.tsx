"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "@/context/UserContext";
import UserSearch from "@/components/dashboard/UserSearch";
import { Search, Users } from "lucide-react";

type UserSearchResult = {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
  profession?: string;
};

export default function ConnectionsPage() {
  const { data: session } = useSession();
  const { userData } = useUser();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"connections" | "find">("connections");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);

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
                <ConnectionCard key={connection.id} connection={connection} />
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

function ConnectionCard({ connection }: { connection: Connection }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
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
    </div>
  );
}

function UserCard({ user }: { user: UserSearchResult }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
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
        <div>
          <h3 className="text-lg font-medium">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{user.username}
            {user.profession && ` • ${user.profession}`}
          </p>
          <button 
            className="mt-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}