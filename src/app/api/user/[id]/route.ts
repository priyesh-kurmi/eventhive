import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  // Properly await the params
  const params = await Promise.resolve(context.params);
  const id = params.id;
  
  try {
    // Use the extracted id variable
    console.log("Fetching user with ID:", id);
    
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      console.log("Unauthorized access attempt");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      // Connect to database
      console.log("Connecting to database...");
      await connectToDatabase();
      console.log("Connected to database successfully");
    } catch (dbError) {
      // Error handling code...
      return NextResponse.json(
        { 
          error: "Database connection failed", 
          message: "Please check your MongoDB connection and ensure your IP is whitelisted",
          details: dbError instanceof Error ? dbError.message : "Unknown database error"
        },
        { status: 500 }
      );
    }

    // Find user by clerkId - use id variable
    console.log("Finding user with clerkId:", id);
    const user = await User.findOne({ clerkId: id });
    
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
    // Error handling code...
    return NextResponse.json(
      { error: "Failed to fetch user", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}