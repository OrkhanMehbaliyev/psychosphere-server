import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      ssl: true,
      tlsAllowInvalidCertificates: false,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectMongo;
