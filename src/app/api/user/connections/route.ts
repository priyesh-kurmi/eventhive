import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Get current user first
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has connections field (for backward compatibility)
    if (!currentUser.connections || currentUser.connections.length === 0) {
      return NextResponse.json({ connections: [] });
    }

    // Get connection details in a separate query
    const userConnections = await User.find({
      _id: { $in: currentUser.connections }
    }).select('_id name username avatar profession');

    // Map connections to the format expected by the frontend
    const connections = userConnections.map(conn => ({
      id: conn._id.toString(),
      name: conn.name,
      username: conn.username,
      avatar: conn.avatar,
      profession: conn.profession
    }));

    return NextResponse.json({ connections });
    
  } catch (error) {
    console.error("Error fetching connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }
}