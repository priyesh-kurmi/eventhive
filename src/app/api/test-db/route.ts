import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Create a dummy user for testing
    const dummyUser = {
      name: 'Test User',
      email: 'test@example.com',
      clerkId: 'test-clerk-id',
      profession: 'Developer',
      skills: ['JavaScript', 'React', 'Node.js'],
      interests: ['Web Development', 'AI'],
      bio: 'This is a test user',
      avatar: 'https://via.placeholder.com/150',
    };
    
    // This is just for testing - in production you'd check if exists first
    await User.findOneAndUpdate(
      { email: dummyUser.email },
      dummyUser,
      { upsert: true, new: true }
    );
    
    // Get the test user
    const user = await User.findOne({ email: dummyUser.email });
    
    return NextResponse.json({ success: true, message: 'Database connection successful', user });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { success: false, message: 'Database connection failed', error: String(error) },
      { status: 500 }
    );
  }
}