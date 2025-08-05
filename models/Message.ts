import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['text', 'file', 'system'],
    default: 'text'
  },
  readBy: [{
    type: String
  }]
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema); 