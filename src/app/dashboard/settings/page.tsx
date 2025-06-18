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
  X,
} from "lucide-react";
import { Tabs } from "@ark-ui/react";
import ImageUpload from "@/components/onboarding/ImageUpload";

// Skill and Interest options
const SKILL_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Data Science",
  "Machine Learning",
  "UI/UX",
  "Product Management",
  "DevOps",
  "Cloud Computing",
  "Blockchain",
  "Mobile Development",
];

const INTEREST_OPTIONS = [
  "Web Development",
  "AI & Machine Learning",
  "Blockchain",
  "IoT",
  "Cloud Computing",
  "Mobile Development",
  "UI/UX Design",
  "Data Science",
  "Cybersecurity",
  "Product Management",
  "Startup",
  "Open Source",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [initialProfileData, setInitialProfileData] = useState<any>(null);

  // User profile data state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "", // Added username field
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
          const updatedProfileData = {
            name: userData.name || "",
            email: userData.email || "",
            username: userData.username || "", // Include username
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
          };

          setProfileData(updatedProfileData);
          setInitialProfileData(updatedProfileData);
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
      "name",
      "username",
      "bio",
      "profession",
      "company",
      "avatar",
      "skills",
      "interests",
      "yearsExperience",
      "location",
      "linkedin",
      "website",
      "languages",
      "customTags",
      "eventsAttending",
    ];

    let filledFields = 0;

    fields.forEach((field) => {
      const value = profileData[field as keyof typeof profileData];
      if (
        (value && typeof value === "string" && value.trim() !== "") ||
        (Array.isArray(value) && value.length > 0)
      ) {
        filledFields++;
      }
    });

    setCompletionPercentage(Math.round((filledFields / fields.length) * 100));
  }, [profileData, loading]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check username availability when typing in username field
    if (name === "username") {
      // Debounce the username check
      const timer = setTimeout(() => {
        if (value && value.length >= 3) {
          checkUsernameAvailability(value);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  };

  // Check if username is available
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === initialProfileData?.username) {
      setUsernameAvailable(true);
      return;
    }

    // First validate the format before checking with server
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setUsernameAvailable(false);
      return;
    }

    setCheckingUsername(true);

    try {
      const response = await fetch("/api/user/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleAvatarChange = (url: string) => {
    setProfileData((prev) => ({
      ...prev,
      avatar: url,
    }));
  };

  const handleToggleSelect = (field: "skills" | "interests", value: string) => {
    setProfileData((prev) => {
      const current = [...prev[field]];

      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((item) => item !== value) };
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
        // Update the initial data after successful save
        setInitialProfileData({ ...profileData });
      } else {
        console.error("Error updating profile:", await response.text());
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your account preferences and profile information
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Profile Completion</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{completionPercentage}% complete</p>
                </div>
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200 dark:text-gray-700"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${completionPercentage}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            
            {completionPercentage < 100 && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                Complete your profile to get better networking matches!
              </p>
            )}
          </div>
        </div>        {/* Quick Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit {modalField.charAt(0).toUpperCase() + modalField.slice(1)}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {modalField === "skills" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Skills
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2">
                      {SKILL_OPTIONS.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSelect("skills", skill)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            profileData.skills.includes(skill)
                              ? "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 scale-105"
                              : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          } border`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {modalField === "interests" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Interests
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2">
                      {INTEREST_OPTIONS.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleToggleSelect("interests", interest)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            profileData.interests.includes(interest)
                              ? "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 scale-105"
                              : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          } border`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {modalField === "bio" && (
                  <div>
                    <label
                      htmlFor="modal-bio"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Short Bio
                    </label>
                    <textarea
                      id="modal-bio"
                      name="bio"
                      rows={4}
                      value={profileData.bio}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>
                )}

                {modalField === "username" && (
                  <div>
                    <label
                      htmlFor="modal-username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Username
                    </label>
                    <input
                      id="modal-username"
                      name="username"
                      type="text"
                      value={profileData.username}
                      onChange={handleInputChange}
                      onBlur={() => checkUsernameAvailability(profileData.username)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                    {checkingUsername && (
                      <span className="text-xs text-gray-400">checking...</span>
                    )}
                    {!checkingUsername && profileData.username && (
                      <span
                        className={`text-xs ${
                          usernameAvailable ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {usernameAvailable ? "✓ available" : "✗ taken or invalid format"}
                      </span>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Username can only contain letters and numbers (no spaces or special characters)
                    </p>
                  </div>
                )}

                {(modalField === "name" ||
                  modalField === "profession" ||
                  modalField === "company" ||
                  modalField === "yearsExperience" ||
                  modalField === "location" ||
                  modalField === "linkedin" ||
                  modalField === "website" ||
                  modalField === "languages" ||
                  modalField === "customTags" ||
                  modalField === "eventsAttending") && (
                  <div>
                    <label
                      htmlFor={`modal-${modalField}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      {modalField.charAt(0).toUpperCase() +
                        modalField.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      id={`modal-${modalField}`}
                      name={modalField}
                      type="text"
                      value={
                        profileData[modalField as keyof typeof profileData] as string
                      }
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}

                {modalField === "avatar" && (
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
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    handleSave();
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}        {/* Tabs Section */}
        <Tabs.Root
          value={activeTab}
          onValueChange={(details) => setActiveTab(details.value)}
        >
          {/* Tab Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1 mb-6">
            <Tabs.List className="flex space-x-1">
              <Tabs.Trigger
                value="profile"
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "profile"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Tabs.Trigger>
              <Tabs.Trigger
                value="notifications"
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "notifications"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Tabs.Trigger>
              <Tabs.Trigger
                value="privacy"
                className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "privacy"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Privacy
              </Tabs.Trigger>
            </Tabs.List>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Tabs.Content value="profile">
              <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Profile Information
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Update your personal details and professional information
                    </p>
                  </div>
                </div>

                {/* Profile Image Upload */}
                <div className="mb-8 flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-3 flex items-center justify-center relative border-4 border-white dark:border-gray-800 shadow-lg">
                      {profileData.avatar ? (
                        <img
                          src={profileData.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                      <button
                        onClick={() => openModal("avatar")}
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 rounded-full"
                      >
                        <Edit className="h-5 w-5 text-white" />
                      </button>
                    </div>
                    <button
                      onClick={() => openModal("avatar")}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Basic Information */}
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => openModal("name")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Username field */}
                  <div className="space-y-1">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Username
                      <span className="text-indigo-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={profileData.username}
                        onChange={handleInputChange}
                        onBlur={() => checkUsernameAvailability(profileData.username)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => openModal("username")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    {checkingUsername && (
                      <span className="text-xs text-gray-400">Checking availability...</span>
                    )}
                    {!checkingUsername && profileData.username && (
                      <span
                        className={`text-xs ${
                          usernameAvailable ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {usernameAvailable ? "✓ Username available" : "✗ Username taken"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileData.email}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email is managed by your authentication provider
                    </p>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Short Bio
                    </label>
                    <div className="relative">
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={profileData.bio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                        placeholder="Tell us a bit about yourself..."
                      />
                      <button
                        onClick={() => openModal("bio")}
                        className="absolute right-2 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-1">
                    <label
                      htmlFor="profession"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Profession/Role
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="profession"
                        id="profession"
                        value={profileData.profession}
                        onChange={handleInputChange}
                        placeholder="e.g., Software Engineer"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => openModal("profession")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
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
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => openModal("company")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="yearsExperience"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
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
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => openModal("yearsExperience")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
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
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => openModal("location")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Skills and Interests */}
                <div className="mt-8 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Skills
                      </label>
                      <button
                        onClick={() => openModal("skills")}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center font-medium"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit Skills
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                      {profileData.skills.length > 0 ? (
                        profileData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400 py-1">
                          No skills selected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Key Interests
                      </label>
                      <button
                        onClick={() => openModal("interests")}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center font-medium"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit Interests
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                      {profileData.interests.length > 0 ? (
                        profileData.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400 py-1">
                          No interests selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
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
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => openModal("linkedin")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
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
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => openModal("website")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="languages"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      <Languages className="h-4 w-4 inline mr-1" />
                      Languages
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="languages"
                        id="languages"
                        value={profileData.languages}
                        onChange={handleInputChange}
                        placeholder="e.g., English, Spanish, French"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => openModal("languages")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="eventsAttending"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Events Attending
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="eventsAttending"
                        id="eventsAttending"
                        value={profileData.eventsAttending}
                        onChange={handleInputChange}
                        placeholder="e.g., DevCon 2023, TechMeetup"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => openModal("eventsAttending")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label
                      htmlFor="customTags"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
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
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={() => openModal("customTags")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Separate tags with commas. These will be used for better matchmaking.
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      {!usernameAvailable && profileData.username && (
                        <p className="text-sm text-red-500">
                          Please choose a different username before saving
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={loading || !usernameAvailable}
                      className={`inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg shadow-lg transition-all duration-200 ${
                        loading || !usernameAvailable
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:ring-offset-gray-800"
                      }`}
                    >
                      {loading ? (
                        <span className="inline-flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </span>
                      ) : saveSuccess ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Saved Successfully
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
              </div>
            </Tabs.Content>

            <Tabs.Content value="notifications">
              <div className="p-6">
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Notification Settings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Customize how you receive notifications about events, messages, and updates.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Notification preferences will be available in a future update.
                    </p>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="privacy">
              <div className="p-6">
                <div className="text-center py-12">
                  <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Privacy Settings
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Control your privacy preferences and data visibility settings.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Privacy settings will be available in a future update.
                    </p>
                  </div>
                </div>
              </div>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}
