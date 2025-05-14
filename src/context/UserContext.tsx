"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";

type UserData = {
  _id?: string;
  name?: string;
  email?: string;
  clerkId?: string;
  profession?: string;
  company?: string;
  skills?: string[];
  interests?: string[];
  bio?: string;
  avatar?: string;
  eventPreferences?: string[];
  // Add the currentEvent property
  currentEvent?: {
    id: string;
    name: string;
    date: string;
  } | null;
};

type UserContextType = {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  isLoading: boolean;
  fetchUserData: () => Promise<void>;
  // Add a specific method for updating current event
  setCurrentEvent: (event: { id: string; name: string; date: string } | null) => void;
};

const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
  isLoading: true,
  fetchUserData: async () => {},
  setCurrentEvent: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoaded } = useClerkUser();
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserData = async () => {
  if (!user) {
    setIsLoading(false);
    return;
  }

  try {
    console.log("Fetching user data for ID:", user.id);
    const response = await fetch(`/api/user/${user.id}`);
    
    if (response.ok) {
      const data = await response.json();
      setUserData(data.user);
    } else {
      // Get response text first for safer error handling
      const rawResponseText = await response.text();
      
      // Try to parse as JSON if possible
      let errorData: { code?: string } = {};
      if (rawResponseText) {
        try {
          errorData = JSON.parse(rawResponseText);
        } catch (parseError) {
          console.warn("Response is not valid JSON:", rawResponseText);
        }
      }
      
      // Handle 404 for onboarding
      if (response.status === 404 && errorData.code === "user_not_found") {
        console.log("User needs onboarding");
        setUserData(null);
        
        if (
          pathname !== '/onboarding' && 
          pathname !== '/sign-in' && 
          pathname !== '/sign-up' && 
          pathname !== '/' && 
          !pathname?.startsWith('/events/')
        ) {
          router.push('/onboarding');
        }
      } else {
        // DB connection or other error - create fallback user data from Clerk
        console.error("API error status:", response.status, "Data:", errorData);
        console.warn("Likely MongoDB connection issue - please check IP whitelist in MongoDB Atlas");
        
        // Create minimal userData from Clerk as fallback
        if (user) {
          const fallbackData = {
            name: user.fullName || `${user.firstName} ${user.lastName}`,
            email: user.primaryEmailAddress?.emailAddress,
            clerkId: user.id,
            avatar: user.imageUrl
          };
          console.log("Using fallback user data from Clerk:", fallbackData);
          setUserData(fallbackData as UserData);
        } else {
          setUserData(null);
        }
      }
    }
  } catch (error) {
    console.error("Network error fetching user data:", error);
    setUserData(null);
  } finally {
    setIsLoading(false);
  }
};

  // Add method to update current event
  const setCurrentEvent = (event: { id: string; name: string; date: string } | null) => {
    if (userData) {
      setUserData({
        ...userData,
        currentEvent: event,
      });
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    } else if (isLoaded && !user) {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  return (
    <UserContext.Provider value={{ 
      userData, 
      setUserData, 
      isLoading, 
      fetchUserData,
      setCurrentEvent 
    }}>
      {children}
    </UserContext.Provider>
  );
};