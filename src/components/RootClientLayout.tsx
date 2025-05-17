"use client";

import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '@/context/UserContext';

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <UserProvider>
        <ThemeProvider>
          <main className="w-full">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </UserProvider>
    </SessionProvider>
  );
}