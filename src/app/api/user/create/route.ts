import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the Clerk user to access email
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json(
        { error: "User not found in authentication provider" },
        { status: 400 }
      );
    }
    
    // Get primary email from Clerk
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json(
        { error: "User email not available" },
        { status: 400 }
      );
    }

    // Get request body
    const body = await request.json();
    const { name, profession, company, skills, interests, bio, avatar, eventPreferences, clerkId } = body;

    // Validate clerkId matches authenticated user
    if (clerkId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: User ID mismatch" },
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId });

    if (existingUser) {
      // Update existing user
      const updatedUser = await User.findOneAndUpdate(
        { clerkId },
        {
          name,
          email, // Add email from Clerk
          profession,
          company,
          skills,
          interests,
          bio,
          avatar,
          eventPreferences,
        },
        { new: true }
      );

      return NextResponse.json({ 
        message: "User updated successfully", 
        user: updatedUser 
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email, // Add email from Clerk
      clerkId,
      profession,
      company,
      skills,
      interests,
      bio,
      avatar,
      eventPreferences,
    });

    await newUser.save();

    return NextResponse.json({ 
      message: "User created successfully", 
      user: newUser 
    });
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json(
      { error: "Failed to create/update user", details: String(error) },
      { status: 500 }
    );
  }
}``