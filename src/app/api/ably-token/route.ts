import { NextResponse } from 'next/server';
import * as Ably from 'ably';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Handle both GET and POST methods for token requests
export async function GET(request: Request) {
  return handleTokenRequest(request);
}

export async function POST(request: Request) {
  return handleTokenRequest(request);
}

// Shared function to handle token generation
async function handleTokenRequest(request: Request) {
  try {
    // Verify the user is authenticated using NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get userId from session
    const userId = session.user.id;

    // Get clientId from query params or request body
    const url = new URL(request.url);
    let clientId = url.searchParams.get('clientId') || userId;

    // Create an Ably token request
    const client = new Ably.Rest(process.env.ABLY_API_KEY!);
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: clientId,
    });

    return NextResponse.json(tokenRequestData);
  } catch (error) {
    console.error('Error creating Ably token:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}