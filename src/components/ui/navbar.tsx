"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "Messages", href: "/messages" },
  { name: "Profile", href: "/profile" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">EventHive</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="ml-4">
              {isLoaded && (isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <SignInButton mode="modal">
                  <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                    Sign In
                  </button>
                </SignInButton>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            {isLoaded && (isSignedIn ? (
              <div className="mr-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="mr-2 px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm">
                  Sign In
                </button>
              </SignInButton>
            ))}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={clsx(
          "sm:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}