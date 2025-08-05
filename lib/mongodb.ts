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