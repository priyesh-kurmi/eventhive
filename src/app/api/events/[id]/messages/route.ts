import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Message from '@/models/Message';
import { auth, currentUser } from '@clerk/nextjs/server';
import * as Ably from 'ably';
import { getEventChannelName } from '@/lib/ably';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
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
  context: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();

    const { id } = await context.params;
    const { content } = await request.json();

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create new message
    const newMessage = new Message({
      eventId: id,
      senderId: userId,
      senderName: user?.fullName || user?.username || "Unknown User",
      content: content.trim(),
      timestamp: Date.now(),
      avatar: user?.imageUrl || null
    });

    await newMessage.save();

    // Publish to Ably
    const ably = new Ably.Rest(process.env.ABLY_API_KEY!);
    const channel = ably.channels.get(getEventChannelName(id));
    
    await channel.publish('new-message', {
      id: newMessage._id.toString(),
      eventId: id,
      senderId: userId,
      senderName: user?.fullName || user?.username || "Unknown User",
      content: content.trim(),
      timestamp: newMessage.timestamp,
      avatar: user?.imageUrl || null
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