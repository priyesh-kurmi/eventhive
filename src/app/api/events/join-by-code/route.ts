// UPDATE FILE: c:\Users\kpriy\OneDrive\Desktop\event\event-hive\src\app\api\events\join-by-code\route.ts
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

    // Get event code from request body
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json(
        { error: "Event code is required" },
        { status: 400 }
      );
    }

    // Check if event with this code exists
    const event = await Event.findOne({ code: code.toUpperCase() });
    if (!event) {
      return NextResponse.json(
        { error: "Invalid event code" },
        { status: 404 }
      );
    }

    // Check if user is already attending
    const isAlreadyAttending: boolean = event.attendees.some(
      (attendeeId: string) => attendeeId.toString() === dbUser._id.toString()
    );

    if (isAlreadyAttending) {
      return NextResponse.json(
        { 
          message: "You are already attending this event", 
          alreadyJoined: true,
          event: {
            _id: event._id,
            title: event.title
          }
        },
        { status: 200 }
      );
    }

    // Add user to event attendees
    await Event.findByIdAndUpdate(
      event._id,
      { $push: { attendees: dbUser._id } }
    );

    return NextResponse.json({ 
      message: "Successfully joined event",
      event: {
        _id: event._id,
        title: event.title
      }
    });
  } catch (error) {
    console.error("Error joining event by code:", error);
    return NextResponse.json(
      { error: "Failed to join event", details: String(error) },
      { status: 500 }
    );
  }
}