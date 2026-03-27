import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    openid: { type: String, required: true, unique: true },
    nickname: { type: String, default: "" },
    phone: { type: String, default: "" },
    points_balance: { type: Number, default: 0 },
  },
  {
    collection: "users",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

export const UserModel = mongoose.model("User", userSchema);
