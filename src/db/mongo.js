import mongoose from "mongoose";

export async function connectMongo(mongoUri) {
  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });
}

export function isMongoReady() {
  return mongoose.connection.readyState === 1;
}
