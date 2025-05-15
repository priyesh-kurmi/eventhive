// UPDATE FILE: c:\Users\kpriy\OneDrive\Desktop\event\event-hive\src\app\api\events\join\route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
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

    // Get user from database
    const dbUser = await User.findOne({ clerkId: userId });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database", needsOnboarding: true },
        { status: 404 }
      );
    }

    // Get event ID from request body
    const { eventId } = await request.json();
    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if user is already attending
    const isAlreadyAttending: boolean = event.attendees.some(
      (attendeeId: string) => attendeeId.toString() === dbUser._id.toString()
    );

    if (isAlreadyAttending) {
      return NextResponse.json(
        { message: "You are already attending this event", alreadyJoined: true },
        { status: 200 }
      );
    }

    // Add user to event attendees
    await Event.findByIdAndUpdate(
      eventId,
      { $push: { attendees: dbUser._id } }
    );

    return NextResponse.json({ 
      message: "Successfully joined event" 
    });
  } catch (error) {
    console.error("Error joining event:", error);
    return NextResponse.json(
      { error: "Failed to join event", details: String(error) },
      { status: 500 }
    );
  }
}