import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user ID from the request body
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    }

    // Check if the request exists
    interface ConnectionRequest {
      from: string | { toString(): string };
      // Add other fields if present in your schema
    }

    interface CurrentUser {
      email: string;
      connectionRequests?: ConnectionRequest[];
      save: () => Promise<void>;
      // Add other fields if present in your schema
    }

    const currentUserTyped = currentUser as CurrentUser;

    const requestIndex: number = currentUserTyped.connectionRequests?.findIndex(
      (req: ConnectionRequest) => req.from.toString() === userId
    ) ?? -1;
    
    if (requestIndex === undefined || requestIndex === -1) {
      return NextResponse.json(
        { error: "Connection request not found" },
        { status: 404 }
      );
    }

    // Remove the request
    currentUser.connectionRequests.splice(requestIndex, 1);
    await currentUser.save();

    return NextResponse.json({ 
      success: true,
      message: "Connection request rejected" 
    });
    
  } catch (error) {
    console.error("Error rejecting connection request:", error);
    return NextResponse.json(
      { error: "Failed to reject connection request" },
      { status: 500 }
    );
  }
}