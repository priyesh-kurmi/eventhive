import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Message from '@/models/Message';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    
    await connectToDatabase();

    // Get messages for this event, sorted by timestamp
    const messages = await Message.find({ eventId: id })
      .sort({ timestamp: 1 })
      .lean();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const { content } = await request.json();

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Get user from database to get full details
    const dbUser = await User.findOne({ email: session.user.email });
    
    // Determine sender ID - use database ID if available, otherwise fallback to session ID
    const senderId = dbUser?._id.toString() || session.user.id;
    
    // Get user's name and avatar
    const senderName = dbUser?.name || session.user.name || "Unknown User";
    const avatar = dbUser?.avatar || session.user.image || null;

    // Create new message
    const newMessage = new Message({
      eventId: id,
      senderId: senderId,
      senderName: senderName,
      content: content.trim(),
      timestamp: Date.now(),
      avatar: avatar
    });    await newMessage.save();

    // Return the message - Socket.IO handling will be done on the client side
    return NextResponse.json({ 
      message: {
        id: newMessage._id.toString(),
        eventId: id,
        senderId: senderId,
        senderName: senderName,
        content: content.trim(),
        timestamp: newMessage.timestamp,
        avatar: avatar
      }
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}