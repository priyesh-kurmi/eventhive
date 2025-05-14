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
      const response = await fetch(`/api/user/${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else {
        const errorData = await response.json();
        
        // Check if this is a user who needs onboarding
        if (response.status === 404 && errorData.code === "user_not_found") {
          setUserData(null);
          
          // Redirect to onboarding if the user is not already there
          // and if we're on a protected route that requires profile completion
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
          // Other error
          console.error("Error fetching user data:", errorData);
          setUserData(null);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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