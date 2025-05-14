import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  readAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    readAt: { type: Date },
  },
  { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export default Message;