import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  startTime: string; // Added field for start time (HH:MM format)
  endTime: string;   // Added field for end time (HH:MM format)
  isVirtual: boolean;
  location: string;
  code: string;
  speakerList: {
    userId: mongoose.Types.ObjectId;
    name: string;
    bio: string;
  }[];
  topics: string[];
  attendees: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // Added field
    endTime: { type: String, required: true },   // Added field
    isVirtual: { type: Boolean, default: false },
    location: { type: String },
    code: { type: String, required: true, unique: true },
    speakerList: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        bio: { type: String },
      },
    ],
    topics: [{ type: String }],
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
export default Event;