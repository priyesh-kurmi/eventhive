"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Shield, 
  User, 
  LogOut,
  Save,
  Check,
  Briefcase,
  MapPin,
  Globe,
  Calendar,
  Tag,
  Languages,
  Edit,
  X
} from "lucide-react";
import { Tabs } from "@ark-ui/react";
import ImageUpload from "@/components/onboarding/ImageUpload";

// Skill and Interest options
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState("");
  
  // User profile data state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    profession: "",
    company: "",
    avatar: "",
    skills: [] as string[],
    interests: [] as string[],
    // Extended fields
    yearsExperience: "",
    location: "",
    linkedin: "",
    website: "",
    languages: "",
    customTags: "",
    eventsAttending: "",
  });
  
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  // Load user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile");
        
        if (response.ok) {
          const userData = await response.json();
          setProfileData({
            name: userData.name || "",
            email: userData.email || "",
            bio: userData.bio || "",
            profession: userData.profession || "",
            company: userData.company || "",
            avatar: userData.avatar || "",
            skills: userData.skills || [],
            interests: userData.interests || [],
            // Extended fields - these might not exist in current schema
            yearsExperience: userData.yearsExperience || "",
            location: userData.location || "",
            linkedin: userData.linkedin || "",
            website: userData.website || "",
            languages: userData.languages || "",
            customTags: userData.customTags || "",
            eventsAttending: userData.eventsAttending || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Calculate profile completion percentage
  useEffect(() => {
    if (loading) return;
    
    const fields = [
      'name', 'bio', 'profession', 'company', 'avatar', 'skills', 
      'interests', 'yearsExperience', 'location', 'linkedin', 
      'website', 'languages', 'customTags', 'eventsAttending'
    ];
    
    let filledFields = 0;
    
    fields.forEach(field => {
      const value = profileData[field as keyof typeof profileData];
      if (value && 
         (typeof value === 'string' && value.trim() !== '') || 
         (Array.isArray(value) && value.length > 0)) {
        filledFields++;
      }
    });
    
    setCompletionPercentage(Math.round((filledFields / fields.length) * 100));
  }, [profileData, loading]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAvatarChange = (url: string) => {
    setProfileData(prev => ({
      ...prev,
      avatar: url
    }));
  };
  
  const handleToggleSelect = (field: "skills" | "interests", value: string) => {
    setProfileData(prev => {
      const current = [...prev[field]];
      
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };
  
  // Modal control functions
  const openModal = (field: string) => {
    setModalField(field);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };
  
  // Handle form submission
  const handleSave = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        console.error("Error updating profile:", await response.text());
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Quick Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Edit {modalField.charAt(0).toUpperCase() + modalField.slice(1)}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {modalField === 'skills' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Skills
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2">
                    {SKILL_OPTIONS.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSelect("skills", skill)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          profileData.skills.includes(skill)
                            ? "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200"
                            : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300"
                        } border`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {modalField === 'interests' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Interests
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2">
                    {INTEREST_OPTIONS.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleToggleSelect("interests", interest)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          profileData.interests.includes(interest)
                            ? "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200"
                            : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300"
                        } border`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {modalField === 'bio' && (
                <div>
                  <label htmlFor="modal-bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Short Bio
                  </label>
                  <textarea
                    id="modal-bio"
                    name="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
              )}
              
              {(modalField === 'name' || 
                modalField === 'profession' || 
                modalField === 'company' || 
                modalField === 'yearsExperience' || 
                modalField === 'location' || 
                modalField === 'linkedin' || 
                modalField === 'website' || 
                modalField === 'languages' || 
                modalField === 'customTags' || 
                modalField === 'eventsAttending') && (
                <div>
                  <label htmlFor={`modal-${modalField}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {modalField.charAt(0).toUpperCase() + modalField.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    id={`modal-${modalField}`}
                    name={modalField}
                    type="text"
                    value={profileData[modalField as keyof typeof profileData] as string}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}
              
              {modalField === 'avatar' && (
                <div className="flex flex-col items-center">
                  <ImageUpload 
                    value={profileData.avatar} 
                    onChange={handleAvatarChange} 
                  />
                </div>
              )}
            </div>
            
            <div className="mt-6 flex space-x-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  closeModal();
                  handleSave();
                }}
                className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Tabs.Root value={activeTab} onValueChange={details => setActiveTab(details.value)}>
        <Tabs.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-8">
          <Tabs.Trigger 
            value="profile"
            className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
              activeTab === 'profile' 
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="notifications"
            className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
              activeTab === 'notifications' 
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="privacy"
            className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center ${
              activeTab === 'privacy' 
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </Tabs.Trigger>
        </Tabs.List>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <Tabs.Content value="profile">
            <div className="p-6">
              {/* Profile Completion Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Profile Completion: {completionPercentage}%
                  </h3>
                  {completionPercentage < 100 && (
                    <span className="text-xs text-indigo-600 dark:text-indigo-400">
                      Complete your profile to get better networking matches!
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Profile Information
                </h3>
              </div>
              
              {/* Profile Image Upload */}
              <div className="mb-8 flex flex-col items-center relative group">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-3 flex items-center justify-center relative">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                  <button 
                    onClick={() => openModal('avatar')}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <Edit className="h-6 w-6 text-white" />
                  </button>
                </div>
                <button 
                  onClick={() => openModal('avatar')}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  Change Photo
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                {/* Basic Information */}
                <div className="sm:col-span-3 relative group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white pr-10"
                    />
                    <button 
                      onClick={() => openModal('name')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profileData.email}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email is managed by your authentication provider
                  </p>
                </div>
                
                <div className="sm:col-span-6 relative group">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Short Bio
                  </label>
                  <div className="relative">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={profileData.bio}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white pr-10"
                      placeholder="Tell us a bit about yourself..."
                    />
                    <button 
                      onClick={() => openModal('bio')}
                      className="absolute right-2 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Brief description for your profile (1-2 lines recommended).
                  </p>
                </div>
                
                {/* Professional Information */}
                <div className="sm:col-span-3 relative group">
                  <label htmlFor="profession" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profession/Role
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="profession"
                      id="profession"
                      value={profileData.profession}
                      onChange={handleInputChange}
                      placeholder="e.g., Software Engineer, Marketing Head"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white pr-10"
                    />
                    <button 
                      onClick={() => openModal('profession')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="sm:col-span-3 relative group">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company/Organization
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={profileData.company}
                      onChange={handleInputChange}
                      placeholder="e.g., Acme Inc."
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white pr-10"
                    />
                    <button 
                      onClick={() => openModal('company')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="sm:col-span-3 relative group">
                  <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Briefcase className="h-4 w-4 inline mr-1" /> 
                    Years of Experience
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="yearsExperience"
                      id="yearsExperience"
                      value={profileData.yearsExperience}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white pr-10"
                    />
                    <button 
                      onClick={() => openModal('yearsExperience')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="sm:col-span-3 relative group">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <MapPin className="h-4 w-4 inline mr-1" /> 
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., San Francisco, CA"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white pr-10"
                    />
                    <button 
                      onClick={() => openModal('location')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Skills and Interests */}
                <div className="sm:col-span-6 relative group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skills
                    </label>
                    <button 
                      onClick={() => openModal('skills')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Skills
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
                    {profileData.skills.length > 0 ? (
                      profileData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 border"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">No skills selected</span>
                    )}
                  </div>
                </div>
                
                <div className="sm:col-span-6 relative group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Key Interests
                    </label>
                    <button 
                      onClick={() => openModal('interests')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Interests
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
                    {profileData.interests.length > 0 ? (
                      profileData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 border"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">No interests selected</span>
                    )}
                  </div>
                </div>
                
                {/* Online Presence */}
                <div className="sm:col-span-3 relative group">
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LinkedIn URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="linkedin"
                      id="linkedin"
                      value={profileData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white pr-10"
                    />
                    <button 
                      onClick={() => openModal('linkedin')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="sm:col-span-3 relative group">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Globe className="h-4 w-4 inline mr-1" /> 
                    Website
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="website"
                      id="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white pr-10"
                    />
                    <button 
                      onClick={() => openModal('website')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="sm:col-span-3 relative group">
                  <label htmlFor="languages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Languages className="h-4 w-4 inline mr-1" /> 
                    Preferred Languages
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="languages"
                      id="languages"
                      value={profileData.languages}
                      onChange={handleInputChange}
                      placeholder="e.g., English, Spanish, French"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white pr-10"
                    />
                    <button 
                      onClick={() => openModal('languages')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="sm:col-span-3 relative group">
                  <label htmlFor="eventsAttending" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" /> 
                    Event(s) Attending
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="eventsAttending"
                      id="eventsAttending"
                      value={profileData.eventsAttending}
                      onChange={handleInputChange}
                      placeholder="e.g., DevCon 2023, TechMeetup"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white pr-10"
                    />
                    <button 
                      onClick={() => openModal('eventsAttending')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="sm:col-span-6 relative group">
                  <label htmlFor="customTags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Tag className="h-4 w-4 inline mr-1" /> 
                    Custom Tags
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="customTags"
                      id="customTags"
                      value={profileData.customTags}
                      onChange={handleInputChange}
                      placeholder="e.g., Open to Freelance, Founder, Remote Worker"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white pr-10"
                    />
                    <button 
                      onClick={() => openModal('customTags')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Separate tags with commas. These will be used for better matchmaking.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : saveSuccess ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </Tabs.Content>
          
          <Tabs.Content value="notifications">
            {/* Keep existing notifications content */}
          </Tabs.Content>
          
          <Tabs.Content value="privacy">
            {/* Keep existing privacy content */}
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}