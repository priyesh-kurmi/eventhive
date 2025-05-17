import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET(
  request: Request
) {
  try {
    // Extract username from URL instead of using params
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const username = pathParts[pathParts.length - 1];
    
    if (!username) {
      return NextResponse.json({ error: "No username provided" }, { status: 400 });
    }
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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

    // Get target user by username
    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check connection status
    let connectionStatus = 'none';
    
    // Check if users are already connected
    if (currentUser.connections && currentUser.connections.some((id: mongoose.Types.ObjectId | string) => 
      id.toString() === targetUser._id.toString())) {
      connectionStatus = 'connected';
    } else {
      // Check if current user has sent a request to target user
      const sentRequest = await User.findOne({
        _id: targetUser._id,
        'connectionRequests.from': currentUser._id
      }).lean();
      
      if (sentRequest) {
        connectionStatus = 'pending';
      } else {
        // Check if target user has sent a request to current user
        const receivedRequest = await User.findOne({
          _id: currentUser._id,
          'connectionRequests.from': targetUser._id
        }).lean();
        
        if (receivedRequest) {
          connectionStatus = 'requested';
        }
      }
    }

    // Prepare user data (excluding sensitive information)
    const userData = {
      _id: targetUser._id,
      name: targetUser.name,
      username: targetUser.username,
      avatar: targetUser.avatar,
      bio: targetUser.bio,
      profession: targetUser.profession,
      company: targetUser.company,
      location: targetUser.location,
      website: targetUser.website,
      linkedin: targetUser.linkedin,
      skills: targetUser.skills,
      interests: targetUser.interests,
      connectionStatus
    };

    return NextResponse.json({ user: userData });
    
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}