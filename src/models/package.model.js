import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    cover_url: { type: String, default: "" },
    price_cent: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["PUBLISHED", "UNPUBLISHED"],
      default: "UNPUBLISHED",
      index: true,
    },
    sort_order: { type: Number, default: 0 },
  },
  {
    collection: "packages",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

packageSchema.index({ status: 1, sort_order: 1 });

export const PackageModel = mongoose.model("Package", packageSchema);
