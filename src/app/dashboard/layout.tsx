import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <DashboardSidebar className="hidden md:flex" />
      
      {/* Mobile navigation */}
      <MobileNav />
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}