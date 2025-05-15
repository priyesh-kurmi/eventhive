// UPDATE FILE: c:\Users\kpriy\OneDrive\Desktop\event\event-hive\src\app\api\events\route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get user from database to find their events
    const dbUser = await User.findOne({ clerkId: userId });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database", needsOnboarding: true },
        { status: 404 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "upcoming";
    
    // Base query - only events user has created or is attending
    let query: any = {
      $or: [
        { createdBy: dbUser._id },
        { attendees: dbUser._id }
      ]
    };
    
    // Add date filtering
    const now = new Date();
    
    if (type === "upcoming") {
      query.date = { $gte: now };
    } else if (type === "past") {
      query.date = { $lt: now };
    } else if (type === "myEvents") {
      // Only events created by user (already part of $or query)
      // But we can override the $or to be more specific
      query = { createdBy: dbUser._id };
    } else if (type === "joinedEvents") {
      // Only events user is attending but didn't create
      query = { 
        attendees: dbUser._id,
        createdBy: { $ne: dbUser._id }
      };
    }

    // Get events with populated fields
    const events = await Event.find(query)
      .populate('createdBy', 'name avatar')
      .populate('attendees', 'name avatar')
      .sort({ date: type === "past" ? -1 : 1 });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events", details: String(error) },
      { status: 500 }
    );
  }
}