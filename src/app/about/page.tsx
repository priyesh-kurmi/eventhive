import Link from "next/link";
import { CalendarDays, Users, Target, Heart, Lightbulb, Globe, Award, TrendingUp } from "lucide-react";

export default function About() {
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
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">Home</Link>
            <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">Features</Link>
            <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">Pricing</Link>
            <Link href="/about" className="text-indigo-600 dark:text-indigo-400 font-medium">About Us</Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">Contact Us</Link>
            <Link href="/sign-in" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
            About
            <span className="gradient-text-animated block">EventHive</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12">
            We're on a mission to revolutionize how people create, discover, and connect through events. 
            Making meaningful connections has never been easier.
          </p>
        </header>

        {/* Our Story */}
        <section className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                EventHive was born from a simple observation: organizing and discovering great events shouldn't be complicated. 
                In 2024, our founders experienced firsthand the frustration of using outdated, complex event management tools.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                We believed there had to be a better way. A platform that was intuitive, beautiful, and focused on what really 
                matters - bringing people together. That's when EventHive was created.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Today, we're proud to serve thousands of event creators and attendees worldwide, facilitating millions of 
                meaningful connections through our platform.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl p-8 border border-indigo-200 dark:border-indigo-800">
              <div className="space-y-6">
                <div className="glass-morphism rounded-2xl p-6 shadow-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600 mb-2">10K+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Events Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">99%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission & Values */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission & Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything we do is guided by our core mission and values.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description: "To make event creation and discovery so simple and enjoyable that anyone can bring people together for meaningful experiences.",
                color: "from-indigo-500 to-indigo-600"
              },
              {
                icon: Heart,
                title: "Connection First",
                description: "We believe that human connections are at the heart of every great event. Our platform is designed to foster meaningful relationships.",
                color: "from-red-500 to-red-600"
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description: "We continuously innovate to provide cutting-edge solutions that make event management effortless and engaging.",
                color: "from-yellow-500 to-yellow-600"
              },
              {
                icon: Users,
                title: "Community",
                description: "We're building a global community of event creators and attendees who share our passion for bringing people together.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: Globe,
                title: "Accessibility",
                description: "Events should be accessible to everyone, everywhere. We're committed to breaking down barriers to event participation.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We strive for excellence in everything we do, from our user experience to our customer support.",
                color: "from-blue-500 to-blue-600"
              }
            ].map((value, index) => (
              <div key={index} className="group glass-morphism p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're a passionate team of designers, developers, and event enthusiasts from around the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Co-Founder",
                description: "Former event planner with 10+ years of experience. Passionate about connecting people through technology.",
                avatar: "SJ"
              },
              {
                name: "Michael Chen",
                role: "CTO & Co-Founder",
                description: "Full-stack developer and tech visionary. Expert in building scalable platforms that millions love.",
                avatar: "MC"
              },
              {
                name: "Emily Rodriguez",
                role: "Head of Design",
                description: "Award-winning UX designer focused on creating beautiful, intuitive experiences for event management.",
                avatar: "ER"
              },
              {
                name: "David Kim",
                role: "VP of Engineering",
                description: "Software architect with expertise in distributed systems and real-time communication platforms.",
                avatar: "DK"
              },
              {
                name: "Lisa Thompson",
                role: "Head of Marketing",
                description: "Growth expert and community builder. Helps event creators reach their audiences effectively.",
                avatar: "LT"
              },
              {
                name: "James Wilson",
                role: "Customer Success",
                description: "Dedicated to ensuring every EventHive user has an amazing experience with our platform.",
                avatar: "JW"
              }
            ].map((member, index) => (
              <div key={index} className="group glass-morphism p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">{member.avatar}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join Us Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Join Our Journey
              </h2>
              <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                We're always looking for talented individuals who share our passion for connecting people through events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Join Our Team
                  <Users className="w-5 h-5" />
                </Link>
                <Link 
                  href="/sign-up" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
                >
                  Start Creating Events
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
