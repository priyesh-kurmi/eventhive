import { MessageSquare, Users, Search, Plus } from "lucide-react";

export default function DiscussionsPage() {
  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Discussions
          </h1>
          <p className="mt-1 text-gray-500">
            Group conversations by topics and interests
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search discussions"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Plus className="h-4 w-4 mr-2" />
            New Discussion
          </button>
        </div>
      </header>
      
      {/* Discussion Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          All
        </button>
        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Web Development
        </button>
        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          AI & ML
        </button>
        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Product Management
        </button>
        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Career Growth
        </button>
      </div>
      
      {/* Discussion List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-4 py-5 sm:px-6 border-b border-gray-200 last:border-0">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-indigo-600 hover:text-indigo-700">
                    <a href="#">Best practices for scaling React applications</a>
                  </h3>
                  <p className="text-sm text-gray-500">
                    {i === 1 ? 'Just now' : `${i} days ago`}
                  </p>
                </div>
                
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  Let's discuss strategies for managing state, optimizing performance, and organizing code in large React applications. What approaches have worked well for your team?
                </p>
                
                <div className="mt-2 flex items-center">
                  <div className="flex-shrink-0 flex -space-x-1">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-6 w-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        {j}
                      </div>
                    ))}
                  </div>
                  <div className="ml-2 flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{i * 8} participants</span>
                  </div>
                  <div className="ml-6 text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4 mr-1 inline-block" />
                    <span>{i * 5} replies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}