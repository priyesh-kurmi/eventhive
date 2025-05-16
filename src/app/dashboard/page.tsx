"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Tabs } from "@ark-ui/react";
import { 
  CalendarIcon, 
  MoonIcon, 
  SunIcon, 
  GaugeIcon,
  Bell,
  Settings,
  UsersIcon 
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName || "there";

  return (
    <div className="transition-colors duration-200 dark:bg-gray-900 dark:text-white">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <GaugeIcon className="h-8 w-8 mb-4" />
            <h3 className="text-lg font-medium">Welcome back</h3>
            <p className="text-2xl font-bold">{firstName}</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
            <UsersIcon className="h-8 w-8 mb-4" />
            <h3 className="text-lg font-medium">My Network</h3>
            <p className="text-2xl font-bold">0 connections</p>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow p-6 h-full">
          <h3 className="font-medium text-lg mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-indigo-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">No recent activity</p>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-lg flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Upcoming Events
          </h3>
          <a href="/dashboard/events" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            View all
          </a>
        </div>

        <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-400 dark:text-gray-500">No upcoming events</p>
        </div>
      </div>
    </div>
  );
}