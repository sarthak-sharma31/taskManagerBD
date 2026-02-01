import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;

const connectDB = async()=>{
    try {
        await mongoose.connect(URI);
        console.log("Connected To DB");
    } catch (error) {
        console.log("DB connection error", error);
    }
}

export default connectDB;