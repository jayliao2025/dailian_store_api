import { Router } from "express";
import mongoose from "mongoose";
import { OrderModel } from "../../models/order.model.js";
import { PackageModel } from "../../models/package.model.js";
import { UserModel } from "../../models/user.model.js";

const router = Router();

function newOrderNo() {
  return `DL${Date.now()}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;
}

router.post("/orders", async (req, res, next) => {
  try {
    const { openid, package_id, server_region = "", remark = "", use_points = 0, simulate_paid = false } = req.body;

    if (!openid || typeof openid !== "string") {
      const error = new Error("openid is required");
      error.status = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(package_id)) {
      const error = new Error("Invalid package_id");
      error.status = 400;
      throw error;
    }

    if (!Number.isInteger(use_points) || use_points < 0) {
      const error = new Error("use_points must be a non-negative integer");
      error.status = 400;
      throw error;
    }

    const pkg = await PackageModel.findById(package_id).lean();

    if (!pkg || pkg.status !== "PUBLISHED") {
      const error = new Error("Package not available");
      error.status = 400;
      throw error;
    }

    let user = await UserModel.findOne({ openid });

    if (!user) {
      user = await UserModel.create({ openid });
    }

    const discountPoints = Math.min(use_points, user.points_balance);
    const payAmount = Math.max(0, pkg.price_cent - discountPoints);

    const status = simulate_paid ? "PAID" : "PENDING_PAY";
    const paidAt = simulate_paid ? new Date() : undefined;

    const order = await OrderModel.create({
      order_no: newOrderNo(),
      user_id: user._id,
      package_id: pkg._id,
      status,
      original_amount_cent: pkg.price_cent,
      discount_points: discountPoints,
      pay_amount_cent: payAmount,
      server_region,
      remark,
      paid_at: paidAt,
    });

    if (discountPoints > 0) {
      user.points_balance -= discountPoints;
      await user.save();
    }

    res.status(201).json({ item: order.toObject() });
  } catch (error) {
    next(error);
  }
});

router.get("/orders", async (req, res, next) => {
  try {
    const { openid } = req.query;

    if (!openid || typeof openid !== "string") {
      const error = new Error("openid query is required");
      error.status = 400;
      throw error;
    }

    const user = await UserModel.findOne({ openid }).lean();

    if (!user) {
      return res.status(200).json({ items: [] });
    }

    const items = await OrderModel.find({ user_id: user._id }).sort({ created_at: -1 }).lean();
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
});

router.get("/orders/:orderNo", async (req, res, next) => {
  try {
    const item = await OrderModel.findOne({ order_no: req.params.orderNo }).lean();

    if (!item) {
      const error = new Error("Order not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
});

export default router;
