import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Get current user with populated connection requests
    const currentUser = await User.findOne({ email: session.user.email })
      .populate({
        path: 'connectionRequests.from',
        select: '_id name username avatar profession'
      });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Format connection requests
    interface ConnectionRequestFrom {
        _id: string;
        name: string;
        username: string;
        avatar: string;
        profession: string;
    }

    interface ConnectionRequest {
        from: ConnectionRequestFrom;
        createdAt: string;
    }

    interface FormattedRequest {
        id: string;
        name: string;
        username: string;
        avatar: string;
        profession: string;
        createdAt: string;
    }

    const requests: FormattedRequest[] = (currentUser.connectionRequests as ConnectionRequest[])?.map((req: ConnectionRequest) => ({
        id: req.from._id.toString(),
        name: req.from.name,
        username: req.from.username,
        avatar: req.from.avatar,
        profession: req.from.profession,
        createdAt: req.createdAt
    })) || [];

    return NextResponse.json({ requests });
    
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch connection requests" },
      { status: 500 }
    );
  }
}