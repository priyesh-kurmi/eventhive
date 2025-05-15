import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  isVirtual: boolean;
  location: string;
  code: string; // Add this line for event code
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
    isVirtual: { type: Boolean, default: false },
    location: { type: String },
    code: { type: String, required: true, unique: true }, // Add this line
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