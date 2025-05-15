"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, X } from "lucide-react";

export default function CreateEventForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "", // Changed from time to startTime
    endTime: "",   // Added endTime field
    isVirtual: false,
    location: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAddTopic = () => {
    if (topicInput && !topics.includes(topicInput)) {
      setTopics(prev => [...prev, topicInput]);
      setTopicInput("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics(prev => prev.filter(t => t !== topic));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate that end time is after start time
      if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
        throw new Error("End time must be after start time");
      }
      
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          isVirtual: formData.isVirtual,
          location: formData.location,
          topics,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      // Redirect to the new event page
      router.push(`/dashboard/events/${data.event._id}`);
      router.refresh();
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Event Title *
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Tech Conference 2025"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          name="description"
          id="description"
          required
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Describe your event..."
        ></textarea>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="date"
              id="date"
              required
              value={formData.date}
              onChange={handleInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Start Time *
          </label>
          <input
            type="time"
            name="startTime"
            id="startTime"
            required
            value={formData.startTime}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            End Time *
          </label>
          <input
            type="time"
            name="endTime"
            id="endTime"
            required
            value={formData.endTime}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="isVirtual"
            name="isVirtual"
            type="checkbox"
            checked={formData.isVirtual}
            onChange={handleCheckboxChange}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="isVirtual" className="font-medium text-gray-700">
            Virtual Event
          </label>
          <p className="text-gray-500">Check if this is an online event</p>
        </div>
      </div>

      <div className={formData.isVirtual ? 'opacity-50 pointer-events-none' : ''}>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="location"
            id="location"
            disabled={formData.isVirtual}
            value={formData.location}
            onChange={handleInputChange}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Convention Center, City"
          />
        </div>
      </div>

      <div>
        <label htmlFor="topics" className="block text-sm font-medium text-gray-700">
          Topics
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="topicInput"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
            placeholder="AI & ML, Web Development, etc."
          />
          <button
            type="button"
            onClick={handleAddTopic}
            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
          >
            Add
          </button>
        </div>
        {topics.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {topic}
                <button
                  type="button"
                  onClick={() => handleRemoveTopic(topic)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                >
                  <span className="sr-only">Remove {topic}</span>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}