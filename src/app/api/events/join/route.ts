import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    // Get session from NextAuth instead of Clerk
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get user from database using email instead of clerkId
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database", needsOnboarding: true },
        { status: 404 }
      );
    }

    // Get request body - could be eventId or eventCode
    const body = await request.json();
    let eventId = body.eventId;
    const eventCode = body.eventCode;

    // If no eventId but eventCode is provided, find by code
    if (!eventId && eventCode) {
      const eventByCode = await Event.findOne({ code: eventCode });
      if (!eventByCode) {
        return NextResponse.json(
          { error: "Invalid event code" },
          { status: 404 }
        );
      }
      eventId = eventByCode._id;
    }

    // Validate eventId
    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID or code is required" },
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
    interface IEvent {
      _id: string;
      attendees: (string | { toString(): string })[];
      [key: string]: any;
    }

    interface IUser {
      _id: string;
      email: string;
      [key: string]: any;
    }

    const eventTyped = event as IEvent;
    const dbUserTyped = dbUser as IUser;

    const isAlreadyAttending: boolean = eventTyped.attendees.some(
      (attendeeId: string | { toString(): string }) => attendeeId.toString() === dbUserTyped._id.toString()
    );

    if (isAlreadyAttending) {
      return NextResponse.json(
        { message: "You are already attending this event", alreadyJoined: true, eventId },
        { status: 200 }
      );
    }

    // Add user to event attendees
    await Event.findByIdAndUpdate(
      eventId,
      { $push: { attendees: dbUser._id } }
    );

    // Also add event to user's events list if needed
    await User.findByIdAndUpdate(
      dbUser._id,
      { $addToSet: { events: eventId } }
    );

    return NextResponse.json({ 
      message: "Successfully joined event",
      eventId
    });
  } catch (error) {
    console.error("Error joining event:", error);
    return NextResponse.json(
      { error: "Failed to join event", details: String(error) },
      { status: 500 }
    );
  }
}