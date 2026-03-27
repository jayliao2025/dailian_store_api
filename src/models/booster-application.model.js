import mongoose from "mongoose";

const boosterApplicationSchema = new mongoose.Schema(
  {
    applicant_name: { type: String, required: true },
    contact: { type: String, required: true },
    game_experience: { type: String, default: "" },
    status: { type: String, default: "PENDING" },
    reviewer: { type: String, default: "" },
    reviewed_at: { type: Date },
  },
  {
    collection: "booster_applications",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

export const BoosterApplicationModel = mongoose.model("BoosterApplication", boosterApplicationSchema);
