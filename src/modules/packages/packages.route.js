import { Router } from "express";
import { PackageModel } from "../../models/package.model.js";

const router = Router();

router.get("/packages", async (_req, res, next) => {
  try {
    const items = await PackageModel.find({ status: "PUBLISHED" })
      .sort({ sort_order: 1, created_at: -1 })
      .lean();

    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
});

export default router;
