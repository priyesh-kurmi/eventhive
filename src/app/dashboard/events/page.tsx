'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";
import { Clock, MapPin, ArrowRight, Plus, KeyRound, UserCircle2, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isVirtual: boolean;
  topics: string[];
  createdBy: {
    _id: string;
    name: string;
  };
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [eventCode, setEventCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch events");
        }

        setEvents(data.events || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const navigateToEventDetail = (eventId: string) => {
    router.push(`/dashboard/events/${eventId}`);
  };

  const navigateToCreateEvent = () => {
    router.push('/dashboard/events/create');
  };

  const handleJoinByCode = async () => {
    if (!eventCode.trim()) {
      setJoinError("Event code is required");
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
        body: JSON.stringify({ code: eventCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join event");
      }

      // Refresh events list
      const eventsResponse = await fetch('/api/events');
      const eventsData = await eventsResponse.json();
      setEvents(eventsData.events || []);

      setJoinDialogOpen(false);
      setEventCode("");
      
      // Navigate to event detail page
      router.push(`/dashboard/events/${data.event._id}`);
    } catch (error) {
      console.error('Error joining event:', error);
      setJoinError(error instanceof Error ? error.message : "Failed to join event");
    } finally {
      setJoinLoading(false);
    }
  };

  // Helper function to categorize events
  const categorizeEvents = (eventList: Event[]) => {
    const now = new Date();
    
    return {
      ongoing: eventList.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Check if event is today
        if (eventDate.getTime() === today.getTime()) {
          // Parse event times
          const [startHour, startMinute] = event.startTime.split(':').map(Number);
          const [endHour, endMinute] = event.endTime.split(':').map(Number);
          
          // Create complete start and end datetime objects
          const startDateTime = new Date(eventDate);
          startDateTime.setHours(startHour, startMinute);
          
          const endDateTime = new Date(eventDate);
          endDateTime.setHours(endHour, endMinute);
          
          // Ongoing if current time is between start and end times
          return now >= startDateTime && now <= endDateTime;
        }
        return false;
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

  // Categorize all events
  const categorizedEvents = categorizeEvents(events);

  // Event card component with ownership badge
  const EventCard = ({ event }: { event: Event }) => {
    const isCreatedByUser = event.createdBy?._id === userId;
    
    return (
      <Card className="h-full">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <Badge 
              variant={isCreatedByUser ? "default" : "secondary"}
              className="ml-2 flex items-center gap-1"
            >
              {isCreatedByUser ? (
                <>
                  <UserCircle2 className="h-3 w-3" />
                  <span>Created by You</span>
                </>
              ) : (
                <>
                  <Users className="h-3 w-3" />
                  <span>Joined</span>
                </>
              )}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {event.description}
          </p>
          
          <div className="flex items-center mt-4 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatDate(event.date)} • {event.startTime} - {event.endTime}</span>
          </div>
          
          <div className="flex items-center mt-2 text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-4">
            {event.topics && event.topics.slice(0, 3).map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="ghost" 
            className="w-full justify-between" 
            onClick={() => navigateToEventDetail(event._id)}
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading events...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => setJoinDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <KeyRound className="h-4 w-4" /> 
            Join by Code
          </Button>
          <Button 
            onClick={navigateToCreateEvent}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> 
            Create Event
          </Button>
        </div>
      </div>

      {/* Event statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-muted/40">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground">Total Events</h3>
            <p className="text-2xl font-bold">{events.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground">Created by You</h3>
            <p className="text-2xl font-bold">{events.filter(e => e.createdBy?._id === userId).length}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground">Joined</h3>
            <p className="text-2xl font-bold">{events.filter(e => e.createdBy?._id !== userId).length}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground">Upcoming</h3>
            <p className="text-2xl font-bold">{categorizedEvents.upcoming.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Events Timeline Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ongoing">
            Ongoing ({categorizedEvents.ongoing.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({categorizedEvents.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({categorizedEvents.completed.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ongoing" className="mt-6">
          {categorizedEvents.ongoing.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categorizedEvents.ongoing.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4">
              No ongoing events available.
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          {categorizedEvents.upcoming.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categorizedEvents.upcoming.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4">
              No upcoming events available.
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {categorizedEvents.completed.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categorizedEvents.completed.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4">
              No completed events available.
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* Join by Code Dialog */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Event by Code</DialogTitle>
            <DialogDescription>
              Enter the event code provided by the event organizer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventCode" className="text-right col-span-1">
                Code
              </Label>
              <Input
                id="eventCode"
                placeholder="Enter event code"
                value={eventCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventCode(e.target.value)}
                className="col-span-3"
              />
            </div>
            {joinError && (
              <p className="text-sm text-red-500">{joinError}</p>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setJoinDialogOpen(false)}
              disabled={joinLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleJoinByCode}
              disabled={joinLoading}
            >
              {joinLoading ? "Joining..." : "Join Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}