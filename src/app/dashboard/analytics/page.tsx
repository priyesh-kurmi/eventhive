import { BarChart, Download, Users, MessageCircle, Calendar, Clock } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Analytics
          </h1>
          <p className="mt-1 text-gray-500">
            Track your networking metrics and engagement
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </header>
      
      {/* Time Period Selector */}
      <div className="flex mb-6 overflow-x-auto">
        <button className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg mr-2">
          Last 7 Days
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg mr-2 border border-gray-300">
          Last 30 Days
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg mr-2 border border-gray-300">
          Last 90 Days
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-300">
          Custom Range
        </button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Connections</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">42</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Messages Sent</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">128</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <MessageCircle className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Events Attended</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">8</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">2h 14m</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-medium text-gray-700">Engagement Overview</h2>
          <div>
            <select className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option>Connections</option>
              <option>Messages</option>
              <option>Event Participation</option>
            </select>
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
          <div className="text-center p-6">
            <BarChart className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Chart visualization placeholder</p>
          </div>
        </div>
      </div>
      
      {/* Activity Log */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-4 py-4 sm:px-6 border-b border-gray-200 last:border-0">
            <div className="flex items-center">
              <div className="min-w-0 flex-1 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    {i % 3 === 0 && <Users className="h-5 w-5 text-indigo-600" />}
                    {i % 3 === 1 && <MessageCircle className="h-5 w-5 text-indigo-600" />}
                    {i % 3 === 2 && <Calendar className="h-5 w-5 text-indigo-600" />}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {i % 3 === 0 && 'Connected with Jane Smith'}
                    {i % 3 === 1 && 'Sent a message to Michael Johnson'}
                    {i % 3 === 2 && 'Registered for Tech Conference 2025'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {i === 1 ? 'Just now' : `${i} hours ago`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}