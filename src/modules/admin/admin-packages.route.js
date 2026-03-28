import { Router } from "express";
import mongoose from "mongoose";
import { PackageModel } from "../../models/package.model.js";
import { requireAdmin } from "../../middlewares/admin-auth.js";

const router = Router();

router.use(requireAdmin);

router.get("/packages", async (_req, res, next) => {
  try {
    const items = await PackageModel.find().sort({ sort_order: 1, created_at: -1 }).lean();
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
});

router.post("/packages", async (req, res, next) => {
  try {
    const { title, cover_url = "", price_cent, description = "", sort_order = 0 } = req.body;

    if (!title || typeof title !== "string") {
      const error = new Error("title is required");
      error.status = 400;
      throw error;
    }

    if (!Number.isInteger(price_cent) || price_cent < 0) {
      const error = new Error("price_cent must be a non-negative integer");
      error.status = 400;
      throw error;
    }

    const created = await PackageModel.create({
      title: title.trim(),
      cover_url,
      price_cent,
      description,
      sort_order,
      status: "UNPUBLISHED",
    });

    res.status(201).json({ item: created.toObject() });
  } catch (error) {
    next(error);
  }
});

router.put("/packages/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid package id");
      error.status = 400;
      throw error;
    }

    const updates = {};
    const fields = ["title", "cover_url", "price_cent", "description", "sort_order"];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.title !== undefined && (!updates.title || typeof updates.title !== "string")) {
      const error = new Error("title must be a non-empty string");
      error.status = 400;
      throw error;
    }

    if (updates.price_cent !== undefined && (!Number.isInteger(updates.price_cent) || updates.price_cent < 0)) {
      const error = new Error("price_cent must be a non-negative integer");
      error.status = 400;
      throw error;
    }

    const item = await PackageModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();

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

router.post("/packages/:id/publish", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid package id");
      error.status = 400;
      throw error;
    }

    const item = await PackageModel.findByIdAndUpdate(id, { status: "PUBLISHED" }, { new: true }).lean();

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

router.post("/packages/:id/unpublish", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid package id");
      error.status = 400;
      throw error;
    }

    const item = await PackageModel.findByIdAndUpdate(id, { status: "UNPUBLISHED" }, { new: true }).lean();

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
