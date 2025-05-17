import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Function to generate a random event code
function generateEventCode() {
  // Generate a 6-character alphanumeric code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
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

    // Get user from database using email instead of clerkId
    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database", needsOnboarding: true },
        { status: 404 }
      );
    }

    // Get request body
    const body = await request.json();
    const { title, description, date, topics, isVirtual, location } = body;

    // Validate required fields
    if (!title || !description || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a unique event code
    let eventCode = generateEventCode();
    let isCodeUnique = false;
    
    // Make sure the code is unique
    while (!isCodeUnique) {
      const existingEvent = await Event.findOne({ code: eventCode });
      if (!existingEvent) {
        isCodeUnique = true;
      } else {
        eventCode = generateEventCode();
      }
    }

    // Create new event with code
    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      topics: topics || [],
      isVirtual: isVirtual || false,
      location: location || "",
      code: eventCode, // Add the generated code
      speakerList: [], // Initially empty
      attendees: [dbUser._id], // Creator is the first attendee
      createdBy: dbUser._id,
    });

    await newEvent.save();

    // Add event to user's events list
    await User.findByIdAndUpdate(
      dbUser._id,
      { $push: { events: newEvent._id } }
    );

    return NextResponse.json({ 
      message: "Event created successfully", 
      event: newEvent 
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event", details: String(error) },
      { status: 500 }
    );
  }
}