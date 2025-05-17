"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

type UserSearchResult = {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
  profession?: string;
};

type UserSearchProps = {
  onResultsFound: (results: UserSearchResult[]) => void;
};

export default function UserSearch({ onResultsFound }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const router = useRouter();

  // Search for users when search term changes
  useEffect(() => {
    async function searchUsers() {
      if (!debouncedSearchTerm) {
        onResultsFound([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/user/search?q=${encodeURIComponent(debouncedSearchTerm)}`);
        if (!response.ok) throw new Error("Failed to search users");
        const data = await response.json();
        onResultsFound(data.users);
      } catch (error) {
        console.error("Error searching users:", error);
        onResultsFound([]);
      } finally {
        setIsLoading(false);
      }
    }

    searchUsers();
  }, [debouncedSearchTerm, onResultsFound]);

  return (
    <div className="w-full max-w-md mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users by name or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-gray-100"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      {isLoading && (
        <div className="mt-2 text-sm text-gray-500">Searching...</div>
      )}
    </div>
  );
}