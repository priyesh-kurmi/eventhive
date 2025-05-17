import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

// Extend the Session and User types to include id and isOnboarded
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isOnboarded?: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    };
  }
  interface User {
    id: string;
    isOnboarded?: boolean;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDatabase();
        
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          return null;
        }
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!isPasswordValid) {
          return null;
        }
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.avatar,
          isOnboarded: user.isOnboarded || false
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.provider = account?.provider;
        token.isOnboarded = (user as { isOnboarded?: boolean }).isOnboarded;
      }
      
      // Handle updates from client - this is critical for onboarding
      if (trigger === "update" && session) {
        // If isOnboarded is specifically being updated
        if (typeof session.isOnboarded === 'boolean') {
          console.log("Updating session isOnboarded state to:", session.isOnboarded);
          token.isOnboarded = session.isOnboarded;
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
        session.user.isOnboarded = token.isOnboarded as boolean;
      }
      return session;
    },
    
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectToDatabase();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user from Google data
            const newUser = new User({
              email: user.email,
              name: user.name,
              avatar: user.image,
              isOnboarded: false,
              authProvider: "google"
            });
            
            await newUser.save();
          }
        } catch (error) {
          console.error("Error in Google sign in:", error);
          return false;
        }
      }
      return true;
    }
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };