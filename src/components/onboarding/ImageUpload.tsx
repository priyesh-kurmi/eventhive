"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "event_hive"); // Create this preset in your Cloudinary account
      
      // For now, this is a placeholder. In a real app, you'd use your Cloudinary credentials
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/your-cloud-name/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      const data = await response.json();
      
      if (data.secure_url) {
        onChange(data.secure_url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // Fallback to a placeholder for demo purposes
      onChange(`https://ui-avatars.com/api/?name=${Math.random().toString(36).substring(7)}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemove = () => {
    onChange("");
  };
  
  return (
    <div className="flex flex-col items-center">
      {value ? (
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <Image 
              src={value} 
              alt="Profile" 
              width={128} 
              height={128} 
              className="object-cover w-full h-full"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="relative w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Upload size={32} className="text-gray-400" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}
      <p className="text-sm text-gray-500 mt-2">
        {value ? "Click to change" : "Upload profile picture"}
      </p>
    </div>
  );
}