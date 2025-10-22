import mongoose from 'mongoose';

let isConnected = false; // Track the connection status

export async function connectDB() {
  if (isConnected) {
    // If already connected, reuse the existing connection
    console.log('MongoDB already connected');
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('Please define the MONGODB_URI environment variable in .env.local');
    }

    // Connect to MongoDB
    const db = await mongoose.connect(mongoURI);

    isConnected = db.connections[0].readyState === 1;

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}
