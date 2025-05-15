import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  eventId: mongoose.Types.ObjectId;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  avatar?: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    eventId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true 
    },
    senderId: { 
      type: String, 
      required: true 
    },
    senderName: {
      type: String,
      required: true
    },
    content: { 
      type: String, 
      required: true 
    },
    timestamp: { 
      type: Number, 
      default: () => Date.now()
    },
    avatar: {
      type: String
    }
  }
);

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);