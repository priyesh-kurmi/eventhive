import { Calendar, Filter, Plus } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
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
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <a
            href="#"
            className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Upcoming
          </a>
          <a
            href="#"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Past
          </a>
          <a
            href="#"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            My Events
          </a>
        </nav>
      </div>
      
      {/* Event Listings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-4 py-5 sm:px-6 border-b border-gray-200 last:border-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-gray-900">
                      Tech Conference {i} - Networking Event
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Virtual • May {i + 20}, 2025 • 10:00 AM - 4:00 PM
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                        AI & ML
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                        Web Development
                      </span>
                      <span>+120 attendees</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-6 flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}