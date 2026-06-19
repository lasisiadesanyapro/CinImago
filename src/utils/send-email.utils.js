import "dotenv/config";
import nodemailer from "nodemailer";

import crypto from "node:crypto";

export const sendResetPasswordEmail = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const resetLink = `${process.env.CLIENT_URL}/auth/reset-password?token=${token}&email=${email}`;

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  await transporter.sendMail({
    from: "no-reply@yourapp.com",
    to: email,
    subject: "Reset Your Password",

    html: `
      <div style="font-family: Arial;">
        <h2>Password Reset Request</h2>

        <p>You requested to reset your password.</p>

        <p>Click the button below:</p>

        <a href="${resetLink}"
           style="
             display:inline-block;
             padding:10px 16px;
             background:#4f46e5;
             color:white;
             text-decoration:none;
             border-radius:6px;
           ">
          Reset Password
        </a>

        <p>If you did not request this, ignore this email.</p>
      </div>
    `,
  });

  return token;
};
