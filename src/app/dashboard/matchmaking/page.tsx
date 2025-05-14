import { Users, Filter, Sparkles } from "lucide-react";

export default function MatchmakingPage() {
  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            AI Matchmaking
          </h1>
          <p className="mt-1 text-gray-500">
            Find people with similar interests and goals
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="h-4 w-4 mr-2" />
            Filter Matches
          </button>
        </div>
      </header>
      
      {/* Match cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <Users className="h-6 w-6" />
                </div>
                
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">
                    Alex Johnson
                  </h3>
                  <p className="text-sm text-gray-500">
                    Full Stack Developer at TechCorp
                  </p>
                </div>
                
                <div className="ml-auto">
                  <div className="flex items-center text-yellow-500">
                    <Sparkles className="h-5 w-5 mr-1" />
                    <span className="font-medium text-sm">92%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  Passionate about React, Node.js, and building scalable applications. Looking to connect and collaborate on open-source projects.
                </p>
              </div>
              
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    React
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Node.js
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    TypeScript
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Connect
                </button>
                <button className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}