"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
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
import { formatDate } from "@/lib/utils";
import EventChat from "@/components/chat/EventChat";

interface EventParams {
  params: {
    id: string;
  };
}

export default function EventDetailPage({ params }: EventParams) {
  const router = useRouter();
  const { userId } = useAuth();
  const { user } = useUser();

  // Fix 1: Type the result of use() properly
  const unwrappedParams = use(params as any) as { id: string };
  const id = unwrappedParams.id; 
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAttending, setIsAttending] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [joiningEvent, setJoiningEvent] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showCode, setShowCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showChat, setShowChat] = useState(false);

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-red-800">Error loading event</h3>
        <p className="mt-2 text-red-600">{error}</p>
        <button
          onClick={() => router.push("/dashboard/events")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Event not found</h3>
        <button
          onClick={() => router.push("/dashboard/events")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1">
        {/* Back button */}
        <div className="mb-4">
          <button
            onClick={() => router.push("/dashboard/events")}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Events
          </button>
        </div>

        {/* Event header */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {event.title}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Organized by {event.createdBy?.name || "Unknown"}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <button 
                  onClick={() => setShowChat(!showChat)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:hidden"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {showChat ? "Hide Chat" : "Show Chat"}
                </button>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                {!isAttending ? (
                  <button
                    onClick={handleJoinEvent}
                    disabled={joiningEvent}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {joiningEvent ? "Joining..." : "Join Event"}
                  </button>
                ) : (
                  <span className="inline-flex items-center px-3 py-1.5 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50">
                    <Star className="h-4 w-4 mr-2 text-green-500" />
                    Attending
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <span>{event.isVirtual ? 'Virtual Event' : (event.location || 'Location TBD')}</span>
              </div>
            </div>

            {/* Event Code (visible only to organizers) */}
            {isOrganizer && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">Event Code:</span>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type={showCode ? "text" : "password"}
                        readOnly
                        value={event.code}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50 pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={() => setShowCode(!showCode)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {showCode ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={copyEventCode}
                    className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    {codeCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Share this code with attendees so they can join the event directly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`${
                activeTab === "details"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Event Details
            </button>
            <button
              onClick={() => setActiveTab("attendees")}
              className={`${
                activeTab === "attendees"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Users className="h-4 w-4 mr-2" />
              Attendees ({event.attendees?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("discussions")}
              className={`${
                activeTab === "discussions"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Discussions
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {activeTab === "details" && (
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Description</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{event.description}</p>
                  </div>
                </div>

                {event.topics?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Topics</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.topics.map((topic: string, i: number) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "attendees" && (
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
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{attendee.name}</h3>
                      <p className="text-xs text-gray-500">
                        {attendee.profession} {attendee.company ? `at ${attendee.company}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "discussions" && (
            <div className="px-4 py-5 sm:p-6">
              {/* Implement discussions when you have the discussions feature ready */}
              <div className="text-center py-10">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No discussions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get the conversation started by creating the first topic.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    New Discussion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile chat (conditionally shown) */}
    <div className={`mt-6 md:hidden ${showChat ? 'block' : 'hidden'}`}>
      {isAttending && userId && (
        <AblyProvider clientId={userId}>
          <EventChat 
            eventId={id} 
            userId={userId} 
            userName={user?.fullName || user?.username || "Anonymous"} 
          />
        </AblyProvider>
      )}
    </div>
  </div>

      {/* Chat sidebar - only visible on medium and larger screens */}
      <div className="hidden md:block md:w-1/3">
        {isAttending && userId ? (
          <AblyProvider clientId={userId}>
    <EventChat 
      eventId={id} 
      userId={userId} 
      userName={user?.fullName || user?.username || "Anonymous"} 
    />
  </AblyProvider>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Event Chat</h3>
            <p className="text-gray-500 mb-4">
              Join this event to participate in the live chat with other attendees.
            </p>
            {!isAttending && (
              <button
                onClick={handleJoinEvent}
                disabled={joiningEvent}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                <Star className="h-4 w-4 mr-2" />
                {joiningEvent ? "Joining..." : "Join Event"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}