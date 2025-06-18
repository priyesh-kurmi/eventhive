import Link from "next/link";
import { CalendarDays, Users, ArrowRight, Plus, Search, Sparkles, MessageCircle, Globe, Star, CheckCircle, Clock, MapPin, QrCode } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-60">
        {/* Base gradient */}
        <div className="w-full h-full bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-gray-800/50 dark:to-indigo-900/50"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Event Calendar Icon - Top Left */}
          <div className="absolute top-20 left-16 animate-float animation-delay-500">
            <div className="w-12 h-12 bg-indigo-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-indigo-300/30">
              <CalendarDays className="w-6 h-6 text-indigo-500/60" />
            </div>
          </div>
          
          {/* Users/People Connection - Top Right */}
          <div className="absolute top-32 right-16 animate-float animation-delay-1500">
            <div className="w-14 h-10 bg-purple-400/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-300/30">
              <Users className="w-7 h-7 text-purple-500/60" />
            </div>
          </div>
          
          {/* Message/Chat Bubble - Bottom Left */}
          <div className="absolute bottom-32 left-20 animate-float animation-delay-1000">
            <div className="relative">
              <div className="w-10 h-10 bg-pink-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-pink-300/30">
                <MessageCircle className="w-5 h-5 text-pink-500/60" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400/60 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* QR Code for Event Joining - Middle Right */}
          <div className="absolute top-1/2 right-12 animate-float animation-delay-2000">
            <div className="w-10 h-10 bg-blue-400/20 rounded border border-blue-300/30 backdrop-blur-sm flex items-center justify-center">
              <QrCode className="w-5 h-5 text-blue-500/60" />
            </div>
          </div>
          
          {/* Plus Icon for Event Creation - Bottom Right */}
          <div className="absolute bottom-40 right-20 animate-float animation-delay-2500">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full border border-indigo-400/40 backdrop-blur-sm flex items-center justify-center">
              <Plus className="w-6 h-6 text-indigo-500/60" />
            </div>
          </div>
          
          {/* Mini Event Card - Middle Left */}
          <div className="absolute top-1/2 left-12 animate-float-slow animation-delay-1800">
            <div className="w-16 h-12 bg-white/15 dark:bg-gray-800/25 rounded-lg border border-green-200/30 backdrop-blur-sm p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="w-2 h-2 bg-green-400/60 rounded-full animate-pulse"></div>
                <div className="text-[8px] text-green-600/50 font-medium">LIVE</div>
              </div>
              <div className="w-full h-1 bg-green-300/40 rounded mb-1"></div>
              <div className="w-2/3 h-1 bg-green-300/30 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_300px,#3730a3,transparent)] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">EventHive</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/sign-in" 
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="py-20 text-center relative">
          {/* Additional floating elements specifically for hero */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Event ticket floating - Far Left */}
            <div className="absolute top-40 left-8 animate-float-slow animation-delay-800">
              <div className="w-18 h-12 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-lg border-l-4 border-indigo-400/40 backdrop-blur-sm flex items-center justify-center">
                <div className="text-xs text-indigo-600/60 font-mono">EVENT</div>
              </div>
            </div>
            
            {/* Connection network visualization - Far Right */}
            <div className="absolute bottom-48 right-8 animate-float animation-delay-1200">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-400/50 rounded-full animate-pulse"></div>
                <div className="w-6 h-0.5 bg-gradient-to-r from-green-400/40 to-purple-400/40"></div>
                <div className="w-4 h-4 bg-purple-400/50 rounded-full animate-pulse animation-delay-500"></div>
              </div>
            </div>
            
            {/* Search/Join indicator - Left Side */}
            <div className="absolute top-80 left-6 animate-float animation-delay-1600">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg border border-purple-400/30 backdrop-blur-sm flex items-center justify-center">
                <Search className="w-5 h-5 text-purple-500/60" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6 backdrop-blur-sm border border-indigo-200/30 dark:border-indigo-700/30">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Event Management Made Simple
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 leading-tight relative z-10">
            Create & Join Events with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              EventHive
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed relative z-10">
            The ultimate platform for organizing memorable events and discovering amazing experiences. Create, manage, and join events effortlessly while connecting with fellow attendees.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 relative z-10">
            <Link 
              href="/sign-up" 
              className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2 backdrop-blur-sm"
            >
              Start Creating Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/sign-in" 
              className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl"
            >
              Explore Events
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400 relative z-10">
            <div className="flex items-center gap-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-yellow-500 fill-current animate-pulse" />
              <span className="font-medium">1000+ events created</span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-500 animate-pulse animation-delay-500" />
              <span className="font-medium">5000+ happy attendees</span>
            </div>
          </div>
        </header>

        {/* Features Grid */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose EventHive?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to create amazing events and join exciting experiences, all in one platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Easy Event Creation</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Create professional events in minutes with our intuitive builder. Add details, set dates, manage capacity, and share with ease.
              </p>
            </div>
            
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Discover & Join</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Find exciting events near you or join with unique codes. Browse categories, filter by interests, and never miss out on great experiences.
              </p>
            </div>
            
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Connect & Chat</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Engage with attendees through real-time event chat. Share updates, network with participants, and build lasting connections.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get started with EventHive in just a few simple steps and transform your event experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                step: "1", 
                title: "Sign Up & Profile", 
                description: "Create your account and set up your profile with interests and preferences for better event recommendations.",
                icon: Users,
                color: "from-blue-500 to-blue-600"
              },
              { 
                step: "2", 
                title: "Create or Browse", 
                description: "Either create your own event with all the details or browse exciting events created by others in your area.",
                icon: Plus,
                color: "from-indigo-500 to-indigo-600"
              },
              { 
                step: "3", 
                title: "Join & Participate", 
                description: "Join events with a click or unique code. Get event updates and start chatting with fellow attendees.",
                icon: QrCode,
                color: "from-purple-500 to-purple-600"
              },
              { 
                step: "4", 
                title: "Connect & Network", 
                description: "Meet amazing people at events, exchange contacts, and build meaningful relationships that last beyond the event.",
                icon: MessageCircle,
                color: "from-green-500 to-green-600"
              }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-10 h-10" />
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-bold mb-2">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced tools to make your events successful and memorable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Smart Event Management</h3>
                  <p className="text-gray-600 dark:text-gray-300">Complete event lifecycle management with RSVP tracking, capacity limits, and automated reminders.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Easy Joining</h3>
                  <p className="text-gray-600 dark:text-gray-300">Join events instantly with unique codes or browse public events. No complicated registration processes.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Global Reach</h3>
                  <p className="text-gray-600 dark:text-gray-300">Create online or in-person events. Connect with people worldwide or in your local community.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl p-8 border border-indigo-200 dark:border-indigo-800">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Tech Meetup 2025</h4>
                      <p className="text-sm text-gray-500">by EventHive Team</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Tomorrow 6:00 PM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Online</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">Technology</span>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">Networking</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Real-time event preview</p>
                  <div className="flex justify-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Amazing Events?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of event creators and attendees who are building connections and memorable experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/sign-up" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Creating Events
                <Plus className="w-5 h-5" />
              </Link>
              <Link 
                href="/sign-in" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-indigo-600 transition-all"
              >
                Browse Events
                <Search className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">EventHive</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} EventHive. All rights reserved. Built with ❤️ for amazing events.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}