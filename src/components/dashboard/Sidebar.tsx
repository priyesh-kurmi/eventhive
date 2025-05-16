"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Settings,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import clsx from "clsx";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export default function DashboardSidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        "flex flex-col w-64 bg-white border-r border-gray-200",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-indigo-600">EventHive</span>
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
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon
                  className={clsx(
                    "mr-3 h-5 w-5",
                    isActive ? "text-indigo-500" : "text-gray-500"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center p-4 border-t border-gray-200">
        <UserButton afterSignOutUrl="/" />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700">Account</p>
        </div>
      </div>
    </div>
  );
}
