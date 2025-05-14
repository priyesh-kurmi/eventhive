import mongoose from 'mongoose';

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add the mongoose object to the global type
declare global {
  var mongoose: GlobalMongoose | undefined;
}

// Initialize global mongoose object to prevent multiple connections during hot reloading
const globalMongoose = global.mongoose || { conn: null, promise: null };
global.mongoose = globalMongoose;

export async function connectToDatabase() {
  if (globalMongoose.conn) {
    return globalMongoose.conn;
  }

  if (!globalMongoose.promise) {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    globalMongoose.promise = mongoose.connect(uri);
  }

  globalMongoose.conn = await globalMongoose.promise;
  return globalMongoose.conn;
}