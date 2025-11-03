import { z } from "zod";

export const username = z
  .string()
  .min(3, "Username must be at least 3 characters");

export const email = z.string().email("Invalid email format");

export const password = z
  .string()
  .min(4, "Password must be at least 4 characters");

export const mobile = z
  .string()
  .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits");

export const role = z
  .enum(["customer", "admin", "seller", "manager", "employee"])
  .default("customer");

export const image = z.string().url("Invalid image URL").nullable().optional();
