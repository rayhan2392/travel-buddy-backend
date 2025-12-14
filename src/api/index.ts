import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(envVars.DB_URL);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default async (req: any, res: any) => {
  await connectDB();
  return app(req, res);
};
