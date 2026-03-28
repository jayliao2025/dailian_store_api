import { Router } from "express";
import healthRouter from "../modules/health/health.route.js";
import packagesRouter from "../modules/packages/packages.route.js";
import ordersRouter from "../modules/orders/orders.route.js";
import pointsRouter from "../modules/points/points.route.js";
import adminAuthRouter from "../modules/admin/admin-auth.route.js";
import adminPackagesRouter from "../modules/admin/admin-packages.route.js";
import adminOrdersRouter from "../modules/admin/admin-orders.route.js";

const router = Router();

router.use(healthRouter);
router.use("/api", packagesRouter);
router.use("/api", ordersRouter);
router.use("/api", pointsRouter);
router.use("/admin", adminAuthRouter);
router.use("/admin", adminPackagesRouter);
router.use("/admin", adminOrdersRouter);

export default router;
