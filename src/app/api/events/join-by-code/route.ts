import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get user from database - replaced clerkId with direct ID
    const dbUser = await User.findById(session.user.id);
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

    return NextResponse.json(
      { 
        message: "Successfully joined event",
        event: {
          _id: event._id,
          title: event.title
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining event by code:", error);
    return NextResponse.json(
      { error: "Failed to join event", details: String(error) },
      { status: 500 }
    );
  }
}