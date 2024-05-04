/* eslint-disable no-console */
import mongoose, { ConnectOptions } from 'mongoose';

let mongoDB: mongoose.Mongoose;

const connectDB = async () => {
  try {
    mongoDB = await mongoose.connect(process.env.MONGODB_URL!, {} satisfies ConnectOptions);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (!mongoDB) return;
  try {
    await mongoDB.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default { connectDB, disconnectDB };
