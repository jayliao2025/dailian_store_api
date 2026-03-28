import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const pointsEarnRate = Number(process.env.POINTS_EARN_RATE || 10);

if (!Number.isFinite(pointsEarnRate) || pointsEarnRate < 0) {
  throw new Error("POINTS_EARN_RATE must be a non-negative number");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGO_URI,
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "123456",
  adminToken: process.env.ADMIN_TOKEN || "demo-admin-token",
  pointsEarnRate,
};
