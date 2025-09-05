import 'dotenv/config';
import mongoose from 'mongoose';

export async function initDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/meapi';
  await mongoose.connect(uri, {
    autoIndex: true
  });
  mongoose.connection.on('error', (err) => {
    console.error('Mongo connection error:', err);
  });
  console.log('MongoDB connected');
}

export function getConnection() {
  return mongoose.connection;
}