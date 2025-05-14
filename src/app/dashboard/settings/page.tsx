import { Bell, Shield, Globe, User, Users, LogOut } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-gray-500">
          Manage your account preferences and settings
        </p>
      </header>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Update your personal information and preferences
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue="John Doe"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    defaultValue="john.doe@example.com"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Email is managed by your authentication provider
                </p>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    defaultValue="Software engineer passionate about building great products."
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description for your profile.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Notification Preferences
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Choose when and how you want to be notified
              </p>
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="event_notifications"
                  name="event_notifications"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="event_notifications" className="font-medium text-gray-700">
                  Event Notifications
                </label>
                <p className="text-gray-500">Get notified about new events matching your interests.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="message_notifications"
                  name="message_notifications"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="message_notifications" className="font-medium text-gray-700">
                  Message Notifications
                </label>
                <p className="text-gray-500">Get notified when you receive new messages.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="connection_notifications"
                  name="connection_notifications"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="connection_notifications" className="font-medium text-gray-700">
                  Connection Requests
                </label>
                <p className="text-gray-500">Get notified when someone wants to connect with you.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Privacy Settings
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Control who can see your information
              </p>
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="profile_visibility"
                  name="profile_visibility"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="profile_visibility" className="font-medium text-gray-700">
                  Public Profile
                </label>
                <p className="text-gray-500">Allow your profile to be visible to other users.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="contact_info_visibility"
                  name="contact_info_visibility"
                  type="checkbox"
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="contact_info_visibility" className="font-medium text-gray-700">
                  Show Contact Information
                </label>
                <p className="text-gray-500">Allow your contact details to be visible to connections.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <LogOut className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Account Actions
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage your account
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}