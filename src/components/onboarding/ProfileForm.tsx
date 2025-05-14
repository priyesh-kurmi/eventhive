"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import ImageUpload from "./ImageUpload";

const SKILL_OPTIONS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", 
  "Data Science", "Machine Learning", "UI/UX", "Product Management",
  "DevOps", "Cloud Computing", "Blockchain", "Mobile Development"
];

const INTEREST_OPTIONS = [
  "Web Development", "AI & Machine Learning", "Blockchain", "IoT", 
  "Cloud Computing", "Mobile Development", "UI/UX Design", "Data Science",
  "Cybersecurity", "Product Management", "Startup", "Open Source"
];

export default function ProfileForm({ clerkId }: { clerkId: string }) {
  const router = useRouter();
  const { setUserData } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    company: "",
    bio: "",
    avatar: "",
    skills: [] as string[],
    interests: [] as string[],
    eventPreferences: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMultiSelect = (field: "skills" | "interests", value: string) => {
    setFormData((prev) => {
      const current = [...prev[field]];
      
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleAvatarChange = (url: string) => {
    setFormData((prev) => ({ ...prev, avatar: url }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.profession.trim()) {
      newErrors.profession = "Profession is required";
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length < 10) {
      newErrors.bio = "Bio should be at least 10 characters";
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = "Select at least one skill";
    }
    
    if (formData.interests.length === 0) {
      newErrors.interests = "Select at least one interest";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          clerkId,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update global context
        setUserData(data.user);
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        // Show error using toast if available
        console.error("Error:", data.error);
        if (window.toast) {
          window.toast(<div className="font-medium">Failed to save profile</div>);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="mx-auto flex flex-col items-center mb-8">
        <ImageUpload 
          value={formData.avatar} 
          onChange={handleAvatarChange} 
        />
        {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name*
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
            Profession*
          </label>
          <input
            id="profession"
            name="profession"
            type="text"
            value={formData.profession}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Software Engineer"
          />
          {errors.profession && <p className="text-red-500 text-sm mt-1">{errors.profession}</p>}
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company/Organization
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Acme Inc."
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          Short Bio*
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Tell us a bit about yourself..."
        />
        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills*
        </label>
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => handleMultiSelect("skills", skill)}
              className={`px-3 py-1 rounded-full text-sm ${
                formData.skills.includes(skill)
                  ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                  : "bg-gray-100 text-gray-800 border-gray-200"
              } border`}
            >
              {skill}
            </button>
          ))}
        </div>
        {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests*
        </label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => handleMultiSelect("interests", interest)}
              className={`px-3 py-1 rounded-full text-sm ${
                formData.interests.includes(interest)
                  ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                  : "bg-gray-100 text-gray-800 border-gray-200"
              } border`}
            >
              {interest}
            </button>
          ))}
        </div>
        {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests}</p>}
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Saving..." : "Complete Profile Setup"}
        </button>
      </div>
    </form>
  );
}