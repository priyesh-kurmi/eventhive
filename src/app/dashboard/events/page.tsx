// UPDATE FILE: c:\Users\kpriy\OneDrive\Desktop\event\event-hive\src\app\dashboard\events\page.tsx
"use client";

import { useEffect, useState } from "react";
import { Calendar, Filter, Plus, KeyRound } from "lucide-react";
import Link from "next/link";
import EventCard from "@/components/events/EventCard";
import JoinByCodeModal from "@/components/events/JoinByCodeModal";

type EventType = {
  _id: string;
  title: string;
  description: string;
  date: string;
  isVirtual: boolean;
  location: string;
  topics: string[];
  attendees: any[];
  createdBy: {
    _id: string;
    name: string;
    avatar: string;
  };
};

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinByCodeModalOpen, setJoinByCodeModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/events?type=${activeTab}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch events");
        }

        setEvents(data.events || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [activeTab]);

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Events
          </h1>
          <p className="mt-1 text-gray-500">
            Discover and manage networking events
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
          <button 
            onClick={() => setJoinByCodeModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <KeyRound className="h-4 w-4 mr-2" />
            Join by Code
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <Link
            href="/dashboard/events/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </div>
      </header>
      
      {/* Updated Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`${
              activeTab === "upcoming"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`${
              activeTab === "past"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Past
          </button>
          <button
            onClick={() => setActiveTab("myEvents")}
            className={`${
              activeTab === "myEvents"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Created by Me
          </button>
          <button
            onClick={() => setActiveTab("joinedEvents")}
            className={`${
              activeTab === "joinedEvents"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Joined
          </button>
        </nav>
      </div>
      
      {/* Event Listings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : events.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No events found.</p>
            {activeTab === "upcoming" && (
              <p className="mt-2">
                Join an event with a code or <Link href="/dashboard/events/create" className="text-indigo-600 hover:text-indigo-800">create your own</Link>.
              </p>
            )}
          </div>
        ) : (
          events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))
        )}
      </div>

      {/* Join by Code Modal */}
      <JoinByCodeModal 
        isOpen={joinByCodeModalOpen}
        onClose={() => setJoinByCodeModalOpen(false)}
      />
    </div>
  );
}