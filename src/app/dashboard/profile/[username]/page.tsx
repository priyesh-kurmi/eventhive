"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUser } from "@/context/UserContext";
import { User, Mail, Briefcase, Building, MapPin, Globe, Calendar, Clock, Users } from "lucide-react";

type UserProfile = {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  profession?: string;
  company?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  skills?: string[];
  interests?: string[];
  isConnected: boolean;
  connectionStatus?: "none" | "pending" | "requested" | "connected";
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { userData } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const username = params.username as string;

  // Fetch user profile
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        const response = await fetch(`/api/user/profile/${username}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        setProfile(data.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (username && session?.user) {
      fetchUserProfile();
    }
  }, [username, session]);

  const handleConnect = async () => {
    if (!profile) return;
    
    setIsConnecting(true);
    try {
      const response = await fetch('/api/user/connect/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: profile._id })
      });
      
      if (!response.ok) throw new Error('Failed to send connection request');
      
      // Update local state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          connectionStatus: 'pending'
        };
      });
      
    } catch (error) {
      console.error('Error sending connection request:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // If loading
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-center">
            <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // If error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">Error</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If user not found
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The user you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-48 relative">
          {/* Profile picture */}
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-4xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Connection Button */}
          {profile.username !== userData?.username && (
            <div className="absolute bottom-0 right-8 transform translate-y-1/2">
              {profile.connectionStatus === 'connected' ? (
                <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  Connected
                </span>
              ) : profile.connectionStatus === 'pending' ? (
                <span className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4 mr-2" />
                  Request Sent
                </span>
              ) : profile.connectionStatus === 'requested' ? (
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700">
                    Accept Request
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">
                    Decline
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="p-8 pt-20">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
            <p className="text-indigo-600 dark:text-indigo-400">@{profile.username}</p>
            
            {profile.profession && (
              <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>{profile.profession}</span>
                {profile.company && (
                  <>
                    <span className="mx-2">at</span>
                    <span className="font-medium">{profile.company}</span>
                  </>
                )}
              </div>
            )}
            
            {profile.location && (
              <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{profile.location}</span>
              </div>
            )}
            
            {profile.bio && (
              <p className="mt-4 text-gray-700 dark:text-gray-300">{profile.bio}</p>
            )}
          </div>
          
          {/* Contact and Links */}
          {(profile.website || profile.linkedin) && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Contact & Links</h2>
              <div className="space-y-2">
                {profile.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {profile.website}
                  </a>
                )}
                
                {profile.linkedin && (
                  <a 
                    href={profile.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}