import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'admin'],
    default: ['read']
  }],
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  founderId: {
    type: String,
    required: true
  },
  members: [teamMemberSchema],
  openRoles: [{
    type: String
  }],
  stage: {
    type: String,
    enum: ['idea', 'mvp', 'growth', 'scaling'],
    default: 'idea'
  },
  industry: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Team || mongoose.model('Team', teamSchema); 