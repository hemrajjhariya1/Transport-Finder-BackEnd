import mongoose from 'mongoose';
import { env, validateEnv } from './env.js';

export async function connectDb() {
  validateEnv();

  try {
    await mongoose.connect(env.mongoUri);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

export const db = mongoose.connection;
