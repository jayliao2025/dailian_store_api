import { Router } from "express";
import healthRouter from "../modules/health/health.route.js";
import packagesRouter from "../modules/packages/packages.route.js";

const router = Router();

router.use(healthRouter);
router.use("/api", packagesRouter);

export default router;
