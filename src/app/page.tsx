import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Users, ArrowRight, Globe } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  
  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <header className="py-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
          Connect at Events with <span className="text-indigo-600">EventHive</span>
        </h1>
        <p className="text-xl text-gray-600 w-full mx-auto mb-8">
          AI-powered networking platform that connects event attendees with similar interests and goals
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/sign-up" 
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
          >
            Get Started
          </Link>
          <Link 
            href="/sign-in" 
            className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-xl border border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
          >
            Sign In
          </Link>
        </div>
      </header>

      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <CalendarDays className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
            <p className="text-gray-600">
              Find networking events in your industry or area of interest
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect with Peers</h3>
            <p className="text-gray-600">
              Meet like-minded professionals and expand your network
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Virtual & In-Person</h3>
            <p className="text-gray-600">
              Participate in both physical and online networking events
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            EventHive makes networking at events simpler and more effective
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Create Profile", description: "Set up your professional profile with your interests and goals" },
            { step: "2", title: "Join Events", description: "Discover and register for networking events in your field" },
            { step: "3", title: "Connect", description: "Meet attendees with similar interests at events" },
            { step: "4", title: "Follow Up", description: "Continue conversations with your new connections" }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/sign-up" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
          >
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-200">
        <div className="text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} EventHive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}