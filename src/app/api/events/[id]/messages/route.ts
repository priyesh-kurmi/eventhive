import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Message from '@/models/Message';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as Ably from 'ably';
import { getEventChannelName } from '@/lib/ably';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = context.params;
    
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
  context: { params: { id: string } }
) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = context.params;
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
    });

    await newMessage.save();

    // Publish to Ably
    const ably = new Ably.Rest(process.env.ABLY_API_KEY!);
    const channel = ably.channels.get(getEventChannelName(id));
    
    await channel.publish('new-message', {
      id: newMessage._id.toString(),
      eventId: id,
      senderId: senderId,
      senderName: senderName,
      content: content.trim(),
      timestamp: newMessage.timestamp,
      avatar: avatar
    });

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}