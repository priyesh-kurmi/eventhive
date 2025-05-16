'use client';

import { ClerkProvider } from '@clerk/nextjs';
// Remove this: import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toast";
import { UserProvider } from "@/context/UserContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {/* Remove SessionProvider */}
      <UserProvider>
        <main className="max-w-screen-lg mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
      </UserProvider>
    </ClerkProvider>
  );
}