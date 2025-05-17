import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
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
      // Only events created by user
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
      .populate('attendees', 'name avatar profession company')
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

    // Get user from database using email
    const dbUser = await User.findOne({ email: session.user.email });
    
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Get request body
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      isVirtual,
      topics
    } = await request.json();

    // Validate required fields
    if (!title || !description || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create event code
    const generateEventCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing chars like O, 0, 1, I
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    // Create new event
    const event = new Event({
      title,
      description,
      date,
      startTime,
      endTime,
      location: isVirtual ? 'Virtual Event' : location,
      isVirtual,
      topics: topics || [],
      createdBy: dbUser._id,
      attendees: [dbUser._id], // Creator is automatically an attendee
      code: generateEventCode()
    });

    await event.save();

    return NextResponse.json({
      message: "Event created successfully",
      eventId: event._id
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event", details: String(error) },
      { status: 500 }
    );
  }
}