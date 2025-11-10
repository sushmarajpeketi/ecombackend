import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const roleNameRegex = /^[A-Za-z ]+$/;

export const username = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters");

export const email = z.string().email("Invalid email format");

export const password = z
  .string()
  .min(4, "Password must be at least 4 characters");

export const mobile = z.coerce.string()
  .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits");

export const role = z
  .string()
  .trim()
  .min(1, "Role is required")
  .refine(
    (v) => objectIdRegex.test(v) || roleNameRegex.test(v),
    "Role must be an ObjectId or a valid name"
  );

export const image = z.string().url("Invalid image URL").nullable().optional();
