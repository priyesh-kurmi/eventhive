"use client";

import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    description: string;
    date: string;
    location?: string;
    isVirtual?: boolean;
    topics: string[];
    attendees: any[];
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 last:border-0">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-indigo-700" />
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-gray-900">
                {event.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {event.isVirtual ? 'Virtual' : event.location} • {formatDate(event.date)}
              </p>
              <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-2">
                {event.topics.map((topic, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {topic}
                  </span>
                ))}
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {event.attendees.length} attendees
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-6 flex-shrink-0">
          <Link
            href={`/dashboard/events/${event._id}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}