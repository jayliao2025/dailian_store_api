import { Router } from "express";
import { isMongoReady } from "../../db/mongo.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    mongo: isMongoReady() ? "connected" : "disconnected",
  });
});

export default router;
