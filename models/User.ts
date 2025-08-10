import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false // Make password optional for Google users
  },
  avatar: {
    type: String
  },
  bio: {
    type: String
  },
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  experience: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Expert'],
    default: 'Beginner'
  },
  lookingFor: [{
    type: String
  }],
  location: {
    type: String
  },
  timezone: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  connections: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);