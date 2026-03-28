import { env } from "../config/env.js";

export function requireAdmin(req, _res, next) {
  if (req.headers["x-admin-token"] !== env.adminToken) {
    const error = new Error("Unauthorized");
    error.status = 401;
    return next(error);
  }

  next();
}
