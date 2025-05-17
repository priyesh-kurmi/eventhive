import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    // Check authentication with NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Finding user with email:", session.user.email);

    // Connect to database
    await connectToDatabase();
    
    // Skip trying to find by ID directly, just find by email
    const user = await User.findOne({ email: session.user.email });
    
    // If we can't find by email, check if there's a MongoDB ObjectId version
    if (!user && mongoose.Types.ObjectId.isValid(session.user.id)) {
      try {
        const userById = await User.findById(session.user.id);
        if (userById) return NextResponse.json({ user: userById });
      } catch (err) {
        console.log("ID lookup failed:", err);
      }
    }
    
    // If we still don't have a user, check by OAuth ID
    if (!user) {
      const userByOAuthId = await User.findOne({ oAuthId: session.user.id });
      if (userByOAuthId) return NextResponse.json({ user: userByOAuthId });
    }
    
    if (!user) {
      // If still not found, user hasn't been onboarded yet
      console.log("User not found in database - redirecting to onboarding");
      return NextResponse.json(
        { 
          error: "User not found in database", 
          code: "user_not_found",
          needsOnboarding: true 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
        profession: user.profession,
        company: user.company,
        skills: user.skills,
        interests: user.interests,
        isOnboarded: user.isOnboarded
      } 
    });
    
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile", details: String(error) },
      { status: 500 }
    );
  }
}