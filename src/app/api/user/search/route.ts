import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

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

    // Get search query from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ users: [] });
    }

    // Connect to database
    await connectToDatabase();
    
    // Find users matching either name or username (case insensitive)
    // Exclude current user from results
    const users = await User.find({
      $and: [
        { email: { $ne: session.user.email } }, // Exclude current user
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).select('_id name username avatar profession').limit(10);
    
    return NextResponse.json({ users });
    
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}