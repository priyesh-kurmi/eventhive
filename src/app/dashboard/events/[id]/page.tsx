"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react"; // Changed from Clerk
import { useUser } from "@/context/UserContext";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  MessageSquare, 
  User, 
  ChevronLeft,
  Share2,
  Star,
  Copy,
  Eye,
  EyeOff,
  MessageCircle
} from "lucide-react";
import { Tabs } from "@ark-ui/react";
import { formatDate } from "@/lib/utils";
import EventChat from "@/components/chat/EventChat";
import { useTheme } from "@/context/ThemeContext";

interface EventParams {
  params: {
    id: string;
  };
}

export default function EventDetailPage({ params }: EventParams) {
  const router = useRouter();
  const { data: session } = useSession(); // Changed from Clerk
  const { userData } = useUser(); // Use your context
  const routeParams = useParams();
  const id = routeParams.id as string;
  const { darkMode } = useTheme();

  // Get user ID from multiple possible sources
  const userId = userData?._id || userData?.id || session?.user?.id;
  // Get user's name
  const userName = userData?.name || session?.user?.name || "Anonymous User"; 
    const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAttending, setIsAttending] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [joiningEvent, setJoiningEvent] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showCode, setShowCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const [connectionStatuses, setConnectionStatuses] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch event");
        }

        setEvent(data.event);
        setIsAttending(data.isAttending);
        setIsOrganizer(data.isOrganizer);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleJoinEvent = async () => {
    setJoiningEvent(true);
    try {
      const response = await fetch("/api/events/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: id }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join event");
      }

      setIsAttending(true);
      
      // Refresh the event data to update attendees list
      router.refresh();
    } catch (err) {
      console.error("Error joining event:", err);
      setError(err instanceof Error ? err.message : "Failed to join event");
    } finally {
      setJoiningEvent(false);
    }
  };

  const copyEventCode = () => {
    if (event?.code) {
      navigator.clipboard.writeText(event.code);
      setCodeCopied(true);
      setTimeout(() => {
        setCodeCopied(false);
      }, 2000);
    }
  };

  // Handle sending connection request
  const handleSendConnectionRequest = async (attendeeId: string) => {
    if (!userId || attendeeId === userId) return;
    
    setSendingRequest(attendeeId);
    try {
      const response = await fetch('/api/user/connect/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: attendeeId }),
      });

      const data = await response.json();

      if (response.ok) {
        setConnectionStatuses(prev => ({
          ...prev,
          [attendeeId]: 'pending'
        }));
      } else {
        console.error('Failed to send connection request:', data.error);
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
    } finally {
      setSendingRequest(null);
    }
  };

  // Handle starting a chat
  const handleStartChat = (attendeeId: string) => {
    if (!userId || attendeeId === userId) return;
    
    // Navigate to direct message page
    router.push(`/dashboard/messages/${attendeeId}`);
  };
  // Check connection status for attendees
  useEffect(() => {
    const fetchConnectionStatuses = async () => {
      if (!event?.attendees || !userId) return;
      
      try {
        // Fetch user connections and connection requests
        const [connectionsResponse, requestsResponse] = await Promise.all([
          fetch('/api/user/connections'),
          fetch('/api/user/connect/requests')
        ]);
        
        const statuses: { [key: string]: string } = {};
        
        if (connectionsResponse.ok && requestsResponse.ok) {
          const connectionsData = await connectionsResponse.json();
          const requestsData = await requestsResponse.json();
          
          // Map of connected user IDs
          const connectedIds = new Set(connectionsData.connections?.map((conn: any) => conn.id) || []);
          
          // Map of pending/received requests
          const pendingRequestIds = new Set(requestsData.pendingRequests?.map((req: any) => req.from._id) || []);
          
          event.attendees.forEach((attendee: any) => {
            if (attendee._id === userId) {
              statuses[attendee._id] = 'self';
            } else if (connectedIds.has(attendee._id)) {
              statuses[attendee._id] = 'connected';
            } else if (pendingRequestIds.has(attendee._id)) {
              statuses[attendee._id] = 'received';
            } else {
              statuses[attendee._id] = 'none';
            }
          });
        } else {
          // Default status for all attendees if API calls fail
          event.attendees.forEach((attendee: any) => {
            statuses[attendee._id] = attendee._id === userId ? 'self' : 'none';
          });
        }
        
        setConnectionStatuses(statuses);
      } catch (error) {
        console.error('Error fetching connection statuses:', error);
        // Set default statuses on error
        const statuses: { [key: string]: string } = {};
        event.attendees.forEach((attendee: any) => {
          statuses[attendee._id] = attendee._id === userId ? 'self' : 'none';
        });
        setConnectionStatuses(statuses);
      }
    };

    fetchConnectionStatuses();
  }, [event?.attendees, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-400">Error loading event</h3>
        <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => router.push("/dashboard/events")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Event not found</h3>
        <button
          onClick={() => router.push("/dashboard/events")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard/events")}
            className="group inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Events
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative bg-white dark:bg-gray-800 shadow-xl rounded-3xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10" />
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
          </div>
            <div className="relative px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Event Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                      {event.title}
                    </h1>
                    <p className="text-base text-gray-600 dark:text-gray-300 flex items-center mt-1">
                      <User className="h-4 w-4 mr-2" />
                      Organized by <span className="font-medium ml-1">{event.createdBy?.name || "Unknown"}</span>
                    </p>
                  </div>
                </div>

                {/* Event Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-gray-600/50">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Date</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-gray-600/50">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Time</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{event.startTime} - {event.endTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-gray-600/50">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                      <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{event.isVirtual ? 'Virtual Event' : (event.location || 'Location TBD')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[180px]">
                {!isAttending ? (
                  <button
                    onClick={handleJoinEvent}
                    disabled={joiningEvent}
                    className="group inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Star className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    {joiningEvent ? "Joining..." : "Join Event"}
                  </button>
                ) : (
                  <div className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl shadow-lg">
                    <Star className="h-4 w-4 mr-2 fill-current" />
                    Attending
                  </div>
                )}
                
                <button className="inline-flex items-center justify-center px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:ring-offset-gray-800 transition-all duration-200">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </button>
                
                <button 
                  onClick={() => setActiveTab("discussions")}
                  className="lg:hidden inline-flex items-center justify-center px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:ring-offset-gray-800 transition-all duration-200"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </button>
              </div>
            </div>

            {/* Event Code (visible only to organizers) */}
            {isOrganizer && (
              <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-600/50">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-amber-200/50 dark:border-amber-700/50">
                  <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center">
                    <div className="w-7 h-7 bg-amber-200 dark:bg-amber-800 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Event Access Code
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type={showCode ? "text" : "password"}
                        readOnly
                        value={event.code}
                        className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base font-mono tracking-wider"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowCode(!showCode)}
                          className="p-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 focus:outline-none"
                        >
                          {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={copyEventCode}
                          className="p-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 focus:outline-none"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {codeCopied && (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-pulse">
                        Copied!
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                    Share this code with attendees so they can join the event directly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>        {/* Modern Tabs Section */}
        <Tabs.Root value={activeTab} onValueChange={details => setActiveTab(details.value as string)}>          {/* Tab Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-1.5 mb-6">
            <Tabs.List className="flex space-x-1">
              <Tabs.Trigger 
                value="details"
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "details"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Event Details
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="attendees"
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "attendees"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Attendees ({event.attendees?.length || 0})
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="discussions"
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "discussions"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Tabs.Trigger>
            </Tabs.List>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">            <Tabs.Content value="details">
              <div className="p-6">
                <div className="space-y-6">
                  {/* Description Section */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Description</h3>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Topics Section */}
                  {event.topics?.length > 0 && (
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Topics & Tags</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {event.topics.map((topic: string, i: number) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-shadow duration-200"
                          >
                            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Event Stats */}
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Event Statistics</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                        <div className="flex items-center">
                          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                          <div>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{event.attendees?.length || 0}</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Attendees</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
                        <div className="flex items-center">
                          <Calendar className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                          <div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {(() => {
                                const eventDate = new Date(event.date);
                                const today = new Date();
                                const diffTime = eventDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                return diffDays > 0 ? diffDays : 0;
                              })()}
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300 font-medium">Days to go</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50">
                        <div className="flex items-center">
                          <svg className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <div>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{event.topics?.length || 0}</p>
                            <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Topics</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Content>            <Tabs.Content value="attendees">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Event Attendees</h3>
                      <p className="text-gray-600 dark:text-gray-400">{event.attendees?.length || 0} people attending this event</p>
                    </div>
                  </div>
                </div>

                {event.attendees?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.attendees.map((attendee: any) => (
                      <div key={attendee._id} className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {attendee.avatar ? (
                              <img 
                                src={attendee.avatar} 
                                alt={attendee.name} 
                                className="h-12 w-12 rounded-xl object-cover ring-2 ring-white dark:ring-gray-700 shadow-lg"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-700 shadow-lg">
                                <User className="h-6 w-6 text-white" />
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                              {attendee.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                              {attendee.profession}
                              {attendee.company && (
                                <span className="block text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                  @ {attendee.company}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">ATTENDEE</span>
                            <div className="flex items-center space-x-1">
                              {/* Chat Button */}
                              <button 
                                onClick={() => handleStartChat(attendee._id)}
                                disabled={attendee._id === userId}
                                className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Start chat"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </button>
                                {/* Connection Request Button */}
                              {attendee._id !== userId && (
                                <button 
                                  onClick={() => handleSendConnectionRequest(attendee._id)}
                                  disabled={
                                    sendingRequest === attendee._id || 
                                    connectionStatuses[attendee._id] === 'connected' || 
                                    connectionStatuses[attendee._id] === 'pending' ||
                                    connectionStatuses[attendee._id] === 'received'
                                  }
                                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                                    connectionStatuses[attendee._id] === 'connected' 
                                      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                                      : connectionStatuses[attendee._id] === 'pending'
                                      ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                                      : connectionStatuses[attendee._id] === 'received'
                                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                      : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  title={
                                    connectionStatuses[attendee._id] === 'connected' 
                                      ? 'Already connected' 
                                      : connectionStatuses[attendee._id] === 'pending'
                                      ? 'Request sent'
                                      : connectionStatuses[attendee._id] === 'received'
                                      ? 'Request received'
                                      : 'Send connection request'
                                  }
                                >
                                  {sendingRequest === attendee._id ? (
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : connectionStatuses[attendee._id] === 'connected' ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : connectionStatuses[attendee._id] === 'pending' ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  ) : connectionStatuses[attendee._id] === 'received' ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No attendees yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                      Be the first to join this exciting event and connect with other attendees!
                    </p>
                    {!isAttending && (
                      <button
                        onClick={handleJoinEvent}
                        disabled={joiningEvent}
                        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        {joiningEvent ? "Joining..." : "Join Event"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Tabs.Content>            <Tabs.Content value="discussions">
              <div className="p-6">
                {isAttending && userId ? (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Live Discussions</h3>
                        <p className="text-gray-600 dark:text-gray-400">Chat with fellow attendees in real-time</p>
                      </div>
                    </div>
                    <EventChat 
                      eventId={id} 
                      userId={userId} 
                      userName={userName} 
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Event Discussions</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
                      Join this event to participate in live discussions with other attendees. Connect, share ideas, and make the most of your event experience!
                    </p>
                    {!isAttending && (
                      <div className="space-y-3">
                        <button
                          onClick={handleJoinEvent}
                          disabled={joiningEvent}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50"
                        >
                          <Star className="h-5 w-5 mr-2" />
                          {joiningEvent ? "Joining..." : "Join Event to Chat"}
                        </button>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Free to join • Connect instantly • Real-time messaging
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}