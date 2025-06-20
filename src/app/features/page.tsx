import Link from "next/link";
import { CalendarDays, Users, MessageCircle, QrCode, Search, Globe, Clock, MapPin, Star, CheckCircle, TrendingUp, Zap, Heart, Shield, Bell, BarChart3 } from "lucide-react";

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 opacity-80">
        <div className="w-full h-full bg-gradient-to-br from-indigo-100/60 to-purple-100/60 dark:from-gray-800/60 dark:to-indigo-900/60 animate-gradient"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/40 to-purple-400/40 rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-full blur-3xl animate-pulse-soft animation-delay-1000"></div>
          <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-gradient-to-r from-blue-400/40 to-indigo-400/40 rounded-full blur-3xl animate-pulse-soft animation-delay-2000"></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_300px,#3730a3,transparent)] opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text-animated">EventHive</span>
          </Link>          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">Home</Link>
            <Link href="/features" className="text-indigo-600 dark:text-indigo-400 font-medium">Features</Link>
            <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">Pricing</Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">About Us</Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">Contact Us</Link>
            <Link href="/sign-in" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">Sign In</Link>
          </div>
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm">Home</Link>
            <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm">Pricing</Link>
            <Link href="/sign-in" className="px-3 py-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
            Powerful Features for
            <span className="gradient-text-animated block">Modern Event Management</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12">
            Discover all the tools and capabilities that make EventHive the ultimate platform for creating, managing, and attending events.
          </p>
        </header>

        {/* Core Features */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to create amazing events and connect with people.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CalendarDays,
                title: "Smart Event Creation",
                description: "Create professional events with our intuitive builder. Set dates, manage capacity, add descriptions, and customize every detail.",
                color: "from-indigo-500 to-indigo-600"
              },
              {
                icon: QrCode,
                title: "Easy Event Joining",
                description: "Join events instantly with unique QR codes or browse public events. No complicated registration processes.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: MessageCircle,
                title: "Real-time Chat",
                description: "Engage with attendees through event-specific chat rooms. Share updates, network, and build connections.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Users,
                title: "Network & Connect",
                description: "Connect with fellow attendees, exchange contacts, and build lasting professional relationships.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Create both online and in-person events. Connect with people worldwide or in your local community.",
                color: "from-teal-500 to-teal-600"
              },
              {
                icon: Search,
                title: "Advanced Discovery",
                description: "Find events by category, location, date, or interests. Never miss out on amazing experiences.",
                color: "from-orange-500 to-orange-600"
              }
            ].map((feature, index) => (
              <div key={index} className="group glass-morphism p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Advanced Features */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Advanced Capabilities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional-grade tools for serious event organizers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: BarChart3,
                  title: "Analytics & Insights",
                  description: "Track attendance, engagement metrics, and event performance with detailed analytics dashboards."
                },
                {
                  icon: Bell,
                  title: "Smart Notifications",
                  description: "Automated reminders, updates, and notifications keep attendees informed and engaged."
                },
                {
                  icon: Shield,
                  title: "Privacy & Security",
                  description: "Enterprise-grade security with privacy controls for both organizers and attendees."
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Optimized performance ensures smooth experiences even with thousands of attendees."
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl p-8 border border-indigo-200 dark:border-indigo-800">
              <div className="space-y-6">
                <div className="glass-morphism rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Event Dashboard</h4>
                      <p className="text-sm text-gray-500">Real-time insights</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Attendees</span>
                      <span className="font-semibold text-gray-900 dark:text-white">247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Check-ins</span>
                      <span className="font-semibold text-green-600">189</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</span>
                      <span className="font-semibold text-indigo-600">92%</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Live analytics preview</p>
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
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Experience These Features?
              </h2>
              <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Join thousands of event creators who are already using EventHive's powerful features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/sign-up" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started Free
                  <CalendarDays className="w-5 h-5" />
                </Link>
                <Link 
                  href="/pricing" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
                >
                  View Pricing
                  <TrendingUp className="w-5 h-5" />
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
