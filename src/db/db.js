import dns from "node:dns/promises";
import mongoose from "mongoose";
import "dotenv/config";

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectToDatabase = async () => {
  const mongoUri = process.env.DB_STRING;

  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  try {
    await mongoose.connect(mongoUri, { dbName: "shopit" });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Could not connect to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
