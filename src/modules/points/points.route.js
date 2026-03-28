import { Router } from "express";
import { PointsLedgerModel } from "../../models/points-ledger.model.js";
import { UserModel } from "../../models/user.model.js";

const router = Router();

router.get("/points/balance", async (req, res, next) => {
  try {
    const { openid } = req.query;

    if (!openid || typeof openid !== "string") {
      const error = new Error("openid query is required");
      error.status = 400;
      throw error;
    }

    const user = await UserModel.findOne({ openid }).lean();

    res.status(200).json({
      openid,
      points_balance: user?.points_balance || 0,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/points/records", async (req, res, next) => {
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

    const items = await PointsLedgerModel.find({ user_id: user._id }).sort({ created_at: -1 }).lean();

    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
});

export default router;
