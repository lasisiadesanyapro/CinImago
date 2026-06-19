import express from "express";
import {
  forgotPasswordController,
  SignInController,
  SignupController,
  UpdatePasswordController,
} from "./auth.controller.js";
import { isAuth } from "../../middleware/authentication.middleware.js";
const authRouter = express.Router();

authRouter.post("/sign-up", SignupController);
authRouter.post("/sign-in", SignInController);
authRouter.put("/update-password", isAuth, UpdatePasswordController);
authRouter.patch("/forgot-password", forgotPasswordController);
export default authRouter;
