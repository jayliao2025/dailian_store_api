import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    out_trade_no: { type: String, required: true, unique: true },
    wx_transaction_id: { type: String, default: "" },
    amount_cent: { type: Number, required: true, min: 0 },
    pay_status: { type: String, required: true },
    callback_payload: { type: String, default: "" },
    callback_at: { type: Date },
  },
  {
    collection: "payment_transactions",
    timestamps: { createdAt: "created_at", updatedAt: false },
    versionKey: false,
  }
);

export const PaymentTransactionModel = mongoose.model("PaymentTransaction", paymentTransactionSchema);
