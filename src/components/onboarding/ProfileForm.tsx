"use client";

import { useState, useEffect } from "react";
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
  "Cybersecurity", "Product Management", "Startup", "Open Source", "Other"
];

// Inline styles
const styles = {
  formContainer: {
    width: "100%",
    background: "linear-gradient(#212121, #212121) padding-box, linear-gradient(145deg, transparent 35%,#e81cff, #40c9ff) border-box",
    border: "2px solid transparent",
    padding: "32px 24px",
    fontSize: "14px",
    color: "white",
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    boxSizing: "border-box" as const,
    borderRadius: "16px",
    backgroundSize: "200% 100%",
    animation: "gradient 5s ease infinite",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#717171",
    fontWeight: "600",
    fontSize: "12px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    color: "#fff",
    backgroundColor: "transparent",
    border: "1px solid #414141",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    color: "#fff",
    backgroundColor: "transparent",
    border: "1px solid #414141",
    resize: "none" as const,
    minHeight: "96px",
    outline: "none",
  },
  errorMessage: {
    color: "#ff4d6d",
    fontSize: "12px",
    marginTop: "4px",
  },
  buttonContainer: {
    paddingTop: "20px",
  },
  submitButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#313131",
    border: "1px solid #414141",
    padding: "12px 16px",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "all 0.2s ease",
  },
  submitButtonHover: {
    backgroundColor: "#414141",
  },
  disabledButton: {
    opacity: "0.7",
    cursor: "not-allowed" as const,
  },
  multiSelectContainer: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
  },
  optionButton: {
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    cursor: "pointer",
    backgroundColor: "#313131",
    color: "#fff",
    border: "1px solid #414141",
  },
  selectedOption: {
    backgroundColor: "rgba(232, 28, 255, 0.2)",
    color: "#e81cff",
    borderColor: "#e81cff",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },
  imageUploadContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    marginBottom: "20px",
  },
  headerContainer: {
    marginBottom: "24px",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#a0a0a0",
    lineHeight: "1.5",
  },
  infoBox: {
    backgroundColor: "rgba(0, 150, 255, 0.1)",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
    border: "1px solid rgba(0, 150, 255, 0.2)",
  },
  infoTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#40c9ff",
    marginBottom: "4px",
  },
  infoText: {
    fontSize: "12px",
    color: "#a0a0a0",
    lineHeight: "1.5",
  },
  footerText: {
    fontSize: "12px",
    color: "#717171",
    textAlign: "center" as const,
    marginTop: "24px",
  },
};

// Add keyframes style to document head
if (typeof window !== "undefined") {
  // Only run in browser environment
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;
  document.head.appendChild(styleEl);
}

export default function ProfileForm({ 
  clerkId, 
  isMinimal = false, 
  requiredFields = ['name', 'profession', 'bio', 'skills', 'interests'] 
}: { 
  clerkId: string;
  isMinimal?: boolean;
  requiredFields?: string[];
}) {
  const router = useRouter();
  const { setUserData } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [buttonHover, setButtonHover] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

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

  // Handle responsive layout
  useEffect(() => {
    // This only runs in the browser after component mounts
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    
    if (requiredFields.includes('name') && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (requiredFields.includes('profession') && !formData.profession.trim()) {
      newErrors.profession = "Profession is required";
    }
    
    if (requiredFields.includes('bio')) {
      if (!formData.bio.trim()) {
        newErrors.bio = "Bio is required";
      } else if (formData.bio.length < 10) {
        newErrors.bio = "Bio should be at least 10 characters";
      }
    }
    
    if (requiredFields.includes('skills') && formData.skills.length === 0) {
      newErrors.skills = "Select at least one skill";
    }
    
    if (requiredFields.includes('interests') && formData.interests.length === 0) {
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
        if (typeof window !== "undefined" && window.toast) {
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
    <div style={styles.formContainer}>
      {/* Header content moved from page.tsx */}
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Welcome to EventHive</h1>
        <p style={styles.subtitle}>
          Let's set up your basic profile to help you connect with like-minded attendees
        </p>
      </div>
      
      {/* Info box moved from page.tsx */}
      <div style={styles.infoBox}>
        <h2 style={styles.infoTitle}>Quick Start</h2>
        <p style={styles.infoText}>
          We only need a few details to get you started. You can complete your full profile later in settings.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {!isMinimal && (
          <div style={styles.imageUploadContainer}>
            <ImageUpload 
              value={formData.avatar} 
              onChange={handleAvatarChange} 
            />
            {errors.avatar && <p style={styles.errorMessage}>{errors.avatar}</p>}
          </div>
        )}
        
        <div style={{
          ...styles.gridContainer,
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr"
        }}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Full Name{requiredFields.includes('name') ? '*' : ''}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="John Doe"
            />
            {errors.name && <p style={styles.errorMessage}>{errors.name}</p>}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="profession" style={styles.label}>
              Profession{requiredFields.includes('profession') ? '*' : ''}
            </label>
            <input
              id="profession"
              name="profession"
              type="text"
              value={formData.profession}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Software Engineer"
            />
            {errors.profession && <p style={styles.errorMessage}>{errors.profession}</p>}
          </div>
          
          {(!isMinimal || requiredFields.includes('company')) && (
            <div style={styles.formGroup}>
              <label htmlFor="company" style={styles.label}>
                Company/Organization{requiredFields.includes('company') ? '*' : ''}
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Acme Inc."
              />
              {errors.company && <p style={styles.errorMessage}>{errors.company}</p>}
            </div>
          )}
        </div>
        
        {(!isMinimal || requiredFields.includes('bio')) && (
          <div style={styles.formGroup}>
            <label htmlFor="bio" style={styles.label}>
              Short Bio{requiredFields.includes('bio') ? '*' : ''}
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              style={styles.textarea}
              placeholder="Tell us a bit about yourself..."
            />
            {errors.bio && <p style={styles.errorMessage}>{errors.bio}</p>}
          </div>
        )}
        
        {(!isMinimal || requiredFields.includes('skills')) && (
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Skills{requiredFields.includes('skills') ? '*' : ''}
            </label>
            <div style={styles.multiSelectContainer}>
              {SKILL_OPTIONS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleMultiSelect("skills", skill)}
                  style={{
                    ...styles.optionButton,
                    ...(formData.skills.includes(skill) ? styles.selectedOption : {})
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>
            {errors.skills && <p style={styles.errorMessage}>{errors.skills}</p>}
          </div>
        )}
        
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Interests{requiredFields.includes('interests') ? '*' : ''} {isMinimal && '(Choose 3-5)'}
          </label>
          <div style={styles.multiSelectContainer}>
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleMultiSelect("interests", interest)}
                style={{
                  ...styles.optionButton,
                  ...(formData.interests.includes(interest) ? styles.selectedOption : {})
                }}
              >
                {interest}
              </button>
            ))}
          </div>
          {errors.interests && <p style={styles.errorMessage}>{errors.interests}</p>}
        </div>
        
        <div style={styles.buttonContainer}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitButton,
              ...(buttonHover && !isSubmitting ? styles.submitButtonHover : {}),
              ...(isSubmitting ? styles.disabledButton : {})
            }}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
          >
            {isSubmitting ? "Saving..." : isMinimal ? "Continue" : "Complete Profile Setup"}
          </button>
        </div>
        
        {/* Footer content moved from page.tsx */}
        <p style={styles.footerText}>
          You'll be able to add more details to your profile later in Settings
        </p>
      </form>
    </div>
  );
}