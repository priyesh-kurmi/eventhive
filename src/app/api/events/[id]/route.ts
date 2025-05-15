// EXISTING FILE: c:\Users\kpriy\OneDrive\Desktop\event\event-hive\src\app\api\events\[id]\route.ts
// Update this file to include isOrganizer flag in the response
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = context.params;
    
    // Connect to database
    await connectToDatabase();

    // Get event with populated fields
    const event = await Event.findById(id)
      .populate('createdBy', 'name avatar profession company')
      .populate('attendees', 'name avatar profession company')
      .populate('speakerList.userId', 'name avatar profession company');

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Get current user to determine if they're attending or organizer
    const dbUser = await User.findOne({ clerkId: userId });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database", needsOnboarding: true },
        { status: 404 }
      );
    }
    
    const isAttending: boolean = event.attendees.some((attendee: { _id: string }) => 
      attendee._id.toString() === dbUser._id.toString()
    );
    
    const isOrganizer = event.createdBy._id.toString() === dbUser._id.toString();

    return NextResponse.json({ 
      event,
      isAttending,
      isOrganizer,
      userMongoId: dbUser._id
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event", details: String(error) },
      { status: 500 }
    );
  }
}