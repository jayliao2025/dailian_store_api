import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order_no: { type: String, required: true, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    package_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    status: { type: String, required: true },
    original_amount_cent: { type: Number, required: true, min: 0 },
    discount_points: { type: Number, default: 0, min: 0 },
    pay_amount_cent: { type: Number, required: true, min: 0 },
    server_region: { type: String, default: "" },
    remark: { type: String, default: "" },
    paid_at: { type: Date },
    finished_at: { type: Date },
  },
  {
    collection: "orders",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

orderSchema.index({ user_id: 1, created_at: -1 });
orderSchema.index({ status: 1, created_at: -1 });

export const OrderModel = mongoose.model("Order", orderSchema);
