import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    avatar: String,
    subscription: { type: String, default: 'free' },
    // Paytm fields
    paytmOrderId: String,
    paytmTransactionId: String,
    pendingPlan: String,
    skills: [String],
    interests: [String],
    experience: { type: String, default: 'beginner' },
    lookingFor: [String],
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);
export default User;