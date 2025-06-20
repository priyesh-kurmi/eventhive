import Link from "next/link";
import { CalendarDays, Check, Star, Users, Zap, Crown, Heart } from "lucide-react";

export default function Pricing() {
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
            <Link href="/pricing" className="text-indigo-600 dark:text-indigo-400 font-medium">Pricing</Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">About Us</Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">Contact Us</Link>
            <Link href="/sign-in" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-300 hover:scale-105">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
            Simple, Transparent
            <span className="gradient-text-animated block">Pricing</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12">
            Choose the perfect plan for your event needs. Start free and scale as you grow.
          </p>
        </header>

        {/* Pricing Plans */}
        <section className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="glass-morphism p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">$0</div>
                <p className="text-gray-600 dark:text-gray-300">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Up to 3 events per month",
                  "50 attendees per event",
                  "Basic event management",
                  "Email support",
                  "Standard templates"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/sign-up" 
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="glass-morphism p-8 rounded-3xl shadow-xl border-2 border-indigo-500/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  $19
                  <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">For growing event organizers</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited events",
                  "500 attendees per event",
                  "Advanced analytics",
                  "Priority support",
                  "Custom branding",
                  "Event chat & networking",
                  "QR code generation"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/sign-up" 
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="glass-morphism p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  $99
                  <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">For large organizations</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited everything",
                  "Unlimited attendees",
                  "White-label solution",
                  "24/7 dedicated support",
                  "API access",
                  "Advanced integrations",
                  "Custom development"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/contact" 
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Compare Plans
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See what's included in each plan to choose the right one for your needs.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full glass-morphism rounded-3xl overflow-hidden">
              <thead className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <tr>
                  <th className="text-left p-6 text-gray-900 dark:text-white font-semibold">Features</th>
                  <th className="text-center p-6 text-gray-900 dark:text-white font-semibold">Free</th>
                  <th className="text-center p-6 text-gray-900 dark:text-white font-semibold">Pro</th>
                  <th className="text-center p-6 text-gray-900 dark:text-white font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { feature: "Events per month", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
                  { feature: "Attendees per event", free: "50", pro: "500", enterprise: "Unlimited" },
                  { feature: "Event analytics", free: "Basic", pro: "Advanced", enterprise: "Advanced" },
                  { feature: "Custom branding", free: "❌", pro: "✅", enterprise: "✅" },
                  { feature: "Priority support", free: "❌", pro: "✅", enterprise: "✅" },
                  { feature: "API access", free: "❌", pro: "❌", enterprise: "✅" },
                  { feature: "White-label", free: "❌", pro: "❌", enterprise: "✅" }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 text-gray-900 dark:text-white font-medium">{row.feature}</td>
                    <td className="p-6 text-center text-gray-600 dark:text-gray-300">{row.free}</td>
                    <td className="p-6 text-center text-gray-600 dark:text-gray-300">{row.pro}</td>
                    <td className="p-6 text-center text-gray-600 dark:text-gray-300">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle."
              },
              {
                question: "Is there a free trial for paid plans?",
                answer: "Yes, we offer a 14-day free trial for all paid plans. No credit card required to start."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers."
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Absolutely. You can cancel your subscription at any time. Your access continues until the end of your billing period."
              }
            ].map((faq, index) => (
              <div key={index} className="glass-morphism p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Join thousands of event creators who trust EventHive for their events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/sign-up" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start Free Trial
                  <Zap className="w-5 h-5" />
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
                >
                  Contact Sales
                  <Users className="w-5 h-5" />
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
