import mongoose from "mongoose";

const customerServiceConfigSchema = new mongoose.Schema(
  {
    qr_code_url: { type: String, default: "" },
    service_text: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
  },
  {
    collection: "customer_service_configs",
    timestamps: { createdAt: false, updatedAt: "updated_at" },
    versionKey: false,
  }
);

export const CustomerServiceConfigModel = mongoose.model("CustomerServiceConfig", customerServiceConfigSchema);
