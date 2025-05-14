// filepath: src/app/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { Users, MessageCircle, Calendar, Sparkles } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import CtaCard from "@/components/dashboard/CtaCard";

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
          Here's what's happening with your event networking activity
        </p>
      </header>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Connections" 
          value={42}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard 
          title="Active Conversations" 
          value={16}
          icon={MessageCircle}
        />
        <StatsCard 
          title="Events Joined" 
          value={8}
          icon={Calendar}
          trend={{ value: 33, isPositive: true }}
        />
        <StatsCard 
          title="Match Quality" 
          value="95%"
          icon={Sparkles}
          description="Based on feedback & engagement"
        />
      </div>
      
      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CtaCard 
          title="Find New Matches" 
          description="Discover connections tailored to your interests and goals"
          icon={Users}
          href="/dashboard/matchmaking"
          buttonText="Explore Matches"
        />
        <CtaCard 
          title="Join Discussions" 
          description="Connect with others in topic-based group conversations"
          icon={MessageCircle}
          href="/dashboard/discussions"
          buttonText="View Discussions"
        />
        <CtaCard 
          title="Upcoming Events" 
          description="See what events are coming up and register to attend"
          icon={Calendar}
          href="/dashboard/events"
          buttonText="Browse Events"
        />
      </div>
    </div>
  );
}