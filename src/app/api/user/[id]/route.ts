import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  // Get the id from params
  const id = context.params.id;
  
  try {
    console.log("Fetching user with ID:", id);
    
    // Check authentication with NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("Unauthorized access attempt");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database
    try {
      console.log("Connecting to database...");
      await connectToDatabase();
      console.log("Connected to database successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { 
          error: "Database connection failed", 
          message: "Please check your MongoDB connection and ensure your IP is whitelisted",
          details: dbError instanceof Error ? dbError.message : "Unknown database error"
        },
        { status: 500 }
      );
    }

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid MongoDB ObjectId format:", id);
      return NextResponse.json(
        { 
          error: "Invalid user ID format", 
          code: "invalid_id",
          needsOnboarding: true 
        },
        { status: 400 }
      );
    }

    // Find user by MongoDB _id
    console.log("Finding user with _id:", id);
    const user = await User.findById(id);
    
    console.log("User found:", !!user);

    if (!user) {
      // Return onboarding error
      console.log("User not found in database - may need onboarding");
      return NextResponse.json(
        { 
          error: "User not found in database", 
          code: "user_not_found",
          needsOnboarding: true 
        },
        { status: 404 }
      );
    }

    console.log("User data retrieved successfully");
    return NextResponse.json({ user });
    
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch user", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}