import mongoose from 'mongoose';
import { getRequiredEnvVar } from './env-validation';

const MONGODB_URI = getRequiredEnvVar('MONGODB_URI');

let cached = (global as any).mongoose;

if (!cached) {
  cached = {
    conn: null,
    promise: null,
  };
  (global as any).mongoose = cached;
}

async function dbConnect() {
  // In development, if MongoDB URI is a placeholder, skip connection
  if (process.env.NODE_ENV === 'development' && 
      (MONGODB_URI.includes('your-') || MONGODB_URI.includes('placeholder'))) {
    console.warn('⚠️  Skipping MongoDB connection in development due to placeholder URI');
    return null;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;