import { auth, currentUser } from "@clerk/nextjs/server";

export async function getCurrentUserId() {
  const { userId } = await auth();
  return userId;
}

export async function getCurrentUserDetails() {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0]?.emailAddress,
    imageUrl: user.imageUrl,
  };
}