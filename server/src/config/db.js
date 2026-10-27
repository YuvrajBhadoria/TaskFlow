const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[TaskFlow DB] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[TaskFlow DB] Connection error: ${error.message}`);
    if (process.env.NODE_ENV === 'test') {
      throw error;
    }
    console.warn(`[TaskFlow DB] ⚠️ Could not connect to MongoDB at: ${mongoUri}`);
    console.warn(`[TaskFlow DB] 👉 To enable database persistence, please ensure MongoDB is running (e.g. 'net start MongoDB' or MongoDB Atlas connection string in server/.env).`);
    return null;
  }
};

module.exports = connectDB;
