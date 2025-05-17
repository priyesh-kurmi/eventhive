"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  MapPin, 
  ArrowRight, 
  Plus, 
  KeyRound, 
  UserCircle2, 
  Users,
  Calendar,
  Search 
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Tabs, Dialog } from "@ark-ui/react";
import { useSession } from "next-auth/react";
import { useUser } from "@/context/UserContext";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isVirtual: boolean;
  topics?: string[];
  createdBy?: {
    _id: string;
    name: string;
  };
  attendees?: any[];
}

export default function EventsPage() {
  const router = useRouter();
  const { data: session } = useSession(); // Changed from Clerk
  const { userData } = useUser(); // Added for more complete user data
  const userId = userData?._id || userData?.id || session?.user?.id; // Use any available ID


  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [eventCode, setEventCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const navigateToCreateEvent = () => {
    router.push('/dashboard/events/create');
  };

  const navigateToEventDetail = (eventId: string) => {
    router.push(`/dashboard/events/${eventId}`);
  };

  const handleJoinByCode = async () => {
    if (!eventCode.trim()) {
      setJoinError("Please enter an event code");
      return;
    }
    
    setJoinLoading(true);
    setJoinError("");
    
    try {
      const response = await fetch('/api/events/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventCode }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setJoinError(data.message || "Failed to join event");
        return;
      }
      
      // Success - navigate to the event page
      router.push(`/dashboard/events/${data.eventId}`);
      window.toast?.("Successfully joined event!");
    } catch (error) {
      setJoinError("An error occurred. Please try again.");
    } finally {
      setJoinLoading(false);
    }
  };
  
  // Categorize events into ongoing, upcoming, and completed
  const categorizeEvents = (eventList: Event[]) => {
    const now = new Date();
    
    return {
      ongoing: eventList.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // If not today, it's not ongoing
        if (eventDate.getTime() !== today.getTime()) return false;
        
        const [startHour, startMinute] = event.startTime.split(':').map(Number);
        const [endHour, endMinute] = event.endTime.split(':').map(Number);
        
        const startDateTime = new Date(eventDate);
        startDateTime.setHours(startHour, startMinute);
        
        const endDateTime = new Date(eventDate);
        endDateTime.setHours(endHour, endMinute);
        
        return now >= startDateTime && now <= endDateTime;
      }),
      
      upcoming: eventList.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // If date is in future, it's upcoming
        if (eventDate > today) return true;
        
        // If date is today, check if it hasn't started yet
        if (eventDate.getTime() === today.getTime()) {
          const [startHour, startMinute] = event.startTime.split(':').map(Number);
          const startDateTime = new Date(eventDate);
          startDateTime.setHours(startHour, startMinute);
          
          return now < startDateTime;
        }
        
        return false;
      }),
      
      completed: eventList.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // If date is in past, it's completed
        if (eventDate < today) return true;
        
        // If date is today, check if it has ended
        if (eventDate.getTime() === today.getTime()) {
          const [endHour, endMinute] = event.endTime.split(':').map(Number);
          const endDateTime = new Date(eventDate);
          endDateTime.setHours(endHour, endMinute);
          
          return now > endDateTime;
        }
        
        return false;
      })
    };
  };

  // Filter events by search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.topics && event.topics.some(topic => 
      topic.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  // Categorize all events
  const categorizedEvents = categorizeEvents(filteredEvents);

  // Get the active list of events based on the selected tab
  const activeEventsList = categorizedEvents[activeTab as keyof typeof categorizedEvents] || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-gray-100"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setJoinDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <KeyRound className="h-4 w-4" /> 
            Join by Code
          </button>
          <button 
            onClick={navigateToCreateEvent}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" /> 
            Create Event
          </button>
        </div>
      </div>

      {/* Event statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{events.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created by You</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{events.filter(e => e.createdBy?._id === userId).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{events.filter(e => e.createdBy?._id !== userId).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{categorizedEvents.upcoming.length}</p>
        </div>
      </div>

      {/* Events Timeline Tabs */}
      <Tabs.Root value={activeTab} onValueChange={details => setActiveTab(details.value as string)}>
        <Tabs.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-6">
          <Tabs.Trigger 
            value="ongoing"
            className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-center ${
              activeTab === 'ongoing' 
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Ongoing ({categorizedEvents.ongoing.length})
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="upcoming"
            className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-center ${
              activeTab === 'upcoming' 
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Upcoming ({categorizedEvents.upcoming.length})
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="completed"
            className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-center ${
              activeTab === 'completed' 
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Completed ({categorizedEvents.completed.length})
          </Tabs.Trigger>
        </Tabs.List>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {activeEventsList.length > 0 ? (
            activeEventsList.map((event) => {
              const isCreatedByUser = event.createdBy?._id === userId;
              
              return (
                <div 
                  key={event._id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isCreatedByUser 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {isCreatedByUser ? (
                          <>
                            <UserCircle2 className="h-3 w-3 mr-1" />
                            <span>Created by You</span>
                          </>
                        ) : (
                          <>
                            <Users className="h-3 w-3 mr-1" />
                            <span>Joined</span>
                          </>
                        )}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-4">
                      {event.topics && event.topics.slice(0, 3).map((topic, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <button 
                      className="w-full flex justify-between items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200" 
                      onClick={() => navigateToEventDetail(event._id)}
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
                  <Calendar className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No {activeTab} events</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {activeTab === 'ongoing' && "There are no events happening right now."}
                  {activeTab === 'upcoming' && "You don't have any upcoming events scheduled."}
                  {activeTab === 'completed' && "You haven't attended any events yet."}
                </p>
                <div className="mt-6">
                  <button
                    onClick={navigateToCreateEvent}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-900"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Tabs.Root>

      {/* Join Event Dialog */}
      <Dialog.Root open={joinDialogOpen} onOpenChange={(details) => setJoinDialogOpen(details.open)}>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed z-50 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
          <div className="mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
              Join Event by Code
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter the event code provided by the organizer
            </Dialog.Description>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="eventCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Code
              </label>
              <input
                id="eventCode"
                type="text"
                placeholder="Enter event code"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {joinError && (
              <p className="text-sm text-red-500 dark:text-red-400">{joinError}</p>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800"
              disabled={joinLoading}
              onClick={() => setJoinDialogOpen(false)}
            >
              Cancel
            </button>
            <button 
              onClick={handleJoinByCode}
              disabled={joinLoading}
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800"
            >
              {joinLoading ? "Joining..." : "Join Event"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}