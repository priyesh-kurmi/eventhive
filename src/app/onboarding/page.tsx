import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/onboarding/ProfileForm";

export default async function OnboardingPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome to EventHive</h1>
        <p className="text-gray-600 mt-2">
          Let's set up your basic profile to help you connect with like-minded attendees
        </p>
      </div>
      
      <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h2 className="font-medium text-blue-800 mb-1">Quick Start</h2>
        <p className="text-sm text-blue-700">
          We only need a few details to get you started. You can complete your full profile later in settings.
        </p>
      </div>
      
      <ProfileForm 
        clerkId={userId} 
        isMinimal={true} 
        requiredFields={['name']} 
      />
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>You'll be able to add more details to your profile later in Settings</p>
      </div>
    </div>
  );
}