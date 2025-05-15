import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
  profession?: string;
  company?: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  interests?: string[];
  events?: mongoose.Types.ObjectId[]; // Add this line
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
    profession: { type: String },
    company: { type: String },
    bio: { type: String },
    avatar: { type: String },
    skills: [{ type: String }],
    interests: [{ type: String }],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }], // Add this line
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