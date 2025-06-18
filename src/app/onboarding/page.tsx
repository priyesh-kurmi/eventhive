'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileForm from "@/components/onboarding/ProfileForm";
import { useEffect, useState } from "react";
import { CalendarDays, Loader2, ArrowLeft } from "lucide-react";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
    // Check authentication and onboarding status
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
      return;
    }

    if (status === 'authenticated') {
      // If user is already onboarded, redirect to dashboard
      if (session?.user?.isOnboarded) {
        router.push('/dashboard');
        return;
      }
      setLoading(false);
    }
  }, [status, session, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If user is already onboarded, this page shouldn't be accessible
  if (session?.user?.isOnboarded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-gray-800/50 dark:to-indigo-900/50"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">EventHive</span>
          </div>
          <button
            onClick={() => router.push('/sign-in')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>
        </div>
      </nav>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/80 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium">
                🎉 Welcome to EventHive!
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Let's Set Up Your Profile
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Help us understand your professional background and interests so we can connect you with the right people at events.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Profile Setup</span>
                <span>Step 1 of 1</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full w-full transition-all duration-500"></div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2 max-w-2xl mx-auto">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
              {error}
            </div>
          )}          {/* Profile Form Container */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 md:p-12">
            <ProfileForm 
              userId={session?.user?.id || ''} 
              isMinimal={true} 
              requiredFields={['name']}
            />
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need help getting started?
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="mailto:support@eventhive.com" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                Contact Support
              </a>
              <a href="/help" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                View Help Center
              </a>
              <a href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}