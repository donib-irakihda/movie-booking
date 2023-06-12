import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB connected successfully");
  } catch (error) {
    console.log("Mongo DB connection error", error);
  }
};

export default connectDB;
