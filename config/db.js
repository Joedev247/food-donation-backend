const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MongoMemoryServer } = require("mongodb-memory-server");

dotenv.config();

let mongoServer;

async function connectDB() {
  let uri = process.env.MONGO_URI;

  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("MONGO_URI present:", !!uri);

  if (!uri && process.env.NODE_ENV === "production") {
    console.error("MONGO_URI is not defined in production environment variables.");
    throw new Error("MONGO_URI is not defined in production environment variables.");
  }

  if (!uri) {
    console.log("MONGO_URI not set. Starting in-memory MongoDB for development...");
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    if (process.env.NODE_ENV !== "production") {
      console.warn("Falling back to in-memory MongoDB for development...");
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to in-memory MongoDB");
    } else {
      console.error("Production MongoDB connection failed, exiting...");
      throw err;
    }
  }
}

module.exports = { connectDB };
