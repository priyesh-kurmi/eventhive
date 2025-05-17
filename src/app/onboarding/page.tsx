'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileForm from "@/components/onboarding/ProfileForm";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <ProfileForm 
        userId={session?.user?.id || ''} 
        isMinimal={true} 
        requiredFields={['name']} 
      />
    </div>
  );
}