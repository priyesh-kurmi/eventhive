import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateEventForm from "@/components/events/CreateEventForm";

export default async function CreateEventPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Create New Event
        </h1>
        <p className="mt-1 text-gray-500">
          Host a networking event for attendees with similar interests
        </p>
      </header>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <CreateEventForm />
      </div>
    </div>
  );
}