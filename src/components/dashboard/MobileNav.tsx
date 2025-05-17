"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Calendar, Settings, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react"; // Replace Clerk with NextAuth
import clsx from "clsx";
import Image from "next/image";
import { useUser } from "@/context/UserContext"; // Import your user context

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

// Custom NextAuth UserButton component
function CustomUserButton() {
  const { data: session } = useSession();
  const { userData } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Get user info from either context or session
  const userImage = userData?.avatar || session?.user?.image;
  const userName = userData?.name || session?.user?.name || "User";
  const userEmail = userData?.email || session?.user?.email;
  
  // First letter of name for avatar fallback
  const initial = userName ? userName.charAt(0).toUpperCase() : "U";
  
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-center rounded-full overflow-hidden w-8 h-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {userImage ? (
          <Image 
            src={userImage} 
            alt={userName || "Profile"} 
            width={32} 
            height={32}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white">
            {initial}
          </div>
        )}
      </button>
      
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
            {userEmail && (
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            )}
          </div>
          <Link 
            href="/dashboard/profile" 
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => setIsDropdownOpen(false)}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <>
      <div className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">EventHive</span>
        </Link>
        
        <div className="flex items-center">
          <CustomUserButton /> {/* Replace UserButton with custom component */}
          <button
            type="button"
            className="ml-3 p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-800 dark:text-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">EventHive</span>
              </Link>
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={clsx(
                      "mr-3 h-5 w-5",
                      isActive ? "text-indigo-500 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}