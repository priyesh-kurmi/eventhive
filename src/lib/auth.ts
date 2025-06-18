import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id;
}

export async function getCurrentUserDetails() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }
  
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    imageUrl: session.user.image,
  };
}