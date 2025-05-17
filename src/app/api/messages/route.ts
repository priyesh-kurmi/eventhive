import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import DirectMessage from '@/models/DirectMessage';
import User from '@/models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from 'mongoose';

export async function GET() {
  try {
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

    // Find all users the current user has messaged with or received messages from
    const messages = await DirectMessage.aggregate([
      {
        // Find messages where current user is sender or receiver
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(currentUserId) },
            { receiverId: new mongoose.Types.ObjectId(currentUserId) }
          ]
        }
      },
      {
        // Sort by timestamp descending to get most recent messages first
        $sort: { timestamp: -1 }
      },
      {
        // Group by conversation partner
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', new mongoose.Types.ObjectId(currentUserId)] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$timestamp' },
          lastMessageId: { $first: '$_id' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$receiverId', new mongoose.Types.ObjectId(currentUserId)] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Get user details for each conversation
    const userIds = messages.map(msg => msg._id.toString());
    const chatUsers = await User.find({ 
      _id: { $in: userIds } 
    }).select('_id name username avatar');

    // Map the user details to the conversations
    const conversations = messages.map(msg => {
      const user = chatUsers.find(u => u._id.toString() === msg._id.toString());
      return {
        userId: msg._id.toString(),
        username: user?.username || 'Unknown',
        name: user?.name || 'Unknown User',
        avatar: user?.avatar,
        lastMessage: msg.lastMessage,
        lastMessageTime: msg.lastMessageTime,
        lastMessageId: msg.lastMessageId.toString(),
        unreadCount: msg.unreadCount
      };
    });

    return NextResponse.json({ conversations });
    
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}