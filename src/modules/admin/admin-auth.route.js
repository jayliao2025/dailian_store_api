import { Router } from "express";
import { env } from "../../config/env.js";

const router = Router();

router.post("/login", (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      const error = new Error("username and password are required");
      error.status = 400;
      throw error;
    }

    if (username !== env.adminUsername || password !== env.adminPassword) {
      const error = new Error("Invalid username or password");
      error.status = 401;
      throw error;
    }

    res.status(200).json({
      token: env.adminToken,
      user: {
        username: env.adminUsername,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
