"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

type UserData = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  profession?: string;
  company?: string;
  skills?: string[];
  interests?: string[];
  bio?: string;
  avatar?: string;
  eventPreferences?: string[];
  isOnboarded?: boolean;
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const fetchUserData = useCallback(async () => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      setUserData(null);
      setIsLoading(false);
      return;
    }
    
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching user data for ID:", session.user.id);
      
      // Try to fetch user by email instead of ID during transition period
      const response = await fetch(`/api/user/profile`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("User data retrieved successfully:", data);
        setUserData({
          ...data.user,
          id: data.user.id || data.user._id,
        });
      } else {
        // Get response text first for safer error handling
        const rawResponseText = await response.text();
        
        // Try to parse as JSON if possible
        let errorData: { code?: string, needsOnboarding?: boolean } = {};
        if (rawResponseText) {          try {
            errorData = JSON.parse(rawResponseText);
          } catch {
            console.warn("Response is not valid JSON:", rawResponseText);
          }
        }
        
        // Handle invalid ID format or user not found (both should redirect to onboarding)
        if ((response.status === 400 && errorData.code === "invalid_id") || 
            (response.status === 404 && errorData.code === "user_not_found") || 
            errorData.needsOnboarding) {
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
          // Other errors - create fallback user data from session
          console.error("API error status:", response.status, "Data:", errorData);
          
          // Create minimal userData from NextAuth session as fallback
          if (session.user) {
            const fallbackData = {
              id: session.user.id,
              name: session.user.name || '',
              email: session.user.email || '',
              avatar: session.user.image || '',
              isOnboarded: session.user.isOnboarded || false
            };
            console.log("Using fallback user data from session:", fallbackData);
            setUserData(fallbackData as UserData);
          } else {
            setUserData(null);
          }
        }
      }
    } catch (error) {
      console.error("Network error fetching user data:", error);      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, [session, status, router, pathname]);

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
    if (session?.user) {
      fetchUserData();
    } else if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [session, status, fetchUserData]);

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