import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is where you would typically verify credentials against your database
        // For now, just return null to indicate auth is handled by Clerk
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };