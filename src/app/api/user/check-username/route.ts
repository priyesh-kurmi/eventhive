import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

    // Get username from request body
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return NextResponse.json({ 
        available: false,
        error: "Invalid username format"
      });
    }

    // Connect to database
    await connectToDatabase();

    // Check if username exists
    const existingUser = await User.findOne({ username });

    return NextResponse.json({ 
      available: !existingUser,
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { error: "Failed to check username", details: String(error) },
      { status: 500 }
    );
  }
}