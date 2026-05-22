import {
  registerUser,
  loginUser,
  logoutUser,
  requireAuth,
  getCurrentUser,
} from "../controllers/authController.js";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/signup", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/me", requireAuth, getCurrentUser);
