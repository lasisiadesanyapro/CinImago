import { sendResetPasswordEmail } from "../../utils/send-email.utils.js";
import { generateToken } from "../../utils/token.js";
import User from "../user/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const SignupService = async (req, res, dto) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(dto.password, salt);

  const user = await User.create({
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    password: hashedPassword,
  });

  return user;
};
export const SignInService = async (req, res, dto) => {
  const user = await User.findOne({
    email: dto.email,
  }).select("+password +passwordVersion +jwtVersion");

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  const isPasswordValid = await bcrypt.compare(dto.password, user.password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ message: "Password or email is not correct" });
  }

  // generate token
  const token = await generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    passwordVersion: user.passwordVersion,
    jwtVersion: user.jwtVersion,
  });

  return {
    data: {
      user,
      token,
    },
  };
};
export const UpdatePasswordService = async (req, res) => {
  const { newPassword, oldPassword, email } = req.body;
  const user = await User.findOne({
    email: email,
  }).select("+password +passwordVersion");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  user.password = hashedPassword;
  user.passwordVersion += 1;

  await user.save();

  return res.status(200).json({ message: "Password updated successfully" });
};
export const forgotPasswordService = async (email, req, res) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const randomBytes = await crypto.randomBytes(32).toString("hex");
  user.resetToken = randomBytes;
  user.resetTokenExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  const serverUrl = process.env.SERVER_URL;
  const passwordResetLink = `${req.protocol}://${serverUrl}/auth/reset-password?token=${randomBytes}&email=${email}`;

  await sendResetPasswordEmail(email);
  return res.status(200).json({ message: "Password reset link sent to email" });
};
