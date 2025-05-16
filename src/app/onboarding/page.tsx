import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/onboarding/ProfileForm";

export default async function OnboardingPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <ProfileForm 
        clerkId={userId} 
        isMinimal={true} 
        requiredFields={['name']} 
      />
    </div>
  );
}