"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { AblyProvider } from "@/components/providers/AblyProvider";
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
  const { userId } = useAuth();
  const { user } = useUser();
  const routeParams = useParams();
  const id = routeParams.id as string;
  const { darkMode } = useTheme();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAttending, setIsAttending] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [joiningEvent, setJoiningEvent] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showCode, setShowCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

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
    <div className="flex flex-col gap-6">
      {/* Main content */}
      <div className="flex-1">
        {/* Back button */}
        <div className="mb-4">
          <button
            onClick={() => router.push("/dashboard/events")}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Events
          </button>
        </div>

        {/* Event header */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                  {event.title}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Organized by {event.createdBy?.name || "Unknown"}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <button 
                  onClick={() => setActiveTab("discussions")}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 md:hidden"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Discussions
                </button>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                {!isAttending ? (
                  <button
                    onClick={handleJoinEvent}
                    disabled={joiningEvent}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {joiningEvent ? "Joining..." : "Join Event"}
                  </button>
                ) : (
                  <span className="inline-flex items-center px-3 py-1.5 border border-green-300 dark:border-green-800 text-sm font-medium rounded-md text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30">
                    <Star className="h-4 w-4 mr-2 text-green-500" />
                    Attending
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <span>{event.isVirtual ? 'Virtual Event' : (event.location || 'Location TBD')}</span>
              </div>
            </div>

            {/* Event Code (visible only to organizers) */}
            {isOrganizer && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Event Code:</span>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type={showCode ? "text" : "password"}
                        readOnly
                        value={event.code}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-200 pr-20"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowCode(!showCode)}
                          className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                        >
                          {showCode ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={copyEventCode}
                          className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {codeCopied && (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                      Copied!
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Share this code with attendees so they can join the event directly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={details => setActiveTab(details.value as string)}>
          <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <Tabs.Trigger 
              value="details"
              className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 ${
                activeTab === "details"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              Event Details
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="attendees"
              className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 flex items-center ${
                activeTab === "attendees"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Attendees ({event.attendees?.length || 0})
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="discussions"
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "discussions"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Discussions
            </Tabs.Trigger>
          </Tabs.List>
          
          {/* Tab content */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <Tabs.Content value="details">
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Description</h3>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <p>{event.description}</p>
                    </div>
                  </div>

                  {event.topics?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Topics</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {event.topics.map((topic: string, i: number) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="attendees">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {event.attendees?.map((attendee: any) => (
                    <div key={attendee._id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {attendee.avatar ? (
                          <img 
                            src={attendee.avatar} 
                            alt={attendee.name} 
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{attendee.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {attendee.profession} {attendee.company ? `at ${attendee.company}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="discussions">
              <div className="px-4 py-5 sm:p-6">
                {isAttending && userId ? (
                  <AblyProvider clientId={userId}>
                    <EventChat 
                      eventId={id} 
                      userId={userId} 
                      userName={user?.fullName || user?.username || "Anonymous"} 
                    />
                  </AblyProvider>
                ) : (
                  <div className="text-center py-10">
                    <MessageCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Event Discussions</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Join this event to participate in the live discussions with other attendees.
                    </p>
                    {!isAttending && (
                      <div className="mt-6">
                        <button
                          onClick={handleJoinEvent}
                          disabled={joiningEvent}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {joiningEvent ? "Joining..." : "Join Event"}
                        </button>
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