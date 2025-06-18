import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { generateRandomUsername, ensureUniqueUsername } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    // Check authentication with NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { 
      name, profession, company, skills, interests, bio, avatar, 
      eventPreferences, username 
    } = body;

    // Connect to database
    await connectToDatabase();

    // Check if user already exists - search by email, not ID
    const existingUser = await User.findOne({ email: session.user.email });

    let finalUsername = username?.trim();

    if (!finalUsername) {
      // Generate a random username if none provided
      let baseUsername = generateRandomUsername();
      // Remove any underscores from the generated username
      baseUsername = baseUsername.replace(/_/g, '');
      finalUsername = await ensureUniqueUsername(baseUsername, User);
    } else {
      // Validate username format
      if (!/^[a-zA-Z0-9]+$/.test(finalUsername)) {
        return NextResponse.json(
          { error: "Username can only contain letters and numbers (no spaces or special characters)" },
          { status: 400 }
        );
      }
      // Make sure provided username is unique
      finalUsername = await ensureUniqueUsername(finalUsername, User);
    }

    if (existingUser) {
      // Update existing user
      const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        {
          name: name || session.user.name,
          email: session.user.email,
          profession,
          company,
          skills,
          interests,
          bio,
          avatar: avatar || session.user.image,
          eventPreferences,
          username: finalUsername,
          isOnboarded: true
        },
        { new: true }
      );

      return NextResponse.json({ 
        message: "User updated successfully", 
        user: updatedUser 
      });
    }

    // Create new user (don't specify _id field, let MongoDB auto-generate it)
    const newUser = new User({
      // Don't include _id field here
      name: name || session.user.name || '',
      email: session.user.email,
      username: finalUsername,
      profession,
      company,
      skills,
      interests,
      bio,
      avatar: avatar || session.user.image || '',
      eventPreferences,
      isOnboarded: true,
      authProvider: 'credentials',
      // Store the OAuth ID in a separate field
      oAuthId: session.user.id
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
}