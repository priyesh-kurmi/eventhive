import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
  username: string; // New username field
  profession?: string;
  company?: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  interests?: string[];
  events?: mongoose.Types.ObjectId[];
  // Extended fields
  yearsExperience?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  languages?: string;
  customTags?: string;
  eventsAttending?: string;
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
    name: { type: String, required: true },
    email: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true }, // Unique username
    profession: { type: String },
    company: { type: String },
    bio: { type: String },
    avatar: { type: String },
    skills: [{ type: String }],
    interests: [{ type: String }],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    // Extended fields
    yearsExperience: { type: String },
    location: { type: String },
    linkedin: { type: String },
    website: { type: String },
    languages: { type: String },
    customTags: { type: String },
    eventsAttending: { type: String },
    eventPreferences: {
      eventTypes: [{ type: String }],
      formats: [{ type: String }],
      networkingGoals: [{ type: String }],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;