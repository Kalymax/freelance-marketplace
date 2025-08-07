require("dotenv").config();
import { connect } from "mongoose";
console.log("DEBUG MONGO_URI:", process.env.MONGO_URI);

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err.message);
    process.exit(1);
  }
};

export default connectDB;
