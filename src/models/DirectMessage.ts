import mongoose from 'mongoose';

const DirectMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
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
  read: {
    type: Boolean,
    default: false
  }
});

// Create a compound index on senderId and receiverId for faster queries
DirectMessageSchema.index({ senderId: 1, receiverId: 1 });

// Create a model if it doesn't already exist
const DirectMessage = mongoose.models.DirectMessage || mongoose.model('DirectMessage', DirectMessageSchema);

export default DirectMessage;