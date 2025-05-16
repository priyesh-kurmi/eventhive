import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName || "there";
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-gray-500">
          Your event dashboard
        </p>
      </header>
      
      {/* Empty dashboard content - will be populated later */}
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-lg">
        <p className="text-gray-400">Dashboard content will be added here</p>
      </div>
    </div>
  );
}