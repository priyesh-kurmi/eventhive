import Link from "next/link";
import { CalendarDays, Users, ArrowRight, Plus, Search, Sparkles, MessageCircle, Globe, Star, CheckCircle, Clock, MapPin, QrCode, Zap, Heart, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 overflow-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 opacity-80">
        {/* Dynamic base gradient with movement */}
        <div className="w-full h-full bg-gradient-to-br from-indigo-100/60 to-purple-100/60 dark:from-gray-800/60 dark:to-indigo-900/60 animate-gradient"></div>
        
        {/* Enhanced animated gradient orbs with more sophisticated movement */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/40 to-purple-400/40 rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-full blur-3xl animate-pulse-soft animation-delay-1000"></div>
          <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-gradient-to-r from-blue-400/40 to-indigo-400/40 rounded-full blur-3xl animate-pulse-soft animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/6 w-72 h-72 bg-gradient-to-r from-green-400/30 to-teal-400/30 rounded-full blur-3xl animate-pulse-soft animation-delay-1500"></div>
          <div className="absolute top-10 right-1/3 w-48 h-48 bg-gradient-to-r from-yellow-400/25 to-orange-400/25 rounded-full blur-2xl animate-pulse-soft animation-delay-2500"></div>
        </div>
        
        {/* Enhanced radial gradient overlay with better depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_300px,#3730a3,transparent)] opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_80%_200px,#7c3aed,transparent)] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 animate-slide-in-up">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text-animated">EventHive</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105"
            >
              Home
            </Link>
            <Link 
              href="/features" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105"
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </Link>
            <Link 
              href="/sign-in" 
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Link>
          </div>
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-4">
            <Link 
              href="/features" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 text-sm"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 text-sm"
            >
              Pricing
            </Link>
            <Link 
              href="/sign-in" 
              className="px-3 py-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="py-20 text-center relative">
          <div className="mb-8 animate-slide-in-up animation-delay-200">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-morphism rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6 border border-indigo-200/30 dark:border-indigo-700/30 hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Event Management Made Simple
            </div>
          </div>
          
          <h1 className="hero-title-responsive md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 leading-tight relative z-10 animate-slide-in-up animation-delay-300">
            Create & Join Events with{' '}
            <span className="gradient-text-animated">
              EventHive
            </span>
          </h1>
          
          <p className="hero-subtitle-responsive md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed relative z-10 animate-slide-in-up animation-delay-500">
            The ultimate platform for organizing memorable events and discovering amazing experiences. Create, manage, and join events effortlessly while connecting with fellow attendees.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 relative z-10 animate-slide-in-up animation-delay-700">
            <Link 
              href="/sign-up" 
              className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2 backdrop-blur-sm relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Creating Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </Link>
            <Link 
              href="/sign-in" 
              className="group px-8 py-4 glass-morphism text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-300"
            >
              <span className="flex items-center gap-2">
                Explore Events
                <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400 relative z-10 animate-slide-in-up animation-delay-1000">
            <div className="flex items-center gap-2 glass-morphism px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
              <Star className="w-5 h-5 text-yellow-500 fill-current animate-pulse" />
              <span className="font-medium">1000+ events created</span>
            </div>
            <div className="flex items-center gap-2 glass-morphism px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
              <CheckCircle className="w-5 h-5 text-green-500 animate-pulse animation-delay-500" />
              <span className="font-medium">5000+ happy attendees</span>
            </div>
            <div className="flex items-center gap-2 glass-morphism px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
              <TrendingUp className="w-5 h-5 text-indigo-500 animate-pulse animation-delay-1000" />
              <span className="font-medium">Growing fast</span>
            </div>
          </div>
        </header>

        {/* Features Grid */}
        <section className="py-20">
          <div className="text-center mb-16 animate-slide-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose EventHive?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to create amazing events and join exciting experiences, all in one platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group glass-morphism p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-in-left animation-delay-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform group-hover:animate-wiggle">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Easy Event Creation</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Create professional events in minutes with our intuitive builder. Add details, set dates, manage capacity, and share with ease.
              </p>
            </div>
            
            <div className="group glass-morphism p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-in-up animation-delay-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform group-hover:animate-wiggle">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Discover & Join</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Find exciting events near you or join with unique codes. Browse categories, filter by interests, and never miss out on great experiences.
              </p>
            </div>
            
            <div className="group glass-morphism p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-in-right animation-delay-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform group-hover:animate-wiggle">
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
          <div className="text-center mb-16 animate-slide-in-up">
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
              <div key={i} className="text-center group animate-slide-in-up" style={{ animationDelay: `${(i + 1) * 200}ms` }}>
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform group-hover:animate-wiggle`}>
                  <item.icon className="w-10 h-10" />
                </div>
                <div className="mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-bold mb-2 group-hover:scale-110 transition-transform">
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
          <div className="text-center mb-16 animate-slide-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced tools to make your events successful and memorable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in-left">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Smart Event Management</h3>
                  <p className="text-gray-600 dark:text-gray-300">Complete event lifecycle management with RSVP tracking, capacity limits, and automated reminders.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Easy Joining</h3>
                  <p className="text-gray-600 dark:text-gray-300">Join events instantly with unique codes or browse public events. No complicated registration processes.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Global Reach</h3>
                  <p className="text-gray-600 dark:text-gray-300">Create online or in-person events. Connect with people worldwide or in your local community.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl p-8 border border-indigo-200 dark:border-indigo-800 animate-slide-in-right">
              <div className="space-y-6">
                <div className="glass-morphism rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg group-hover:animate-wiggle"></div>
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
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-100"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse animation-delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden group animate-slide-in-up">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0">
              <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-8 w-1 h-1 bg-white/40 rounded-full animate-pulse animation-delay-500"></div>
              <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute bottom-12 right-6 w-2 h-2 bg-white/30 rounded-full animate-pulse animation-delay-1500"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Create Amazing Events?
              </h2>
              <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Join thousands of event creators and attendees who are building connections and memorable experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/sign-up" 
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Creating Events
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  href="/sign-in" 
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
                >
                  Browse Events
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-gray-200 dark:border-gray-700 glass-morphism">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0 group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text-animated">EventHive</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:scale-105 duration-300">Terms</Link>
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:scale-105 duration-300">Privacy</Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:scale-105 duration-300">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              &copy; {new Date().getFullYear()} EventHive. All rights reserved. Built with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> for amazing events.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}