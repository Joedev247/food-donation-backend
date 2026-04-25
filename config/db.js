const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MongoMemoryServer } = require("mongodb-memory-server");

dotenv.config();

let mongoServer;

async function connectDB() {
  let uri = process.env.MONGO_URI;

  if (!uri && process.env.NODE_ENV === "production") {
    throw new Error("MONGO_URI is not defined in production environment variables.");
  }

  if (!uri) {
    console.log("MONGO_URI not set. Starting in-memory MongoDB for development...");
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("MongoDB connection failed. Falling back to in-memory MongoDB for development...");
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to in-memory MongoDB");
    } else {
      throw err;
    }
  }
}

module.exports = { connectDB };
