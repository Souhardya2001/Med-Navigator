const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGO_URI_AUTH) throw new Error("MONGO_URI_AUTH is required");
  await mongoose.connect(process.env.MONGO_URI_AUTH);
  console.log("Auth MongoDB connected");
}

module.exports = connectDB;
