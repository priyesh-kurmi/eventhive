import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/onboarding/ProfileForm";

export default async function OnboardingPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Set Up Your Profile</h1>
        <p className="text-gray-600 mt-2">
          Customize your profile to connect with like-minded attendees at events
        </p>
      </div>
      
      <ProfileForm clerkId={userId} />
    </div>
  );
}