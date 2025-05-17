import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import DirectMessage from '@/models/DirectMessage';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as Ably from 'ably';
import { getDirectMessageChannelName } from '@/lib/ably';
import mongoose from 'mongoose';

// Get message history between current user and specified user
export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = context.params;

    await connectToDatabase();
    
    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentUserId = currentUser._id.toString();

    // Check if users are connected
    const areConnected = currentUser.connections?.some(
      (id: mongoose.Types.ObjectId) => id.toString() === userId
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
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    // Get the other user's details
    const otherUser = await User.findById(userId).select('_id name username avatar');
    if (!otherUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Mark all messages from the other user as read
    await DirectMessage.updateMany(
      { senderId: userId, receiverId: currentUserId, read: false },
      { read: true }
    );

    return NextResponse.json({
      messages: messages.map(msg => ({
        id: msg._id.toString(),
        senderId: msg.senderId.toString(),
        receiverId: msg.receiverId.toString(),
        content: msg.content,
        timestamp: msg.timestamp,
        read: msg.read
      })),
      user: {
        id: otherUser._id.toString(),
        name: otherUser.name,
        username: otherUser.username,
        avatar: otherUser.avatar
      }
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
export async function POST(
  request: Request,
  context: { params: { userId: string } }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = context.params;
    const { content } = await request.json();

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
      (id: mongoose.Types.ObjectId) => id.toString() === userId
    );

    if (!areConnected) {
      return NextResponse.json(
        { error: 'You can only message users you are connected with' },
        { status: 403 }
      );
    }

    // Get the receiver's details
    const receiver = await User.findById(userId);
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    // Create a new message
    const newMessage = new DirectMessage({
      senderId: currentUserId,
      receiverId: userId,
      content: content.trim(),
      timestamp: Date.now(),
      read: false
    });

    await newMessage.save();

    // Publish to Ably
    const ably = new Ably.Rest(process.env.ABLY_API_KEY!);
    const channel = ably.channels.get(getDirectMessageChannelName(currentUserId, userId));
    
    await channel.publish('new-message', {
      id: newMessage._id.toString(),
      senderId: currentUserId,
      receiverId: userId,
      senderName: currentUser.name,
      content: content.trim(),
      timestamp: newMessage.timestamp,
      avatar: currentUser.avatar,
      read: false
    });

    return NextResponse.json({ 
      message: {
        id: newMessage._id.toString(),
        senderId: currentUserId,
        receiverId: userId,
        content: newMessage.content,
        timestamp: newMessage.timestamp,
        read: newMessage.read
      } 
    });
    
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}