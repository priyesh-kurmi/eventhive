import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Function to generate a random username
function generateUsername() {
  const adjectives = ['happy', 'clever', 'brave', 'calm', 'eager', 'kind', 'witty'];
  const nouns = ['panda', 'tiger', 'eagle', 'dolphin', 'wolf', 'fox', 'lion'];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}${randomNumber}`;
}

// Function to ensure username is unique
interface IUserModel {
  findOne(query: Record<string, any>): Promise<any>;
}

async function ensureUniqueUsername(
  baseUsername: string,
  userModel: IUserModel
): Promise<string> {
  // First try with the base username
  let username: string = baseUsername;
  let user: any = await userModel.findOne({ username });
  let counter: number = 1;
  
  // If username exists, append a number and try again
  while (user) {
    username = `${baseUsername}${counter}`;
    user = await userModel.findOne({ username });
    counter++;
  }
  
  return username;
}

export async function POST(request: Request) {
  try {
    console.log("Onboarding API called");
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.log("Unauthorized - No session");
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log("Session user:", session.user.email);
    
    const { 
      name, 
      bio, 
      username: rawUsername,
      profession,
      avatar,
      skills,
      interests,
      company
    } = await request.json();
    
    if (!name) {
      console.log("Name required but not provided");
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    try {
      await connectToDatabase();
      console.log("Connected to database");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: dbError instanceof Error ? dbError.message : String(dbError)
        },
        { status: 500 }
      );
    }

    // Process username
    let finalUsername = rawUsername?.trim();
    
    // If no username provided, generate one
    if (!finalUsername) {
      let baseUsername = generateUsername();
      finalUsername = await ensureUniqueUsername(baseUsername, User);
      console.log("Generated username:", finalUsername);
    } else {
      // Check if username is available
      const existingUser = await User.findOne({ 
        username: finalUsername, 
        email: { $ne: session.user.email } 
      });
      
      if (existingUser) {
        console.log("Username already taken:", finalUsername);
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }
    }
    
    try {
      // Check if user exists by email
      let user = await User.findOne({ email: session.user.email });
      
      if (user) {
        console.log("Updating existing user:", user._id);
        // Update existing user
        user = await User.findByIdAndUpdate(
          user._id,
          { 
            name,
            bio: bio || '',
            username: finalUsername,
            profession: profession || '',
            avatar: avatar || session.user.image || '',
            skills: skills || [],
            interests: interests || [],
            company: company || '',
            isOnboarded: true,
            oAuthId: session.user.id // Store OAuth ID
          },
          { new: true }
        );
      } else {
        console.log("Creating new user with email:", session.user.email);
        // Create new user
        user = new User({
          email: session.user.email,
          name,
          bio: bio || '',
          username: finalUsername,
          profession: profession || '',
          avatar: avatar || session.user.image || '',
          skills: skills || [],
          interests: interests || [],
          company: company || '',
          isOnboarded: true,
          authProvider: session.user.provider || 'credentials',
          oAuthId: session.user.id // Store OAuth ID
        });
        
        await user.save();
        console.log("New user created with ID:", user._id);
      }
      
      return NextResponse.json({ 
        message: 'Onboarding completed successfully',
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          bio: user.bio,
          avatar: user.avatar,
          isOnboarded: true
        }
      });
      
    } catch (userError) {
      console.error("Error creating/updating user:", userError);
      return NextResponse.json(
        { 
          error: 'Failed to create/update user',
          details: userError instanceof Error ? userError.message : String(userError)
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to complete onboarding',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}