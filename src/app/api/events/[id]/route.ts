import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get session from NextAuth instead of Clerk
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    
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
    // Use email instead of clerkId for lookup
    const dbUser = await User.findOne({ email: session.user.email });
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

// You should also implement the PUT/PATCH and DELETE methods with similar updates
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    
    // Connect to database
    await connectToDatabase();
    
    // Get user from database
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Get event
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }
    
    // Check if user is event creator
    if (event.createdBy.toString() !== dbUser._id.toString()) {
      return NextResponse.json(
        { error: "Only the event creator can update this event" },
        { status: 403 }
      );
    }
    
    // Get request body and update event
    const updateData = await request.json();
    
    const updatedEvent = await Event.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
    
    return NextResponse.json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    
    // Connect to database
    await connectToDatabase();
    
    // Get user from database
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    
    // Get event
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }
    
    // Check if user is event creator
    if (event.createdBy.toString() !== dbUser._id.toString()) {
      return NextResponse.json(
        { error: "Only the event creator can delete this event" },
        { status: 403 }
      );
    }
    
    // Delete event
    await Event.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event", details: String(error) },
      { status: 500 }
    );
  }
}