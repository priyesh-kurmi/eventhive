"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  ChevronLeft, 
  Save,
  Trash,
  MonitorSmartphone,
  Plus
} from "lucide-react";
import { Dialog, DatePicker } from "@ark-ui/react";
import { format } from "date-fns";
import { CalendarDate, getLocalTimeZone } from "@internationalized/date";

export default function CreateEventPage() {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    location: "",
    isVirtual: false,
    topics: [] as string[]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [topicError, setTopicError] = useState("");
  const [showTopicDialog, setShowTopicDialog] = useState(false);
  
  // Date picker state
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  
  // Effect to check authentication
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  // Handle date selection
  useEffect(() => {
    if (selectedDate) {
      const jsDate = selectedDate.toDate(getLocalTimeZone());
      setFormData({
        ...formData,
        date: format(jsDate, "yyyy-MM-dd")
      });
    }
  }, [selectedDate, formData]);

  // General input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  // Add a topic
  const handleAddTopic = () => {
    if (!newTopic.trim()) {
      setTopicError("Topic cannot be empty");
      return;
    }
    
    if (formData.topics.includes(newTopic.trim())) {
      setTopicError("Topic already added");
      return;
    }
    
    if (newTopic.length > 50) {
      setTopicError("Topic too long (max 50 characters)");
      return;
    }
    
    setFormData({
      ...formData,
      topics: [...formData.topics, newTopic.trim()]
    });
    
    setNewTopic("");
    setTopicError("");
    setShowTopicDialog(false);
  };

  // Remove a topic
  const handleRemoveTopic = (topicToRemove: string) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter(topic => topic !== topicToRemove)
    });
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }
    
    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }
    
    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = "End time must be after start time";
    }
    
    if (!formData.isVirtual && !formData.location.trim()) {
      newErrors.location = "Location is required for in-person events";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create event");
      }
      
      // Redirect to the newly created event's page
      router.push(`/dashboard/events/${data.eventId}`);
    } catch (error) {
      console.error("Error creating event:", error);
      setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>;
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => router.push("/dashboard/events")}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Events
        </button>
      </div>
      
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          Create New Event
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Host a networking event for attendees with similar interests
        </p>
      </header>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
        {submitError && (
          <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
            <p>{submitError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:text-white ${
                errors.title ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="e.g., Tech Industry Networking Event"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
            )}
          </div>
          
          {/* Event Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:text-white ${
                errors.description ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Describe your event, its purpose, and what attendees can expect"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>
          
          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date */}
            <div>
              <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                Date <span className="text-red-500 ml-1">*</span>
              </label>
              <DatePicker.Root 
                value={selectedDate ? [selectedDate] : []}
                onValueChange={(details) => {
                  if (details.value.length > 0) {
                    const dateValue = details.value[0];
                    // Only accept CalendarDate, not CalendarDateTime
                    if (dateValue && dateValue.constructor.name === "CalendarDate") {
                      setSelectedDate(dateValue as CalendarDate);
                    } else if (dateValue && "toCalendarDate" in dateValue && typeof dateValue.toCalendarDate === "function") {
                      setSelectedDate(dateValue.toCalendarDate());
                    } else {
                      setSelectedDate(null);
                    }
                  } else {
                    setSelectedDate(null);
                  }
                }}
              >
                <DatePicker.Control>
                  <DatePicker.Input 
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:text-white ${
                      errors.date ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  <DatePicker.Trigger asChild>
                    <button
                      type="button"
                      className="absolute right-0 top-0 bottom-0 px-3 text-gray-400 dark:text-gray-500"
                    >
                      <Calendar className="h-4 w-4" />
                    </button>
                  </DatePicker.Trigger>
                </DatePicker.Control>
                <DatePicker.Positioner>
                  <DatePicker.Content className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-md p-3">
                    <DatePicker.View view="day" />
                  </DatePicker.Content>
                </DatePicker.Positioner>
              </DatePicker.Root>
              {errors.date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
              )}
            </div>
            
            {/* Start Time */}
            <div>
              <label htmlFor="startTime" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                Start Time <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:text-white ${
                  errors.startTime ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startTime}</p>
              )}
            </div>
            
            {/* End Time */}
            <div>
              <label htmlFor="endTime" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                End Time <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:text-white ${
                  errors.endTime ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endTime}</p>
              )}
            </div>
          </div>
          
          {/* Event Type */}
          <div>
            <div className="flex items-center mb-4">
              <input
                id="isVirtual"
                name="isVirtual"
                type="checkbox"
                checked={formData.isVirtual}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="isVirtual" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <MonitorSmartphone className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                This is a virtual event
              </label>
            </div>
            
            {!formData.isVirtual && (
              <div>
                <label htmlFor="location" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                  Location <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md dark:bg-gray-700 dark:text-white ${
                    errors.location ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="e.g., Conference Center, 123 Main St, City"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Event Topics */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Tag className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                Topics
              </label>
              <button
                type="button"
                onClick={() => setShowTopicDialog(true)}
                className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Topic
              </button>
            </div>
            
            {formData.topics.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.topics.map((topic, index) => (
                  <div 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-100 focus:outline-none"
                    >
                      <span className="sr-only">Remove {topic}</span>
                      <Trash className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No topics added yet. Topics help attendees find your event.</p>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
      
      {/* Add Topic Dialog */}
      <Dialog.Root open={showTopicDialog} onOpenChange={details => setShowTopicDialog(details.open)}>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed z-50 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Add Topic
          </Dialog.Title>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="newTopic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topic Name
              </label>
              <input
                type="text"
                id="newTopic"
                value={newTopic}
                onChange={(e) => {
                  setNewTopic(e.target.value);
                  if (topicError) setTopicError("");
                }}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Technology, Marketing, Finance"
              />
            </div>
            
            {topicError && (
              <p className="text-sm text-red-600 dark:text-red-400">{topicError}</p>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800"
              onClick={() => {
                setNewTopic("");
                setTopicError("");
                setShowTopicDialog(false);
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleAddTopic}
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800"
            >
              Add
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}