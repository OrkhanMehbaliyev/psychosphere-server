import { z } from "zod";

export const registerSchema = z.object({
  fullname: z
    .string()
    .min(2, "Fullname must be at least 2 characters long")
    .max(100, "Fullname must be at most 100 characters long"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(60, "Password must be at most 60 characters long"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Wrong password").max(60, "Wrong password"),
});
