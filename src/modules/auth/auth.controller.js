import { SignupSchema, updatePasswordSchema } from "./auth.schema.js";
import {
  forgotPasswordService,
  SignInService,
  SignupService,
  UpdatePasswordService,
} from "./auth.service.js";
import User from "../user/user.model.js";

export const SignupController = async (req, res) => {
  const dto = req.body;
  const validateData = await SignupSchema.safeParseAsync(dto);
  if (!validateData.success) {
    res.status(400).json({
      message: "Invalid input data",
      errors: validateData.error.issues[0].message,
    });
  }
  const result = await SignupService(req, res, dto);
  return res.status(201).json({
    message: "signup successful",
    result,
  });
};
export const SignInController = async (req, res) => {
  const dto = req.body;
  const { email, password } = dto;

  const result = await SignInService(req, res, dto);
  res.cookie("cinimagoAccessToken", result.data.token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.status(200).json({ message: "User signed in successfully", result });
};
export const UpdatePasswordController = async (req, res) => {
  const dto = req.body;
  console.log(req.user);
  const validateData = await updatePasswordSchema.safeParseAsync(dto);
  if (!validateData.success) {
    return res.status(400).json({
      message: "Invalid input data",
      errors: validateData.error.issues,
    });
  }
  const result = await UpdatePasswordService(req, res, dto);
  return result;
};
export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  const result = await forgotPasswordService(email, req, res);
  return result;
};
