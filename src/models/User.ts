import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
  profession: string;
  skills: string[];
  interests: string[];
  bio: string;
  avatar: string;
  connections: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    clerkId: { type: String, required: true, unique: true },
    profession: { type: String, default: '' },
    skills: [{ type: String }],
    interests: [{ type: String }],
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    connections: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;