"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react"; // Replace Clerk with NextAuth
import { useUser } from "@/context/UserContext"; // Add UserContext
import {
  Home,
  Calendar,
  Settings,
  Users,
  MessageSquare,
  User,
  LogOut,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Connections", href: "/dashboard/connections", icon: Users },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

// Custom UserButton to replace Clerk's component
function CustomUserButton({ afterSignOutUrl = "/" }) {
  const { data: session } = useSession();
  const { userData } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get user info from either context or session
  const userImage = userData?.avatar || session?.user?.image;
  const userName = userData?.name || session?.user?.name || "User";
  const userEmail = userData?.email || session?.user?.email;
  
  // First letter of name for avatar fallback
  const initial = userName ? userName.charAt(0).toUpperCase() : "U";
  
  const handleSignOut = () => {
    signOut({ callbackUrl: afterSignOutUrl });
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
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
      
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
            {userEmail && (
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            )}
          </div>
          <Link 
            href="/dashboard/profile" 
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => setIsOpen(false)}
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

interface SidebarProps {
  className?: string;
}

export default function DashboardSidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        "flex flex-col w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">EventHive</span>
        </Link>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                <item.icon
                  className={clsx(
                    "mr-3 h-5 w-5",
                    isActive 
                      ? "text-indigo-500 dark:text-indigo-400" 
                      : "text-gray-500 dark:text-gray-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center p-4 border-t border-gray-200 dark:border-gray-700">
        <CustomUserButton afterSignOutUrl="/" />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Account</p>
        </div>
      </div>
    </div>
  );
}