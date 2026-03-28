import { Router } from "express";
import { requireAdmin } from "../../middlewares/admin-auth.js";
import { env } from "../../config/env.js";
import { OrderModel } from "../../models/order.model.js";
import { PointsLedgerModel } from "../../models/points-ledger.model.js";
import { UserModel } from "../../models/user.model.js";

const router = Router();

router.use(requireAdmin);

router.get("/orders", async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const items = await OrderModel.find(filter).sort({ created_at: -1 }).lean();
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
});

router.get("/orders/:orderNo", async (req, res, next) => {
  try {
    const order = await OrderModel.findOne({ order_no: req.params.orderNo }).lean();

    if (!order) {
      const error = new Error("Order not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({ item: order });
  } catch (error) {
    next(error);
  }
});

router.post("/orders/:orderNo/start-service", async (req, res, next) => {
  try {
    const order = await OrderModel.findOne({ order_no: req.params.orderNo });

    if (!order) {
      const error = new Error("Order not found");
      error.status = 404;
      throw error;
    }

    if (order.status !== "PAID") {
      const error = new Error("Only PAID orders can start service");
      error.status = 400;
      throw error;
    }

    order.status = "IN_SERVICE";
    await order.save();

    res.status(200).json({ item: order.toObject() });
  } catch (error) {
    next(error);
  }
});

router.post("/orders/:orderNo/finish", async (req, res, next) => {
  try {
    const order = await OrderModel.findOneAndUpdate(
      { order_no: req.params.orderNo, status: "IN_SERVICE" },
      { status: "FINISHED", finished_at: new Date() },
      { new: true }
    );

    if (!order) {
      const existed = await OrderModel.findOne({ order_no: req.params.orderNo }).lean();

      if (!existed) {
        const error = new Error("Order not found");
        error.status = 404;
        throw error;
      }

      const error = new Error("Only IN_SERVICE orders can be finished");
      error.status = 400;
      throw error;
    }

    const user = await UserModel.findById(order.user_id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const earnPoints = Math.floor((order.pay_amount_cent * env.pointsEarnRate) / 100);
    let actualEarnPoints = 0;

    if (earnPoints > 0) {
      try {
        const balanceAfter = user.points_balance + earnPoints;

        await PointsLedgerModel.create({
          user_id: user._id,
          order_id: order._id,
          change_type: "EARN",
          points_delta: earnPoints,
          balance_after: balanceAfter,
        });

        user.points_balance = balanceAfter;
        await user.save();
        actualEarnPoints = earnPoints;
      } catch (error) {
        if (error?.code !== 11000) {
          throw error;
        }
      }
    }

    res.status(200).json({ item: order.toObject(), earn_points: actualEarnPoints });
  } catch (error) {
    next(error);
  }
});

export default router;
