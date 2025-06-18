import mongoose from 'mongoose';

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add the mongoose object to the global type
declare global {
  // eslint-disable-next-line no-var
  var mongoose: GlobalMongoose | undefined;
}

// Initialize global mongoose object to prevent multiple connections during hot reloading
const globalMongoose = global.mongoose || { conn: null, promise: null };
global.mongoose = globalMongoose;

export async function connectToDatabase() {
  try {
    if (globalMongoose.conn) {
      console.log("Using existing MongoDB connection");
      return globalMongoose.conn;
    }

    if (!globalMongoose.promise) {
      const uri = process.env.MONGODB_URI;
      
      if (!uri) {
        throw new Error('MongoDB URI is not defined in environment variables');
      }

      console.log("Attempting to connect to MongoDB...");
      
      // Set connection options with longer timeout and better error handling
      const options = {
        serverSelectionTimeoutMS: 10000, // Increase timeout to 10 seconds
      };
      
      globalMongoose.promise = mongoose.connect(uri, options);
    }

    globalMongoose.conn = await globalMongoose.promise;
    console.log("Successfully connected to MongoDB");
    return globalMongoose.conn;
    
  } catch (error) {
    console.error("MongoDB connection error details:", error);
    console.log("IMPORTANT: This may be an IP whitelist issue. Please add your current IP to MongoDB Atlas Network Access whitelist.");
    console.log("Visit: https://cloud.mongodb.com > Security > Network Access > Add IP Address");
    throw error;
  }
}