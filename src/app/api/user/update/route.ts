import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const data = await request.json();
    
    // Update the fields in the User model
    user.name = data.name || user.name;
    user.bio = data.bio || user.bio;
    user.profession = data.profession || user.profession;
    user.company = data.company || user.company;
    user.avatar = data.avatar || user.avatar;
    user.skills = data.skills || user.skills;
    user.interests = data.interests || user.interests;
    
    // Extended fields - need to update the User model
    if (data.yearsExperience) user.yearsExperience = data.yearsExperience;
    if (data.location) user.location = data.location;
    if (data.linkedin) user.linkedin = data.linkedin;
    if (data.website) user.website = data.website;
    if (data.languages) user.languages = data.languages;
    if (data.customTags) user.customTags = data.customTags;
    if (data.eventsAttending) user.eventsAttending = data.eventsAttending;
    
    await user.save();
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}