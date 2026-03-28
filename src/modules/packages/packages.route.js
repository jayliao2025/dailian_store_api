import { Router } from "express";
import mongoose from "mongoose";
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

router.get("/packages/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error("Invalid package id");
      error.status = 400;
      throw error;
    }

    const item = await PackageModel.findOne({ _id: req.params.id, status: "PUBLISHED" }).lean();

    if (!item) {
      const error = new Error("Package not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
});

export default router;
