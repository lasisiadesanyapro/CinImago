import { email, z } from "zod";

export const SignupSchema = z
  .object({
    email: z.email(),
    firstName: z.string().min(1).max(250),
    lastName: z.string().min(1).max(250),
    password: z.string().min(8).max(200),
  })
  .strict();

export const updatePasswordSchema = z
  .object({
    newPassword: z.string().min(8).max(20),
    oldPassword: z.string(),
    email: z.email(),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z.email(),
  })
  .strict();
