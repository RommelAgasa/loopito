// db.js
import mongoose from 'mongoose';

let cached = global.mongoose; // reuse cached connection in serverless

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Mongoose v7+ does NOT need useNewUrlParser/useUnifiedTopology
    cached.promise = mongoose.connect(process.env.MONGODB_URI)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
