import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import DirectMessage from '@/models/DirectMessage';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from 'mongoose';

// Helper function to extract userId from URL
function extractUserIdFromUrl(req: NextRequest): string {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  return pathParts[pathParts.length - 1]; // Get the last part of the URL path
}

// Get message history between current user and specified user
export async function GET(req: NextRequest) {
  try {
    // Extract userId from URL instead of using params
    const targetUserId = extractUserIdFromUrl(req);
    
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentUserId = currentUser._id.toString();

    // Check if users are connected
    const areConnected = currentUser.connections?.some(
      (id: mongoose.Types.ObjectId) => id.toString() === targetUserId
    );

    if (!areConnected) {
      return NextResponse.json(
        { error: 'You can only message users you are connected with' },
        { status: 403 }
      );
    }

    // Get chat messages between the two users
    const messages = await DirectMessage.find({
      $or: [
        { senderId: currentUserId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    // Get the other user's details
    const otherUser = await User.findById(targetUserId).select('_id name username avatar');
    if (!otherUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Mark all messages from the other user as read
    await DirectMessage.updateMany(
      { senderId: targetUserId, receiverId: currentUserId, read: false },
      { read: true }
    );

    return NextResponse.json({
  messages: messages.map(msg => {
    // Convert IDs to strings for consistent comparison
    const senderIdString = msg.senderId.toString();
    const currentUserIdString = currentUserId.toString();
    
    return {
      id: msg._id.toString(),
      senderId: senderIdString,
      receiverId: msg.receiverId.toString(),
      content: msg.content,
      timestamp: msg.timestamp,
      read: msg.read,
      // Add this critical flag to each message
      isCurrentUser: senderIdString === currentUserIdString
    };
  }),
  user: {
    id: otherUser._id.toString(),
    name: otherUser.name,
    username: otherUser.username,
    avatar: otherUser.avatar
  },
  currentUserId: currentUserId
});
    
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Send a new message
export async function POST(req: NextRequest) {
  try {
    // Extract userId from URL instead of using params
    const targetUserId = extractUserIdFromUrl(req);
    
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentUserId = currentUser._id.toString();

    // Check if users are connected
    const areConnected = currentUser.connections?.some(
      (id: mongoose.Types.ObjectId) => id.toString() === targetUserId
    );

    if (!areConnected) {
      return NextResponse.json(
        { error: 'You can only message users you are connected with' },
        { status: 403 }
      );
    }

    // Get the receiver's details
    const receiver = await User.findById(targetUserId);
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    // Create a new message
    const newMessage = new DirectMessage({
      senderId: currentUserId,
      receiverId: targetUserId,
      content: content.trim(),
      timestamp: Date.now(),
      read: false
    });    await newMessage.save();

    // Return the message - Socket.IO handling will be done on the client side
    const messageData = {
      id: newMessage._id.toString(),
      senderId: currentUserId,
      receiverId: targetUserId,
      senderName: currentUser.name,
      content: content.trim(),
      timestamp: newMessage.timestamp,
      avatar: currentUser.avatar,
      read: false
    };

    return NextResponse.json({ message: messageData });
    
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}