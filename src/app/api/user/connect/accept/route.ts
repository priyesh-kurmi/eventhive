import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import mongoose from "mongoose";

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

    // Get requester user
    const requesterUser = await User.findById(userId);
    if (!requesterUser) {
      return NextResponse.json(
        { error: "Requester user not found" },
        { status: 404 }
      );
    }

    // Check if the request exists
    interface ConnectionRequest {
      from: string;
      // Add other fields if present in your schema
    }

    interface UserDocument extends mongoose.Document {
      _id: mongoose.Types.ObjectId;
      email: string;
      connectionRequests: ConnectionRequest[];
      connections: mongoose.Types.ObjectId[];
    }

    const currentUserTyped = currentUser as UserDocument;

    const requestIndex: number = currentUserTyped.connectionRequests?.findIndex(
      (req: ConnectionRequest) => req.from.toString() === userId
    ) ?? -1;
    
    if (requestIndex === -1) {
      return NextResponse.json(
        { error: "Connection request not found" },
        { status: 404 }
      );
    }

    // Remove the request
    currentUser.connectionRequests.splice(requestIndex, 1);

    // Ensure connections arrays exist
    if (!currentUser.connections) {
      currentUser.connections = [];
    }

    // Convert IDs to ensure consistent format
    const currentUserId = currentUser._id.toString();
    const requesterUserId = userId.toString();

    // Check if the connection already exists to avoid duplicates
    if (!currentUser.connections.some((id: mongoose.Types.ObjectId) => id.toString() === requesterUserId)) {
      // Use ObjectId for MongoDB
      currentUser.connections.push(new mongoose.Types.ObjectId(requesterUserId));
    }

    // Save current user with updated request list and connections
    await currentUser.save();

    // Update the requester's connections array
    // Use atomic update with $addToSet to avoid duplicates
    const updateResult = await User.updateOne(
      { _id: requesterUserId },
      { $addToSet: { connections: currentUser._id } }
    );

    if (updateResult.modifiedCount === 0) {
      console.log("Warning: Requester's connections were not updated. They may already have this connection.");
    }

    return NextResponse.json({ 
      success: true,
      message: "Connection request accepted" 
    });
    
  } catch (error) {
    console.error("Error accepting connection request:", error);
    return NextResponse.json(
      { error: "Failed to accept connection request" },
      { status: 500 }
    );
  }
}