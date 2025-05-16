"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  Home,
  Calendar,
  Settings,
  Menu,
  MoonIcon,
  SunIcon,
  BellIcon,
  X,
} from "lucide-react";
import { Dialog } from "@ark-ui/react";
import clsx from "clsx";
import { useTheme } from "@/context/ThemeContext";
import { MessageSquare, Users } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Connections", href: "/dashboard/connections", icon: Users },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, isLoaded } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  // Handle authentication
  useEffect(() => {
    if (isLoaded && !userId) {
      redirect("/sign-in");
    }
  }, [userId, isLoaded]);

  if (!isLoaded) return null;

  return (
    <div className="flex min-h-screen transition-colors duration-200 dark:bg-gray-900 dark:text-white">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                EventHive
              </span>
            </Link>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
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
            <UserButton afterSignOutUrl="/" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Account
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop/Medium Header */}
      <div className="hidden md:flex fixed top-0 right-0 left-64 h-16 z-40 items-center justify-end px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
          
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 fixed top-0 inset-x-0 z-30">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            EventHive
          </span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
          <UserButton afterSignOutUrl="/" />
          <button
            type="button"
            className="p-2 text-gray-500 dark:text-gray-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open menu</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <Dialog.Root
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
      >
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  EventHive
                </span>
              </Link>
              <button
                type="button"
                className="p-2 text-gray-500 dark:text-gray-400"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    )}
                    onClick={() => setIsOpen(false)}
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
        </Dialog.Content>
      </Dialog.Root>

      {/* Main content */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-16">
        <div className="w-full p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
