import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user by clerkId
    const user = await User.findOne({ clerkId: params.id });

    if (!user) {
      // Instead of returning a 404, return a specific message
      // that indicates the user needs to complete onboarding
      return NextResponse.json(
        { 
          error: "User not found", 
          code: "user_not_found",
          needsOnboarding: true 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user", details: String(error) },
      { status: 500 }
    );
  }
}