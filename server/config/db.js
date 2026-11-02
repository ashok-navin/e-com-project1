import mongoose from 'mongoose';

let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not defined in environment variables.');
    return null;
  }

  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cachedConnection.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB Connected Successfully');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      cachedConnection.promise = null;
      throw err;
    });
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
  } catch (e) {
    cachedConnection.promise = null;
    throw e;
  }

  return cachedConnection.conn;
};

export default connectDB;
