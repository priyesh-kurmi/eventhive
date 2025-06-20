import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle, Heart, Users, Sparkles, CheckCircle } from "lucide-react";

export default function ContactUs() {
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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text-animated">EventHive</span>
            </Link>
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
              className="text-indigo-600 dark:text-indigo-400 font-semibold transition-all duration-300 hover:scale-105"
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
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link 
              href="/sign-in" 
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="py-20 text-center">
          <div className="mb-8 animate-slide-in-up">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-morphism rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6 border border-indigo-200/30 dark:border-indigo-700/30 hover:scale-105 transition-transform duration-300">
              <MessageCircle className="w-4 h-4 animate-pulse" />
              Get In Touch
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight animate-slide-in-up animation-delay-200">
            Contact{' '}
            <span className="gradient-text-animated">
              EventHive
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed animate-slide-in-up animation-delay-300">
            Have questions about EventHive? Need help organizing your events? We're here to help you create amazing experiences.
          </p>
        </header>

        {/* Contact Information Cards */}
        <section className="py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="glass-morphism p-8 rounded-2xl border border-gray-200/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300 animate-slide-in-up animation-delay-400">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Email Us</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Get in touch via email for any inquiries</p>
              <a href="mailto:hello@eventhive.com" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
                hello@eventhive.com
              </a>
            </div>

            <div className="glass-morphism p-8 rounded-2xl border border-gray-200/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300 animate-slide-in-up animation-delay-500">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Call Us</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Speak directly with our support team</p>
              <a href="tel:+1-555-EVENTS" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
                +1 (555) EVENTS
              </a>
            </div>

            <div className="glass-morphism p-8 rounded-2xl border border-gray-200/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300 animate-slide-in-up animation-delay-600">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Visit Us</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Our headquarters location</p>
              <address className="text-indigo-600 dark:text-indigo-400 not-italic">
                123 Event Street<br />
                San Francisco, CA 94102
              </address>
            </div>

            <div className="glass-morphism p-8 rounded-2xl border border-gray-200/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300 animate-slide-in-up animation-delay-700">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Support Hours</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">When our team is available</p>
              <div className="text-indigo-600 dark:text-indigo-400">
                <div>Mon-Fri: 9AM - 6PM PST</div>
                <div>Weekends: 10AM - 4PM PST</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <div className="glass-morphism p-12 rounded-3xl border border-gray-200/20 dark:border-gray-700/20 animate-slide-in-up animation-delay-800">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 glass-morphism rounded-xl border border-gray-200/30 dark:border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 glass-morphism rounded-xl border border-gray-200/30 dark:border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 glass-morphism rounded-xl border border-gray-200/30 dark:border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 glass-morphism rounded-xl border border-gray-200/30 dark:border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 glass-morphism rounded-xl border border-gray-200/30 dark:border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2 mx-auto backdrop-blur-sm relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Send Message
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-in-up">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-slide-in-up animation-delay-200">
              Quick answers to common questions about EventHive.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "How do I create an account?",
                answer: "Simply click on 'Sign Up' and follow the easy registration process. You'll be up and running in minutes!"
              },
              {
                question: "Is EventHive free to use?",
                answer: "We offer a free tier for basic event management. Premium features are available with our paid plans."
              },
              {
                question: "Can I customize my event pages?",
                answer: "Absolutely! EventHive provides extensive customization options to match your brand and style."
              },
              {
                question: "How do attendees join events?",
                answer: "Attendees can join events through invitation links, QR codes, or by searching for public events on our platform."
              },
              {
                question: "Do you offer customer support?",
                answer: "Yes! We provide 24/7 customer support through email, chat, and phone for all our users."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="glass-morphism p-8 rounded-2xl border border-gray-200/20 dark:border-gray-700/20 hover:scale-105 transition-all duration-300 animate-slide-in-up"
                style={{animationDelay: `${(index + 1) * 100}ms`}}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed ml-11">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="text-center glass-morphism p-16 rounded-3xl border border-gray-200/20 dark:border-gray-700/20 animate-slide-in-up">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Create Amazing Events?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
              Join thousands of event organizers who trust EventHive to bring their communities together.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/sign-up" 
                className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2 backdrop-blur-sm relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Today
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </Link>
              <Link 
                href="/features" 
                className="group px-8 py-4 glass-morphism text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-300"
              >
                <span className="flex items-center gap-2">
                  Learn More
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-20 border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text-animated">EventHive</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Creating connections through amazing events.
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
              <Link href="/features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
              <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</Link>
              <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200/20 dark:border-gray-700/20">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2024 EventHive. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
