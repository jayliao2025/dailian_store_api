import mongoose from "mongoose";

const pointsLedgerSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, index: true },
    change_type: { type: String, enum: ["EARN", "USE", "ROLLBACK"], required: true },
    points_delta: { type: Number, required: true },
    balance_after: { type: Number, required: true },
  },
  {
    collection: "points_ledgers",
    timestamps: { createdAt: "created_at", updatedAt: false },
    versionKey: false,
  }
);

pointsLedgerSchema.index({ order_id: 1, change_type: 1 }, { unique: true, partialFilterExpression: { order_id: { $exists: true } } });
pointsLedgerSchema.index({ user_id: 1, created_at: -1 });

export const PointsLedgerModel = mongoose.model("PointsLedger", pointsLedgerSchema);
