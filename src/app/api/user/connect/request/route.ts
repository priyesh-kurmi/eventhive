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
    
    // Get current user (for checking existing connections)
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json(
        { error: "Current user not found" },
        { status: 404 }
      );
    }

    // Check if already connected
    interface IUser {
      _id: mongoose.Types.ObjectId;
      email: string;
      connections?: mongoose.Types.ObjectId[];
      connectionRequests?: { from: mongoose.Types.ObjectId; createdAt: Date }[];
    }

    const typedCurrentUser = currentUser as IUser;

    if (
      typedCurrentUser.connections &&
      typedCurrentUser.connections.some((id: mongoose.Types.ObjectId) => id.toString() === userId)
    ) {
      return NextResponse.json(
      { error: "Already connected with this user" },
      { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if request already sent (using lean query to just check if it exists)
    const existingRequest = await User.findOne({
      _id: userId,
      'connectionRequests.from': currentUser._id
    }).lean();

    if (existingRequest) {
      return NextResponse.json(
        { error: "Connection request already sent" },
        { status: 400 }
      );
    }

    // Check if there's a pending request from target user to current user
    const incomingRequest = await User.findOne({
      _id: currentUser._id,
      'connectionRequests.from': new mongoose.Types.ObjectId(userId)
    }).lean();

    if (incomingRequest) {
      return NextResponse.json(
        { message: "This user has already sent you a connection request", alreadyRequested: true },
        { status: 200 }
      );
    }

    // Add connection request to target user using atomic update operation
    // This avoids modifying other parts of the document like eventPreferences
    const updateResult = await User.updateOne(
      { _id: userId },
      { 
        $push: { 
          connectionRequests: {
            from: currentUser._id,
            createdAt: new Date()
          }
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to send connection request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Connection request sent successfully" 
    });
    
  } catch (error) {
    console.error("Error sending connection request:", error);
    return NextResponse.json(
      { error: "Failed to send connection request" },
      { status: 500 }
    );
  }
}