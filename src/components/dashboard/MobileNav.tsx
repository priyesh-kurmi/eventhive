"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Calendar, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import clsx from "clsx";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Events", href: "/dashboard/events", icon: Calendar },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <>
      <div className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-white">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-indigo-600">EventHive</span>
        </Link>
        
        <div className="flex items-center">
          <UserButton afterSignOutUrl="/" />
          <button
            type="button"
            className="ml-3 p-2 text-gray-500 hover:text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">EventHive</span>
              </Link>
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-600"
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
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={clsx(
                      "mr-3 h-5 w-5",
                      isActive ? "text-indigo-500" : "text-gray-500"
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