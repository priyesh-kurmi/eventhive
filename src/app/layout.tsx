import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/toast";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Event-Hive - Connect at Events",
  description: "AI-powered networking app for event attendees",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <UserProvider>
        <html lang="en">
          <body className={`${inter.variable} font-sans`}>
            <Navbar />
            <main className="max-w-screen-lg mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
          </body>
        </html>
      </UserProvider>
    </ClerkProvider>
  );
}