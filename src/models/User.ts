import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  username?: string;
  profession?: string;
  company?: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  interests?: string[];
  isOnboarded: boolean;
  authProvider: 'credentials' | 'google';
  oAuthId?: string; // For Google auth
  // Extended fields
  yearsExperience?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  languages?: string;
  customTags?: string;
  joinedEvents?: mongoose.Types.ObjectId[];
  createdEvents?: mongoose.Types.ObjectId[];
  eventPreferences?: {
    eventTypes?: string[];
    formats?: string[];
    networkingGoals?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { 
      type: String,
      required: false 
    },
    email: { 
      type: String, 
      required: true,
      unique: true 
    },
    password: { 
      type: String,
      required: false // Not required for Google auth
    },
    username: { 
      type: String, 
      required: false,
      unique: true 
    },
    oAuthId: {
      type: String,
      required: false
    },
    profession: { type: String },
    company: { type: String },
    bio: { 
      type: String,
      default: "" 
    },
    avatar: { 
      type: String,
      default: "" 
    },
    skills: [{ type: String }],
    interests: [{ type: String }],
    isOnboarded: {
      type: Boolean,
      default: false
    },
    authProvider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials"
    },
    // Extended fields
    yearsExperience: { type: String },
    location: { type: String },
    linkedin: { type: String },
    website: { type: String },
    languages: { type: String },
    customTags: { type: String },
    joinedEvents: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Event' 
    }],
    createdEvents: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Event' 
    }],
    eventPreferences: {
      eventTypes: [{ type: String }],
      formats: [{ type: String }],
      networkingGoals: [{ type: String }],
    },
  },
  { timestamps: true }
);

// Prevent duplicate model compilation error in development
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;