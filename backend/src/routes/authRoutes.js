import express from "express";
import { body } from "express-validator";
import { registerManager, loginManager } from "../controllers/authController.js";

const router = express.Router();

// Register route (optional, only run once or protect it)
router.post(
  "/register",
  [
    body("username").isString().notEmpty(),
    body("password").isLength({ min: 6 }),
  ],
  registerManager
);

// Login route
router.post(
  "/login",
  [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty(),
  ],
  loginManager
);

export default router;
