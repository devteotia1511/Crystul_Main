import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  permissions: [{
    type: String,
  }],
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  founderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [TeamMemberSchema],
  openRoles: [{
    type: String,
  }],
  stage: {
    type: String,
    enum: ['idea', 'mvp', 'growth', 'scaling'],
    default: 'idea',
  },
  industry: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  stripeSubscriptionId: {
    type: String,
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

TeamSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema); 