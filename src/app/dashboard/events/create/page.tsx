"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Changed from Clerk to NextAuth
import { useUser } from "@/context/UserContext";
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
  const { data: session, status } = useSession(); // Changed from Clerk's useAuth
  const { userData } = useUser(); // Get user data from context
  
  // Get user ID from multiple possible sources
  const userId = userData?._id || userData?.id || session?.user?.id;

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
    // Effect to check authentication - updated for NextAuth
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/sign-in");
    }
  }, [status, router]);

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

  // Optionally, you can show a loading spinner while authentication is loading
  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard/events")}
            className="group inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Events
          </button>
        </div>
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Create New Event
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Bring people together and create meaningful connections through your event
          </p>
        </div>
        
        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-8 py-10 sm:px-12">            {submitError && (
              <div className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{submitError}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">1</span>
                  </div>
                  Basic Information
                </h3>
                
                <div className="space-y-6">
                  {/* Event Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 ${
                        errors.title 
                          ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400" 
                          : "border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                      }`}
                      placeholder="Give your event an exciting title..."
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.title}
                      </p>
                    )}
                  </div>
                  
                  {/* Event Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 resize-none ${
                        errors.description 
                          ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400" 
                          : "border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                      }`}
                      placeholder="Describe your event, its purpose, and what attendees can expect..."
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>              
              {/* Date & Time Section */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">2</span>
                  </div>
                  Schedule
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Date */}
                  <div className="lg:col-span-1">
                    <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                      Event Date <span className="text-red-500 ml-1">*</span>
                    </label>                    <div className="relative">                      <DatePicker.Root 
                        value={selectedDate ? [selectedDate] : []}
                        onValueChange={(details) => {
                          console.log("Date picker value changed:", details);
                          if (details.value.length > 0) {
                            const dateValue = details.value[0];
                            console.log("Selected date value:", dateValue);
                            setSelectedDate(dateValue as CalendarDate);
                            
                            // Also update form data directly
                            const jsDate = dateValue.toDate(getLocalTimeZone());
                            const formattedDate = format(jsDate, "yyyy-MM-dd");
                            console.log("Formatted date:", formattedDate);
                            setFormData(prev => ({ ...prev, date: formattedDate }));
                            
                            // Clear date error if it exists
                            if (errors.date) {
                              setErrors(prev => ({ ...prev, date: "" }));
                            }
                          } else {
                            setSelectedDate(null);
                            setFormData(prev => ({ ...prev, date: "" }));
                          }
                        }}
                        positioning={{ placement: "bottom-start" }}
                        closeOnSelect={true}
                      >
                        <DatePicker.Control className="relative">
                          <DatePicker.Input 
                            className={`block w-full px-4 py-3 pr-12 rounded-xl border-2 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 ${
                              errors.date 
                                ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400" 
                                : "border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                            }`}                            placeholder="Select date..."
                            value={formData.date ? (() => {
                              try {
                                return format(new Date(formData.date + 'T00:00:00'), "MMM dd, yyyy");
                              } catch (error) {
                                console.error("Error formatting date:", error);
                                return formData.date;
                              }
                            })() : ""}
                            readOnly
                          />
                          <DatePicker.Trigger asChild>
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
                            >
                              <Calendar className="h-5 w-5" />
                            </button>
                          </DatePicker.Trigger>
                        </DatePicker.Control>
                        <DatePicker.Positioner className="z-[9999]">
                          <DatePicker.Content className="bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-xl p-4 mt-2 min-w-[280px]">
                            <DatePicker.ViewControl className="flex items-center justify-between mb-4">
                              <DatePicker.PrevTrigger asChild>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                              </DatePicker.PrevTrigger>
                              <DatePicker.ViewTrigger asChild>
                                <button className="text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded-lg transition-colors">
                                  <DatePicker.RangeText />
                                </button>
                              </DatePicker.ViewTrigger>
                              <DatePicker.NextTrigger asChild>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </DatePicker.NextTrigger>
                            </DatePicker.ViewControl>                            <DatePicker.View view="day" className="[&_table]:w-full [&_th]:p-2 [&_th]:text-xs [&_th]:font-medium [&_th]:text-gray-500 [&_td]:p-1">
                              <DatePicker.Context>
                                {(datePicker) => (
                                  <>
                                    <DatePicker.Table className="w-full">
                                      <DatePicker.TableHead>
                                        <DatePicker.TableRow className="flex">
                                          {datePicker.weekDays.map((weekDay, id) => (
                                            <DatePicker.TableHeader key={id} className="flex-1 text-center p-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                              {weekDay.short}
                                            </DatePicker.TableHeader>
                                          ))}
                                        </DatePicker.TableRow>
                                      </DatePicker.TableHead>
                                      <DatePicker.TableBody>
                                        {datePicker.weeks.map((week, weekId) => (
                                          <DatePicker.TableRow key={weekId} className="flex">
                                            {week.map((day, dayId) => (                                              <DatePicker.TableCell key={dayId} value={day} className="flex-1 p-1">
                                                <DatePicker.TableCellTrigger 
                                                  className="w-full h-8 text-sm rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:bg-indigo-100 dark:focus:bg-indigo-900/50 data-[selected]:bg-indigo-600 data-[selected]:text-white data-[today]:font-bold data-[outside-range]:text-gray-300 dark:data-[outside-range]:text-gray-600 transition-colors cursor-pointer"
                                                >
                                                  {day.day}
                                                </DatePicker.TableCellTrigger>
                                              </DatePicker.TableCell>
                                            ))}
                                          </DatePicker.TableRow>
                                        ))}
                                      </DatePicker.TableBody>
                                    </DatePicker.Table>
                                  </>
                                )}
                              </DatePicker.Context>
                            </DatePicker.View>
                          </DatePicker.Content>
                        </DatePicker.Positioner>
                      </DatePicker.Root>
                      
                      
                      {errors.date && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.date}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Start Time */}
                  <div>
                    <label htmlFor="startTime" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
                      Start Time <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-0 ${
                        errors.startTime 
                          ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400" 
                          : "border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                      }`}
                    />
                    {errors.startTime && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.startTime}
                      </p>
                    )}
                  </div>
                  
                  {/* End Time */}
                  <div>
                    <label htmlFor="endTime" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                      End Time <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-0 ${
                        errors.endTime 
                          ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400" 
                          : "border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                      }`}
                    />
                    {errors.endTime && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.endTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>              
              {/* Location Section */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">3</span>
                  </div>
                  Location & Format
                </h3>
                
                <div className="space-y-6">
                  {/* Virtual Event Toggle */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MonitorSmartphone className="h-5 w-5 mr-3 text-indigo-500 dark:text-indigo-400" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Virtual Event</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Host your event online</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          id="isVirtual"
                          name="isVirtual"
                          type="checkbox"
                          checked={formData.isVirtual}
                          onChange={handleCheckboxChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Physical Location */}
                  {!formData.isVirtual && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <label htmlFor="location" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                        Event Location <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 ${
                          errors.location 
                            ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400" 
                            : "border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400"
                        }`}
                        placeholder="e.g., Conference Center, 123 Main St, City"
                      />
                      {errors.location && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.location}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Topics Section */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">4</span>
                    </div>
                    Topics & Tags
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowTopicDialog(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:ring-offset-gray-800"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Topic
                  </button>
                </div>
                
                {formData.topics.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {formData.topics.map((topic, index) => (
                      <div 
                        key={index} 
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 hover:shadow-md transition-shadow duration-200"
                      >
                        <Tag className="h-3 w-3 mr-2" />
                        {topic}
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(topic)}
                          className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full text-indigo-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none transition-colors duration-200"
                        >
                          <span className="sr-only">Remove {topic}</span>
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                    <Tag className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No topics added yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add topics to help attendees discover your event</p>
                  </div>
                )}
              </div>              
              {/* Submit Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Create Your Event?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Review your details and create your event to start bringing people together.</p>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Event...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        Create Event
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
      </div>
        {/* Add Topic Modal */}
      <Dialog.Root open={showTopicDialog} onOpenChange={details => setShowTopicDialog(details.open)}>
        <Dialog.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed z-50 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mr-3">
                <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Topic
              </Dialog.Title>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="newTopic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200"
                  placeholder="e.g., Technology, Marketing, Finance"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTopic();
                    }
                  }}
                />
                {topicError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {topicError}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button 
                className="px-6 py-3 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800 transition-colors duration-200"
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
                className="px-6 py-3 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Add Topic
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      </div>
    </div>
    </div>
  );
}